# 🚨 CrowdSurge — Real-Time Crowd Safety System

CrowdSurge is an intelligent, real-time crowd monitoring platform that uses deep learning to estimate crowd density from video feeds, flag dangerous zones, and alert safety personnel before a stampede or overcrowding incident can occur.

It pairs a **CSRNet**-based computer vision backend with a live, WebSocket-driven **React/TypeScript** dashboard, giving control-room staff a "god's-eye view" of crowd dynamics across multiple monitored zones.

---

## What is CrowdSurge

Traditional crowd management tools — turnstiles, manual headcounts, fixed CCTV — break down in high-density environments like concerts, stadiums, and transit hubs. They're slow, inaccurate, and reactive rather than preventive. Dangerously overcrowded areas can lead to blocked emergency exits and, in the worst case, stampedes.

CrowdSurge replaces guesswork with a live, quantitative view of crowd density per zone, so operators can intervene *before* a situation turns critical rather than after.

## Key Features

- 🧠 **Deep Learning Crowd Counting** — Powered by **CSRNet** (Congested Scene Recognition Network), which generates a density map instead of bounding boxes, allowing it to count people in heavily overlapped crowds where standard object detectors fail.
- 📊 **Real-Time Heatmap Visualization** — Live color-coded density overlay on the video feed (blue/green = safe, yellow/red = warning/critical).
- 📍 **Zone-Based Monitoring** — Tracks multiple critical areas independently, e.g.:
  - `MAIN_ENT` – Main Entrance (inflow monitoring)
  - `FOOD_CT` – Food Court (gathering-spot detection)
  - `STAGE_FT` – Stage Front (high-risk, high-density area)
  - `EXIT_COR` – Exit Corridor (keeping egress paths clear)
- 🚨 **Smart Alerting** — Three-tier status system:
  - `SAFE` — normal operation
  - `WARNING` — density above ~50% capacity
  - `CRITICAL` — density above ~80% capacity, immediate action required
- 🔐 **Authenticated Dashboard** — JWT-based login protecting the live monitoring interface and controls.
- 📄 **Incident Reporting** — On-demand PDF report generation summarizing notifications/incidents.
- 🔔 **Live Notifications** — Dedicated WebSocket channel pushes real-time alerts to admins.
- 🎨 **Control-Room UI** — Dark, high-contrast "neon/cyberpunk" dashboard designed for visibility, with live charts and animated transitions.

## System Architecture

CrowdSurge follows a client-server architecture with the AI inference running on the backend and results streamed to the frontend in real time.

```
 ┌────────────────────┐      ┌───────────────────────────────────────┐      ┌──────────────────────────┐
 │  Video Source       │ ---> │  Backend (FastAPI)                      │ ---> │  Frontend (React + Vite)   │
 │  CCTV / recorded mp4│      │  - Preprocess frame (resize/normalize)  │      │  - Live video canvas       │
 └────────────────────┘      │  - CSRNet inference -> density map      │      │  - Heatmap overlay         │
                              │  - Zonal count + status classification  │      │  - Zone status panel       │
                              │  - Heatmap generation                   │      │  - Live density charts     │
                              │  - JWT auth                             │      │  - Notifications & alerts  │
                              │  - Broadcast via WebSocket (JSON        │ <--- │  - Escalate / report        │
                              │    metrics + base64 frame)              │      │    controls                │
                              └───────────────────────────────────────┘      └──────────────────────────┘
```

**Data flow:**
1. **Input** — a live CCTV stream or a pre-recorded video file.
2. **Backend processing** — frame preprocessing → CSRNet inference to produce a density map → post-processing into total/zonal counts → heatmap rendering.
3. **Transmission** — results (JSON metrics + base64-encoded frame) pushed over WebSockets.
4. **Visualization** — the React dashboard renders the annotated video, live charts, and zone/alert state.

## Tech Stack

### Backend
| Component | Technology |
|---|---|
| Language | Python 3.9+ |
| API Framework | FastAPI |
| Real-time transport | WebSockets |
| AI / ML | TensorFlow / Keras (CSRNet), OpenCV |
| Auth | `python-jose` (JWT), `passlib[bcrypt]` |
| Reporting | `fpdf2` |

### Frontend
| Component | Technology |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS (custom neon theme) |
| Animation | Framer Motion |
| Charts | Recharts |
| Routing | React Router |

## Repository Structure

```
Crowd-Surge/
├── backend/
│   ├── main.py            # FastAPI app: auth, REST + WebSocket endpoints, PDF reports
│   ├── auth.py             # JWT authentication logic
│   ├── model.py            # CSRNet model definition
│   ├── inference.py        # Frame preprocessing + density map inference
│   ├── train.py             # Model training script
│   ├── visualize_history.py # Training-history visualization helper
│   ├── weights.h5           # Pretrained CSRNet weights
│   ├── data/                 # Sample input videos
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/            # Dashboard, Analytics, Login, Settings
│   │   ├── components/       # Header, Sidebar, ProtectedRoute, dashboard widgets
│   │   ├── context/           # AuthContext
│   │   ├── hooks/              # useCrowdData, useNotifications
│   │   └── layouts/             # MainLayout
│   ├── package.json
│   └── vite.config.ts
├── documentation_for_presentation.md  # Detailed project write-up / presentation notes
├── run.bat                             # One-click Windows startup script
└── .gitignore
```

## Getting Started

### Prerequisites

- **Python** 3.9+ and `pip`
- **Node.js** (recent LTS) and `npm`
- A webcam feed or one of the sample videos in `backend/data/` for testing

### Quick Start (Windows)

The repo ships with a helper script that boots both servers for you:

```bat
run.bat
```

This will:
1. Install backend dependencies and start FastAPI (`uvicorn`) on **http://localhost:8000**
2. Install frontend dependencies and start the Vite dev server on **http://localhost:5173**

### Manual Setup

**1. Backend**

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**2. Frontend** (in a separate terminal)

```bash
cd frontend
npm install
npm run dev
```

Then open the frontend at `http://localhost:5173` and log in to access the dashboard.

> **Note:** `weights.h5` contains the pretrained CSRNet weights required for inference. If you want to retrain the model on your own dataset, use `backend/train.py`; you can inspect training curves with `backend/visualize_history.py`.

## Usage

1. Start the backend and frontend as described above.
2. Log in through the dashboard's login page (JWT-based authentication).
3. The dashboard will connect to the backend over WebSockets and begin streaming the processed video feed, live density heatmap, per-zone status, and density charts.
4. When a zone crosses the `WARNING` or `CRITICAL` threshold, an alert is broadcast to connected admins via the notifications channel.
5. Use the **Escalate** action to flag an incident, and the **Report** action to download a PDF summary of notifications.

## API & WebSocket Overview

| Endpoint | Type | Purpose |
|---|---|---|
| `POST /auth/login` | REST | Authenticate and receive a JWT access token |
| `GET /auth/me` | REST | Fetch the current authenticated user |
| `POST /dashboard/escalate` | REST | Escalate/flag an active incident |
| `GET /dashboard/notifications` | REST | List past notifications |
| `GET /dashboard/report` | REST | Generate and download a PDF incident report |
| `WS /ws` | WebSocket | Main channel: streams processed video frames + density/zone metrics, accepts operator commands |
| `WS /ws/notifications` | WebSocket | Real-time push channel for admin alerts |

All protected REST routes and both WebSocket endpoints require a valid JWT (passed as a token on the WebSocket connection).

## Model Details (CSRNet)

- **Backbone**: VGG16 (first 13 layers) for feature extraction.
- **Back-end**: 6 dilated convolutional layers, which expand the receptive field without losing spatial resolution — key for understanding context in dense, congested scenes.
- **Output**: a density map, from which the total headcount and per-zone counts are derived by integration over the relevant regions, rather than drawing individual bounding boxes as detector-based approaches (e.g., YOLO) would.

## Roadmap

- **Multi-camera support** — extend the backend to ingest and process multiple simultaneous streams.
- **Predictive analytics** — use historical density data to forecast surges before they happen.
- **IoT integration** — automatically trigger physical alarms or unlock emergency gates when a zone reaches `CRITICAL` status.

## Contributing

Issues and pull requests are welcome. If you're proposing a significant change (e.g., swapping the model architecture or the real-time transport layer), please open an issue first to discuss the approach.

---

For a deeper write-up of the motivation, design decisions, and implementation details, see [`documentation_for_presentation.md`](./documentation_for_presentation.md).
