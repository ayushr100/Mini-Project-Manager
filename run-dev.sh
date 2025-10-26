#!/bin/bash
# Local development script for Mini Project Manager (Mac/Linux)
# This script starts both backend and frontend in development mode

echo "🚀 Starting Mini Project Manager in Development Mode"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .NET is installed
if ! command -v dotnet &> /dev/null; then
    echo -e "${RED}❌ .NET 8 SDK is required but not installed.${NC}"
    echo "Please install .NET 8 SDK from: https://dotnet.microsoft.com/download"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is required but not installed.${NC}"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

# Function to start backend
start_backend() {
    echo -e "${BLUE}📦 Starting Backend (.NET 8 API)...${NC}"
    cd backend/ProjectManagerAPI
    
    echo -e "${YELLOW}📋 Installing NuGet packages...${NC}"
    dotnet restore
    
    echo -e "${YELLOW}🗄️ Creating/updating database...${NC}"
    dotnet ef database update
    
    echo -e "${GREEN}✅ Backend starting on https://localhost:7165${NC}"
    echo -e "${GREEN}✅ API Documentation: https://localhost:7165/swagger${NC}"
    dotnet run &
    BACKEND_PID=$!
    cd ../..
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}📦 Starting Frontend (React App)...${NC}"
    cd frontend
    
    echo -e "${YELLOW}📋 Installing npm packages...${NC}"
    npm install
    
    echo -e "${GREEN}✅ Frontend starting on http://localhost:3000${NC}"
    npm start &
    FRONTEND_PID=$!
    cd ..
}

# Trap to cleanup processes on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down development servers...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    # Kill any remaining dotnet or npm processes for this project
    pkill -f "dotnet run" 2>/dev/null
    pkill -f "react-scripts start" 2>/dev/null
    echo -e "${GREEN}✅ Development servers stopped.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start both services
start_backend
sleep 5  # Give backend time to start
start_frontend

echo -e "\n${GREEN}🎉 Both services are starting up!${NC}"
echo -e "${BLUE}📋 Development URLs:${NC}"
echo -e "   Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "   Backend:  ${GREEN}https://localhost:7165${NC}"
echo -e "   Swagger:  ${GREEN}https://localhost:7165/swagger${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Wait for processes
wait