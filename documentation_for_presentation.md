# CrowdSurge: Next-Generation Real-Time Crowd Safety System

## 1. Project Overview
**CrowdSurge** is an intelligent, real-time crowd monitoring and safety system designed to prevent stampedes and overcrowding events. It uses advanced computer vision and deep learning techniques to estimate crowd density, analyze movement patterns, and provide actionable insights to safety administrators instantly.

### Key Objectives
- **Accurate Counting**: Estimate the number of people in high-density areas where traditional detection fails.
- **Real-Time Monitoring**: Process video feeds instantly to provide up-to-the-second data.
- **Proactive Safety**: Alert security personnel before critical density levels are reached.

---

## 2. Problem Statement
Managing large crowds at concerts, stadiums, and transportation hubs is critical. Traditional methods (turnstiles, manual counting) are slow and often inaccurate in open areas. High crowd density can lead to:
- Dangerous stampedes.
- Blocked emergency exits.
- Inefficient resource allocation.

**CrowdSurge** addresses this by providing a "god's eye view" of crowd dynamics, identifying hotspots and potential hazards automatically.

---

## 3. Solution & Key Features

### 🧠 Deep Learning Powered Crowd Counting
Uses **CSRNet (Congested Scene Recognition Network)**, a specialized deep neural network designed for counting people in dense crowds.
- **Why CSRNet?** Unlike standard object detectors (like YOLO) that draw boxes around people, CSRNet generates a **Density Map**. This allows it to count highly overlapped crowds where individual detection is impossible.

### 📊 Real-Time Heatmap Visualization
- Overlays a color-coded heatmap on the live video feed.
- **Blue/Green**: Low density (Safe).
- **Yellow/Red**: High density (Critical/Warning).

### 📍 Zone-Based Analysis
The system automatically monitors specific critical zones:
1.  **Main Entrance (MAIN_ENT)**: Monitoring inflow.
2.  **Food Court (FOOD_CT)**: Detecting gathering spots.
3.  **Stage Front (STAGE_FT)**: High-risk high-density area.
4.  **Exit Corridor (EXIT_COR)**: Ensuring egress paths are clear.

### 🚨 Smart Alerts System
- **SAFE**: Standard operation.
- **WARNING**: Density reaching caution levels (>50% capacity).
- **CRITICAL**: Immediate action required (>80% capacity).

---

## 4. System Architecture

The system follows a standard Client-Server architecture with a heavy AI processing unit.

### Data Flow
1.  **Input**: CCTV Video Feed / Pre-recorded Video.
2.  **Processing (Backend)**:
    - Preprocessing (Resize, Normalize).
    - **CSRNet Inference**: Generates density map.
    - **Post-processing**: Calculates total count and zonal distribution.
    - **Heatmap Generation**: Creates visual overlay.
3.  **Transmission**: Data (JSON metrics + Base64 Image) sent via **WebSockets**.
4.  **Visualization (Frontend)**: React Dashboard renders the video, charts, and alerts.

---

## 5. Technology Stack

### Backend (The Brain)
- **Language**: Python 3.9+
- **Framework**: **FastAPI** (High-performance Async API).
- **AI/ML**: 
    - **TensorFlow/Keras**: For loading and running the CSRNet model.
    - **OpenCV**: Computer vision tasks (video reading, image manipulation, heatmap application).
- **Communication**: WebSockets (for real-time full-duplex communication).

### Frontend (The Face)
- **Framework**: **React** (Vite).
- **Language**: TypeScript.
- **Styling**: **Tailwind CSS** (with custom "Neon" design system).
- **Animations**: **Framer Motion** (Smooth UI transitions).
- **Data Visualization**: **Recharts** (Live density graphs).

---

## 6. Implementation Details

### The AI Model (CSRNet)
- **Backbone**: VGG16 (First 13 layers) for feature extraction.
- **Back-end**: 6 Dilated Convolutional Layers.
    - *Dilated convolutions allow the model to expand its receptive field without losing resolution, essential for understanding context in dense crowds.*

### Dashboard UI
- **Cyberpunk/Sci-Fi Aesthetic**: High-contrast dark mode with neon accents for high visibility in control rooms.
- **Video Player**: Custom canvas rendering the incoming processed feed.
- **Zone Status Panel**: Live bars showing load % for each tracked zone.

---

## 7. Future Scope
- **Multi-Camera Support**: Extending backend to handle multiple streams.
- **Predictive Analytics**: Using historical data to predict surges before they happen.
- **IoT Integration**: Automatically triggering physical alarms or opening electronic gates when status is CRITICAL.
