@echo off
echo Starting AI Sales Assistant...

:: Start the backend in a new command window
echo Starting Backend...
start cmd /k "cd backend && python run.py"

:: Wait a moment to let the backend initialize before starting the frontend
timeout /t 3 /nobreak > nul

:: Start the frontend in a new command window
echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting in separate windows.
