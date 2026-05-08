@echo off
echo ========================================================
echo Starting Neural Research Sentinel Locally (Without Docker)
echo ========================================================
echo.

echo [1/2] Starting Backend Server...
start "Neural Research Sentinel - Backend" cmd /k "cd backend && pip install -r requirements.txt && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo [2/2] Starting Frontend Server...
start "Neural Research Sentinel - Frontend" cmd /k "cd frontend && \"C:\Program Files\nodejs\npm.cmd\" install && \"C:\Program Files\nodejs\npm.cmd\" run dev"

echo Both servers are starting in separate command prompt windows.
echo.
echo [!] IMPORTANT: Do NOT close the Backend or Frontend windows.
echo     Closing them will stop the application and cause connection errors.
echo.
echo --------------------------------------------------------
echo Localhost URLs:
echo Frontend (UI):   http://localhost:3000
echo Backend (API):   http://localhost:8000
echo API Docs:        http://localhost:8000/docs
echo --------------------------------------------------------
echo.
echo Press any key to close this launcher (the servers will keep running in their own windows).
pause > nul
