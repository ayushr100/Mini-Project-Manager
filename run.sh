#!/bin/bash

# Mini Project Manager - Complete Setup and Run Script
# This script will check prerequisites, install dependencies, and run the application

set -e  # Exit on any error

echo "🚀 Mini Project Manager - Setup & Run Script"
echo "============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites
echo "🔍 Checking Prerequisites..."
echo "----------------------------"

# Check if dotnet is installed
if ! command -v dotnet &> /dev/null; then
    print_error ".NET 8 SDK not found!"
    echo "Please install .NET 8 SDK from: https://dotnet.microsoft.com/download/dotnet/8.0"
    exit 1
fi

DOTNET_VERSION=$(dotnet --version)
print_status ".NET version: $DOTNET_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm not found!"
    echo "Please install Node.js and npm from: https://nodejs.org/"
    exit 1
fi

NPM_VERSION=$(npm --version)
print_status "npm version: $NPM_VERSION"

echo ""
echo "🔧 Setting up Backend (.NET 8 Web API)..."
echo "----------------------------------------"

# Navigate to backend directory
cd backend/ProjectManagerAPI

# Restore NuGet packages
print_info "Restoring NuGet packages..."
dotnet restore

# Build the backend
print_info "Building backend..."
dotnet build --configuration Release

print_status "Backend setup complete!"

# Navigate back to root
cd ../../

echo ""
echo "🎨 Setting up Frontend (React TypeScript)..."
echo "--------------------------------------------"

# Navigate to frontend directory
cd frontend

# Install npm packages
print_info "Installing npm packages..."
npm install

# Build the frontend
print_info "Building frontend..."
npm run build

print_status "Frontend setup complete!"

# Navigate back to root
cd ../

echo ""
echo "🎉 Setup Complete! Starting Application..."
echo "=========================================="

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    print_warning "Shutting down services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        print_status "Backend stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        print_status "Frontend stopped"
    fi
    echo ""
    print_info "Application stopped. Thank you for testing!"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend
print_info "Starting backend API server..."
cd backend/ProjectManagerAPI
dotnet run > ../../../backend.log 2>&1 &
BACKEND_PID=$!
cd ../../

# Wait for backend to start
print_info "Waiting for backend to initialize..."
sleep 5

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    print_error "Backend failed to start! Check backend.log for details."
    exit 1
fi

# Start frontend
print_info "Starting frontend development server..."
cd frontend
BROWSER=none npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ../

# Wait a bit for frontend to start
sleep 3

echo ""
print_status "🎉 Application is now running!"
echo ""
echo "📍 Access Points:"
echo "  🌐 Frontend Application: http://localhost:3000"
echo "  🔧 Backend API:          http://localhost:5266"
echo "  📚 API Documentation:    http://localhost:5266/swagger"
echo ""
echo "📋 Test Instructions:"
echo "  1. Open http://localhost:3000 in your browser"
echo "  2. Register a new account"
echo "  3. Login and create projects"
echo "  4. Add and manage tasks within projects"
echo "  5. Test all CRUD operations"
echo ""
echo "💡 Tips:"
echo "  - The application will open automatically in your default browser"
echo "  - Check backend.log and frontend.log for any issues"
echo "  - Use Swagger UI (http://localhost:5266/swagger) to test API directly"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

# Try to open browser automatically
if command -v open &> /dev/null; then
    # macOS
    sleep 2
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    # Linux
    sleep 2
    xdg-open http://localhost:3000
fi

# Wait for background processes
wait