# 🚀 Mini Project Manager

> A modern full-stack project management application with intelligent task scheduling

Built with .NET 8 Web API backend and React 19 TypeScript frontend, featuring secure authentication, project organization, task management, and an AI-powered Smart Scheduler with dependency resolution.

## 🌐 Live Demo

**Try the deployed application:**
- **🌟 Application**: [https://mini-project-manager-green.vercel.app/](https://mini-project-manager-green.vercel.app/)
- **📡 API Documentation**: [https://mini-project-manager-production.up.railway.app/swagger](https://mini-project-manager-production.up.railway.app/swagger)

**Quick Test Guide:**
1. Register a new account
2. Create a project and add tasks with dependencies
3. Use the Smart Scheduler to automatically organize tasks
4. Track progress with real-time updates

## ⭐ Key Features

| Feature | Description |
|---------|-------------|
| 🔐 **Secure Authentication** | JWT-based auth with PBKDF2 password hashing |
| 📋 **Project Management** | Create, organize, and track multiple projects |
| ✅ **Smart Task Management** | Tasks with due dates, estimated hours, and dependencies |
| 🤖 **AI Scheduler** | Intelligent scheduling using topological sorting algorithm |
| 📱 **Responsive Design** | Works seamlessly across all device sizes |
| ⚡ **Real-time Updates** | Dynamic progress tracking and status indicators |
| 💾 **Reliable Storage** | SQLite database with automatic migrations |

## 🛠️ Technology Stack

### Backend (.NET 8)
- **Framework**: ASP.NET Core 8.0
- **ORM**: Entity Framework Core 9.0.10
- **Database**: SQLite
- **Authentication**: JWT with PBKDF2
- **Documentation**: Swagger/OpenAPI

### Frontend (React 19)
- **Framework**: React 19 with TypeScript
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Build Tool**: Create React App

## 🚀 Quick Start

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) with npm
- Git

### One-Command Launch

**Windows:**
```batch
git clone https://github.com/ayushr100/Mini-Project-Manager.git
cd Mini-Project-Manager
run-dev.bat
```

**Mac/Linux:**
```bash
git clone https://github.com/ayushr100/Mini-Project-Manager.git
cd Mini-Project-Manager
chmod +x run-dev.sh && ./run-dev.sh
```

This automatically:
- ✅ Installs all dependencies
- ✅ Sets up the database
- ✅ Starts backend at `https://localhost:7165`
- ✅ Starts frontend at `http://localhost:3000`
- ✅ Opens Swagger docs at `https://localhost:7165/swagger`

### Manual Setup
If you prefer step-by-step setup:

<details>
<summary>Click to expand manual setup instructions</summary>

**Backend:**
```bash
cd backend/ProjectManagerAPI
dotnet restore
dotnet ef database update
dotnet run
```

**Frontend (new terminal):**
```bash
cd frontend
npm install
npm start
```
</details>

## 🏗️ Project Architecture

```
Mini-Project-Manager/
├── 📁 backend/ProjectManagerAPI/     # .NET 8 Web API
│   ├── Controllers/                 # API endpoints
│   ├── Services/                   # Business logic
│   ├── Models/                     # Data entities
│   ├── DTOs/                       # Data transfer objects
│   └── Data/                       # Database context
├── 📁 frontend/                     # React 19 TypeScript
│   ├── src/pages/                  # Application pages
│   ├── src/components/             # Reusable components
│   ├── src/services/               # API communication
│   └── src/context/                # State management
├── 🐳 Dockerfile                    # Railway deployment
├── ⚡ frontend/vercel.json          # Vercel configuration
└── 🚀 run-dev.{sh,bat}             # Development launchers
```

## 🤖 Smart Scheduler Algorithm

The Smart Scheduler uses **Topological Sorting with Deadline Prioritization**:

1. **Dependency Analysis**: Creates a directed graph of task dependencies
2. **Topological Sort**: Uses Kahn's algorithm for dependency-respecting order
3. **Deadline Priority**: Prioritizes tasks with earlier due dates
4. **Circular Detection**: Automatically detects and reports impossible dependency chains

**API Endpoint:**
```http
POST /api/projects/{projectId}/schedule
```

## 📡 API Reference

### Authentication
```http
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
```

### Projects
```http
GET    /api/projects           # List user projects
POST   /api/projects           # Create project
GET    /api/projects/{id}      # Get project with tasks
DELETE /api/projects/{id}      # Delete project
```

### Tasks
```http
POST   /api/projects/{projectId}/tasks   # Create task
PUT    /api/tasks/{taskId}              # Update task
DELETE /api/tasks/{taskId}              # Delete task
POST   /api/projects/{projectId}/schedule # Auto-schedule tasks
```

> 📖 **Full API Documentation**: Available at `/swagger` endpoint

## 🌐 Production Deployment

### Current Deployment Status
✅ **Live and Production-Ready**

| Service | Platform | URL |
|---------|----------|-----|
| **Frontend** | Vercel | [mini-project-manager-green.vercel.app](https://mini-project-manager-green.vercel.app/) |
| **Backend API** | Railway | [mini-project-manager-production.up.railway.app](https://mini-project-manager-production.up.railway.app/) |
| **API Docs** | Railway | [/swagger](https://mini-project-manager-production.up.railway.app/swagger) |

### Deployment Architecture

| Component | Platform | Technology | Auto-Deploy |
|-----------|----------|------------|-------------|
| **Frontend** | [Vercel](https://vercel.com) | Static Site Generation | ✅ On push to `main` |
| **Backend** | [Railway](https://railway.app) | Docker Container | ✅ On push to `main` |
| **Database** | Railway (with backend) | SQLite File | ✅ Persistent volume |

### Deployment Configuration

**Backend (Railway):**
- **Runtime**: Docker container using `Dockerfile`
- **Environment**: `ASPNETCORE_ENVIRONMENT=Production`
- **Security**: JWT secrets via environment variables
- **Database**: SQLite with persistent storage
- **Health Check**: `/health` endpoint with 300s timeout

**Frontend (Vercel):**
- **Framework**: Create React App
- **Root Directory**: `frontend/`
- **Build Command**: `npm run build`
- **Environment**: `REACT_APP_API_URL` pointing to Railway backend
- **Routing**: SPA routing via `vercel.json` configuration

```bash
# Backend tests
cd backend/ProjectManagerAPI && dotnet test

# Frontend tests  
cd frontend && npm test

# Build verification
dotnet publish -c Release
npm run build
```
---