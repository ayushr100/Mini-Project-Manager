@echo off
setlocal enabledelayedexpansion

REM Mini Project Manager - Complete Setup and Run Script for Windows
REM This script will check prerequisites, install dependencies, and run the application

title Mini Project Manager Setup

echo.
echo 🚀 Mini Project Manager - Setup ^& Run Script
echo =============================================
echo.

REM Check prerequisites
echo 🔍 Checking Prerequisites...
echo ----------------------------

REM Check if dotnet is installed
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ .NET 8 SDK not found!
    echo Please install .NET 8 SDK from: https://dotnet.microsoft.com/download/dotnet/8.0
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('dotnet --version') do set DOTNET_VERSION=%%i
echo ✅ .NET version: %DOTNET_VERSION%

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found!
    echo Please install Node.js and npm from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm version: %NPM_VERSION%

echo.
echo 🔧 Setting up Backend ^(.NET 8 Web API^)...
echo ----------------------------------------

REM Navigate to backend directory
cd backend\ProjectManagerAPI

REM Restore NuGet packages
echo ℹ️  Restoring NuGet packages...
dotnet restore
if %errorlevel% neq 0 (
    echo ❌ Failed to restore NuGet packages
    pause
    exit /b 1
)

REM Build the backend
echo ℹ️  Building backend...
dotnet build --configuration Release
if %errorlevel% neq 0 (
    echo ❌ Failed to build backend
    pause
    exit /b 1
)

echo ✅ Backend setup complete!

REM Navigate back to root
cd ..\..

echo.
echo 🎨 Setting up Frontend ^(React TypeScript^)...
echo --------------------------------------------

REM Navigate to frontend directory
cd frontend

REM Install npm packages
echo ℹ️  Installing npm packages...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install npm packages
    pause
    exit /b 1
)

REM Build the frontend
echo ℹ️  Building frontend...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Failed to build frontend
    pause
    exit /b 1
)

echo ✅ Frontend setup complete!

REM Navigate back to root
cd ..

echo.
echo 🎉 Setup Complete! Starting Application...
echo ==========================================

REM Start backend
echo ℹ️  Starting backend API server...
cd backend\ProjectManagerAPI
start /b "" dotnet run > ..\..\ backend.log 2>&1
cd ..\..

REM Wait for backend to start
echo ℹ️  Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

REM Start frontend
echo ℹ️  Starting frontend development server...
cd frontend
set BROWSER=none
start /b "" npm start > ..\frontend.log 2>&1
cd ..

REM Wait a bit for frontend to start
timeout /t 3 /nobreak >nul

echo.
echo ✅ 🎉 Application is now running!
echo.
echo 📍 Access Points:
echo   🌐 Frontend Application: http://localhost:3000
echo   🔧 Backend API:          http://localhost:5266
echo   📚 API Documentation:    http://localhost:5266/swagger
echo.
echo 📋 Test Instructions:
echo   1. Open http://localhost:3000 in your browser
echo   2. Register a new account
echo   3. Login and create projects
echo   4. Add and manage tasks within projects
echo   5. Test all CRUD operations
echo.
echo 💡 Tips:
echo   - Check backend.log and frontend.log for any issues
echo   - Use Swagger UI ^(http://localhost:5266/swagger^) to test API directly
echo.

REM Try to open browser automatically
start http://localhost:3000

echo Press any key to stop the application...
pause >nul

REM Cleanup
echo.
echo ⚠️  Shutting down services...
taskkill /f /im dotnet.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
echo ✅ Application stopped. Thank you for testing!
echo.
pause