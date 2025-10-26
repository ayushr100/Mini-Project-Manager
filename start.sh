#!/bin/bash
# Railway start script for .NET backend

echo "Starting .NET Project Manager API..."
cd backend/ProjectManagerAPI

# Restore dependencies
echo "Restoring NuGet packages..."
dotnet restore

# Run database migrations
echo "Running database migrations..."
dotnet ef database update

# Start the application
echo "Starting application on port $PORT..."
dotnet run --urls="http://0.0.0.0:$PORT"