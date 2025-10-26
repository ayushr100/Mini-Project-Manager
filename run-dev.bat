@echo off
REM Local development script for Mini Project Manager (Windows)
REM This script starts both backend and frontend in development mode

echo 🚀 Starting Mini Project Manager in Development Mode
echo ==================================================

REM Check if .NET is installed
dotnet --version >nul 2>&1
if errorlevel 1 (
    echo ❌ .NET 8 SDK is required but not installed.
    echo Please install .NET 8 SDK from: https://dotnet.microsoft.com/download
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is required but not installed.
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo 📦 Starting Backend (.NET 8 API)...
cd backend\ProjectManagerAPI

echo 📋 Installing NuGet packages...
dotnet restore

echo 🗄️ Creating/updating database...
dotnet ef database update

echo ✅ Starting backend in new window...
start "Backend Server" cmd /k "echo Backend running on https://localhost:7165 && echo API Documentation: https://localhost:7165/swagger && dotnet run"

cd ..\..

echo 📦 Starting Frontend (React App)...
cd frontend

echo 📋 Installing npm packages...
npm install

echo ✅ Starting frontend in new window...
start "Frontend Server" cmd /k "echo Frontend running on http://localhost:3000 && npm start"

cd ..

echo.
echo 🎉 Both services are starting up in separate windows!
echo 📋 Development URLs:
echo    Frontend: http://localhost:3000
echo    Backend:  https://localhost:7165
echo    Swagger:  https://localhost:7165/swagger
echo.
echo 💡 Close the server windows or press Ctrl+C in them to stop the servers
echo.
echo Press any key to exit this launcher...
pause >nul