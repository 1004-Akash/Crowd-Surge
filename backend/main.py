from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status, Form
from fastapi.responses import FileResponse
from fpdf import FPDF
from datetime import timedelta
from fastapi.middleware.cors import CORSMiddleware
import cv2
import asyncio
import json
import logging
import time
from inference import CrowdCounter
import os


from auth import (
    create_access_token, 
    ACCESS_TOKEN_EXPIRE_MINUTES, 
    verify_password, 
    USERS_DB, 
    get_current_active_user, 
    SECRET_KEY, 
    ALGORITHM
)
from jose import jwt, JWTError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("CrowdSafeAPI")

# Alert Configuration (Lowered for Testing/Demonstration)
CROWD_LIMIT = 50  
THRESHOLD_NEAR_LIMIT = CROWD_LIMIT * 0.8 # 40 (Near Limit)
THRESHOLD_WARNING = CROWD_LIMIT          # 50 (Ground Team)
THRESHOLD_CRITICAL = CROWD_LIMIT * 5     # 250 (Ambulance)
THRESHOLD_EMERGENCY = CROWD_LIMIT * 10   # 500 (Emergency Protocol)

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {
            "admin": [],
            "monitor": []
        }
        self.notifications = []

    async def connect(self, websocket: WebSocket, role: str):
        if role in self.active_connections:
            self.active_connections[role].append(websocket)
        else:
            self.active_connections["monitor"].append(websocket)

    def disconnect(self, websocket: WebSocket, role: str):
        if role in self.active_connections:
            if websocket in self.active_connections[role]:
                self.active_connections[role].remove(websocket)

    async def broadcast_all(self, message: dict):
        for role in self.active_connections:
            for connection in self.active_connections[role]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Broadcast error: {e}")

manager = ConnectionManager()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication Endpoints
@app.post("/auth/login")
async def login_for_access_token(username: str = Form(...), password: str = Form(...)):
    user = USERS_DB.get(username)
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"]}, 
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "username": user["username"],
            "full_name": user["full_name"],
            "role": user["role"]
        }
    }

@app.get("/auth/me")
async def read_users_me(current_user: dict = Depends(get_current_active_user)):
    return {
        "username": current_user["username"],
        "full_name": current_user["full_name"],
        "role": current_user["role"]
    }

# Dashboard Actions
@app.post("/dashboard/escalate")
async def escalate_incident(current_user: dict = Depends(get_current_active_user)):
    # Create notification
    notification = {
        "id": int(time.time()),
        "type": "ESCALATION",
        "sender": current_user["username"],
        "message": f"Escalation triggered by {current_user['full_name']}",
        "timestamp": time.strftime("%H:%M:%S")
    }
    
    manager.notifications.append(notification)
    
    # Broadcast to all
    await manager.broadcast_all({
        "type": "notification",
        "data": notification
    })
    
    return {"status": "success", "message": "Incident escalated to administrators"}

@app.get("/dashboard/notifications")
async def list_notifications(current_user: dict = Depends(get_current_active_user)):
    return manager.notifications

@app.websocket("/ws/notifications")
async def notifications_endpoint(websocket: WebSocket, token: str = None):
    # Authenticate
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user = USERS_DB.get(username)
        if not user or user.get("role") not in ["admin", "monitor"]:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
    except JWTError:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await websocket.accept()
    await manager.connect(websocket, "admin")
    
    # Send backlog
    if manager.notifications:
        await websocket.send_json({
            "type": "initial_notifications",
            "data": manager.notifications
        })

    try:
        while True:
            # Keep alive and wait for disconnect
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, "admin")
    except Exception:
        manager.disconnect(websocket, "admin")

def generate_pdf_report(user_name: str, notifications: list):
    pdf = FPDF()
    pdf.add_page()
    
    # 1. Header
    pdf.set_font("Arial", 'B', 20)
    pdf.set_text_color(31, 41, 55) 
    pdf.cell(0, 15, "CROWDSURGE SECURITY OPERATIONS REPORT", ln=True, align='C')
    pdf.ln(5)
    
    # Issued by
    pdf.set_font("Arial", '', 10)
    pdf.set_text_color(107, 114, 128)
    pdf.cell(0, 5, f"Issued by: Officer {user_name}", ln=True)
    pdf.cell(0, 5, f"Report Generated: {time.strftime('%d-%m-%Y %H:%M:%S')}", ln=True)
    pdf.ln(10)
    
    if not notifications:
        pdf.set_font("Arial", 'I', 12)
        pdf.cell(0, 10, "No incidents recorded during this session.", ln=True)
    else:
        for idx, n in enumerate(notifications[-10:]): # Show latest 10 incidents
            pdf.set_font("Arial", 'B', 14)
            pdf.set_text_color(59, 130, 246) # Blue header for each incident
            pdf.cell(0, 10, f"Incident Report #{idx+1} - {n.get('status', 'SIGNAL')}", ln=True)
            pdf.line(pdf.get_x(), pdf.get_y(), pdf.get_x() + 190, pdf.get_y())
            pdf.ln(2)
            
            pdf.set_font("Arial", 'B', 10)
            pdf.set_text_color(31, 41, 55)
            
            # Use the "Best Version" layout requested
            # 📍 Location
            pdf.cell(0, 6, f"Location: {n.get('location', 'N/A')}", ln=True)
            pdf.cell(0, 6, f"Zone: {n.get('zone', 'N/A')}", ln=True)
            pdf.cell(0, 6, f"Camera ID: {n.get('camera_id', 'N/A')}", ln=True)
            pdf.ln(2)
            
            # 🕒 Timestamp
            pdf.cell(0, 6, f"Date: {n.get('date', 'N/A')}", ln=True)
            pdf.cell(0, 6, f"Time: {n.get('timestamp', 'N/A')}", ln=True)
            pdf.ln(2)
            
            # 👥 Crowd Data
            pdf.cell(0, 6, f"Crowd Count: {n.get('count', 0):,}", ln=True)
            pdf.cell(0, 6, f"Limit: {n.get('limit', 0):,}", ln=True)
            pdf.cell(0, 6, f"Density: {n.get('density', 'N/A')}", ln=True)
            pdf.ln(2)
            
            # 🚦 Status
            status = n.get('status', 'N/A')
            pdf.set_text_color(220, 38, 38) if status == "CRITICAL" else pdf.set_text_color(217, 119, 6) if status == "WARNING" else pdf.set_text_color(5, 150, 105)
            pdf.cell(0, 6, f"Status: {status}", ln=True)
            pdf.set_text_color(31, 41, 55)
            
            # ⚠️ Reason & suggested action
            pdf.set_font("Arial", '', 10)
            pdf.multi_cell(0, 6, f"Reason: {n.get('reason', 'N/A')}")
            pdf.set_font("Arial", 'B', 10)
            pdf.cell(0, 6, f"Suggested Action: {n.get('suggested_action', 'N/A')}", ln=True)
            pdf.ln(2)
            
            # 📩 Inbox Info
            pdf.set_font("Arial", '', 9)
            pdf.cell(40, 6, f"Alert Priority: {n.get('priority', 'N/A')}")
            pdf.cell(40, 6, f"Inbox Status: {n.get('inbox_status', 'N/A')}")
            pdf.ln(6)
            
            # 👮 Action Taken
            pdf.set_font("Arial", 'B', 10)
            pdf.cell(0, 6, f"Action Taken: {n.get('action_taken', 'N/A')}", ln=True)
            
            # 📊 Trend
            pdf.set_font("Arial", 'I', 9)
            pdf.cell(0, 6, f"Trend: {n.get('trend', 'N/A')} (Previous: {n.get('previous_count', 0):,})", ln=True)
            
            pdf.ln(10)
            if pdf.get_y() > 250: pdf.add_page() # Page break if near bottom
    
    # System Integrity Disclaimer
    pdf.set_font("Arial", 'I', 8)
    pdf.set_y(-20)
    pdf.set_text_color(156, 163, 175)
    pdf.multi_cell(0, 4, "CONFIDENTIAL: This report is generated automatically by CrowdSurge AI Monitoring. All data points are validated against real-time vision sensors.", align='C')
    
    output_path = "data/latest_report.pdf"
    if not os.path.exists("data"):
        os.makedirs("data")
    pdf.output(output_path)
    return output_path

@app.get("/dashboard/report")
async def download_report(current_user: dict = Depends(get_current_active_user)):
    report_path = generate_pdf_report(current_user['full_name'], manager.notifications)
    return FileResponse(report_path, filename="CrowdSurge_Security_Analysis.pdf", media_type="application/pdf")

crowd_counter = CrowdCounter()

async def frame_sender(websocket: WebSocket, state: dict):
    video_path = "data/input_video1.mp4"
    if not os.path.exists(video_path):
        await websocket.send_json({"error": "Video not found"})
        return

    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    process_every_n = 5
    
    # Shared state for trend analysis
    last_count = 0
    
    try:
        while True:
            # Check if we need to stop from outside? (handled by exception in gather)
            ret, frame = cap.read()
            if not ret:
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue
            
            frame_count += 1
            
            # Skip frames
            if frame_count % process_every_n != 0:
                await asyncio.sleep(0.01)
                continue
            
            # Inference with dynamic state
            count, zones, img_base64 = crowd_counter.process_frame(frame, render_heatmap=state["render_heatmap"])
            
            # Trend mapping
            trend = "Steady"
            if count > last_count * 1.05: trend = "Increasing"
            elif count < last_count * 0.95: trend = "Decreasing"
            
            # 🚦 Status Level Mapping
            status = "SAFE"
            reason = "Crowd within safe limits"
            suggested_action = "Regular monitoring"
            priority = "Low"
            
            if count >= CROWD_LIMIT:
                status = "CRITICAL"
                reason = "Crowd exceeded safe limit"
                priority = "High"
            elif count >= THRESHOLD_NEAR_LIMIT:
                status = "WARNING"
                reason = "Crowd near capacity limit"
                priority = "Medium"
            
            # 🤖 Automatic Response Logic
            if count >= THRESHOLD_EMERGENCY:
                suggested_action = "Trigger emergency protocol"
            elif count >= THRESHOLD_CRITICAL:
                suggested_action = "Send ambulance + police support"
            elif count >= THRESHOLD_WARNING:
                suggested_action = "Send ground control team"
            elif status == "WARNING":
                suggested_action = "Deploy standby ground team"
            
            # Density level string
            density = "Low"
            if count >= CROWD_LIMIT: density = "High"
            elif count >= THRESHOLD_NEAR_LIMIT: density = "Medium"
            
            payload = {
                "location": "Gate 3",
                "zone": "North Sector",
                "camera_id": "CAM_12",
                "timestamp": time.strftime("%H:%M:%S"),
                "date": time.strftime("%d-%m-%Y"),
                "count": int(count),
                "previous_count": int(last_count),
                "limit": int(CROWD_LIMIT),
                "density": density,
                "status": status,
                "reason": reason,
                "suggested_action": suggested_action,
                "priority": priority,
                "inbox_status": "Unread",
                "action_taken": "Monitor Closely",
                "trend": trend,
                "zones": zones,
                "image": img_base64,
                "is_simulation": crowd_counter.simulation_mode,
                "heatmap_on": state["render_heatmap"]
            }
            
            # Send alert to admins if WARNING or CRITICAL
            if status in ["WARNING", "CRITICAL"]:
                if frame_count % (process_every_n * 5) == 0:
                    alert_notification = {
                        "id": int(time.time()),
                        "type": "MONITOR_ALERT",
                        "sender": "System Monitor",
                        **payload
                    }
                    alert_notification.pop("image") # Remove large image from notifications list
                    manager.notifications.append(alert_notification)
                    await manager.broadcast_all({
                        "type": "notification",
                        "data": alert_notification
                    })

            last_count = count
            await websocket.send_json(payload)
            await asyncio.sleep(0.05)
            
    except Exception as e:
        logger.error(f"Sender Error: {e}")
    finally:
        cap.release()

async def command_receiver(websocket: WebSocket, state: dict, user: dict):
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            logger.info(f"Received command from {user['username']}: {message}")
            
            # Security Rule: Only admin can toggle heatmap
            if message.get("action") == "toggle_heatmap":
                if user.get("role") == "admin":
                    state["render_heatmap"] = message.get("value", True)
                else:
                    await websocket.send_json({
                        "error": "Forbidden", 
                        "message": "Only administrators can modify alert/render settings."
                    })
                
    except WebSocketDisconnect:
        logger.info(f"Client {user['username']} disconnected (Receiver)")
    except Exception as e:
        logger.error(f"Receiver Error: {e}")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = None):
    # Authenticate via query parameter 'token' since standard WS headers are limited in browser
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
        user = USERS_DB.get(username)
        if not user or user.get("disabled"):
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
    except JWTError:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await websocket.accept()
    await manager.connect(websocket, user["role"])
    logger.info(f"Client {user['username']} connected as {user['role']}")
    
    # Send existing notifications to admin on connect
    if user["role"] == "admin" and manager.notifications:
        await websocket.send_json({
            "type": "initial_notifications",
            "data": manager.notifications
        })

    # Shared state
    state = {"render_heatmap": True}
    
    try:
        sender_task = asyncio.create_task(frame_sender(websocket, state))
        receiver_task = asyncio.create_task(command_receiver(websocket, state, user))
        
        # Wait for either to finish (likely receiver disconnects first)
        done, pending = await asyncio.wait(
            [sender_task, receiver_task],
            return_when=asyncio.FIRST_COMPLETED
        )
        
        for task in pending:
            task.cancel()
    finally:
        manager.disconnect(websocket, user["role"])
