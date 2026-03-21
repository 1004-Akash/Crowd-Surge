from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import cv2
import asyncio
import json
import logging
import time
from inference import CrowdCounter
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("CrowdSafeAPI")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

crowd_counter = CrowdCounter()

async def frame_sender(websocket: WebSocket, state: dict):
    video_path = "data/input_video.mp4"
    if not os.path.exists(video_path):
        await websocket.send_json({"error": "Video not found"})
        return

    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    process_every_n = 5
    
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
            
            payload = {
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
                "count": int(count),
                "status": "SAFE" if count < 100 else "WARNING", 
                "zones": zones,
                "image": img_base64,
                "is_simulation": crowd_counter.simulation_mode,
                "heatmap_on": state["render_heatmap"]
            }
            
            await websocket.send_json(payload)
            await asyncio.sleep(0.05)
            
    except Exception as e:
        logger.error(f"Sender Error: {e}")
    finally:
        cap.release()

async def command_receiver(websocket: WebSocket, state: dict):
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            logger.info(f"Received command: {message}")
            
            if message.get("action") == "toggle_heatmap":
                state["render_heatmap"] = message.get("value", True)
                
    except WebSocketDisconnect:
        logger.info("Client disconnected (Receiver)")
    except Exception as e:
        logger.error(f"Receiver Error: {e}")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("Client connected")
    
    # Shared state
    state = {"render_heatmap": True}
    
    # Run both tasks concurrently
    # If one fails (e.g. disconnect), the other should probably stop.
    # asyncio.gather will run them. If receiver hits Disconnect, it returns.
    # We want to ensure everything cleans up.
    
    sender_task = asyncio.create_task(frame_sender(websocket, state))
    receiver_task = asyncio.create_task(command_receiver(websocket, state))
    
    # Wait for either to finish (likely receiver disconnects first)
    done, pending = await asyncio.wait(
        [sender_task, receiver_task],
        return_when=asyncio.FIRST_COMPLETED
    )
    
    for task in pending:
        task.cancel()
