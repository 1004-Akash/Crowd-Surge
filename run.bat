@echo off
title CrowdSurge - Startup Script
echo ============================================
echo         CrowdSurge Startup Script
echo ============================================
echo.

:: Start Backend in a new terminal
echo [1/2] Starting Backend Server (FastAPI)...
start "CrowdSurge Backend" cmd /k "cd /d %~dp0backend && pip install -r requirements.txt && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

:: Wait a moment for backend to initialize
timeout /t 3 /nobreak >nul

:: Start Frontend in a new terminal
echo [2/2] Starting Frontend Server (Vite)...
start "CrowdSurge Frontend" cmd /k "cd /d %~dp0frontend && npm install && npm run dev"

echo.
echo ============================================
echo   Both servers are starting...
echo   - Backend:  http://localhost:8000
echo   - Frontend: http://localhost:5173
echo ============================================
echo.
echo Press any key to exit this window...
pause >nul
