# Mini Project Manager

A modern full-stack project management application built with .NET 8 Web API backend and React 19 TypeScript frontend. Features secure authentication, project organization, task management, and an intelligent Smart Scheduler with dependency resolution.

## 🌟 Key Features

- 🔐 **Secure Authentication**: JWT-based authentication with PBKDF2 password hashing
- 📋 **Project Management**: Create, view, and manage projects with progress tracking
- ✅ **Task Management**: Add, edit, and track tasks with due dates, estimated hours, and dependencies
- 🤖 **Smart Scheduler**: Intelligent task scheduling with dependency resolution using topological sorting
- 📱 **Responsive Design**: Modern UI that works across all device sizes
- ⚡ **Real-time Updates**: Dynamic progress indicators and status updates
- 💾 **Data Persistence**: SQLite database for reliable data storage

## 🛠️ Technology Stack

### Backend
- **Framework**: ASP.NET Core 8.0 ⚙️
- **ORM**: Entity Framework Core 9.0.10 🗄️
- **Database**: SQLite 💾
- **Authentication**: JWT (JSON Web Tokens) 🔐
- **Documentation**: Swagger/OpenAPI 📚

### Frontend
- **Framework**: React 19 ⚛️
- **Language**: TypeScript 📘
- **Routing**: React Router v7 🛣️
- **HTTP Client**: Axios 🌐
- **State Management**: React Context API 🔄

## 🚀 Quick Start (Local Development)

### Prerequisites
- .NET 8 SDK
- Node.js 18+ and npm
- Git

### One-Command Setup

#### Windows:
```batch
# Clone the repository
git clone https://github.com/ayushr100/Mini-Project-Manager.git
cd Mini-Project-Manager

# Start both backend and frontend
run-dev.bat
```

#### Mac/Linux:
```bash
# Clone the repository
git clone https://github.com/ayushr100/Mini-Project-Manager.git
cd Mini-Project-Manager

# Start both backend and frontend
./run-dev.sh
```

This will automatically:
- Install all dependencies
- Set up the database
- Start backend on `https://localhost:7165`
- Start frontend on `http://localhost:3000`
- Open API documentation at `https://localhost:7165/swagger`

### Manual Setup (For Debugging)
If you need to run services separately for debugging:

1. **Backend Setup:**
   ```bash
   cd backend/ProjectManagerAPI
   dotnet restore
   dotnet ef database update
   dotnet run
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 🏗️ Architecture

The application follows clean architecture principles with clear separation of concerns:

### Backend Architecture
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and data processing
- **Models**: Define data entities and relationships
- **DTOs**: Data Transfer Objects for API communication
- **Data Layer**: Entity Framework Core with SQLite

### Frontend Architecture
- **Pages**: Main application views (Login, Dashboard, Project Details)
- **Components**: Reusable UI components (including SmartScheduler)
- **Services**: API communication layer
- **Context**: Authentication and state management
- **Types**: TypeScript interfaces and type definitions

## Project Structure

```
Mini Project Manager/
├── run-dev.sh                    # 🚀 Development launcher (Mac/Linux)
├── run-dev.bat                   # 🚀 Development launcher (Windows)
├── Dockerfile                    # 🐳 Railway deployment config
├── railway.json                  # 🚂 Railway settings
├── start.sh                      # 🔄 Fallback deployment script
├── README.md                     # 📖 Project documentation
├── DEPLOYMENT_GUIDE.md           # 🚀 Deployment instructions
├── backend/
│   └── ProjectManagerAPI/
│       ├── Controllers/           # API endpoints
│       │   ├── AuthController.cs
│       │   ├── ProjectsController.cs
│       │   └── TasksController.cs
│       ├── Services/              # Business logic
│       │   ├── AuthService.cs
│       │   ├── ProjectService.cs
│       │   ├── TaskService.cs
│       │   └── SchedulerService.cs
│       ├── Models/                # Data entities
│       │   ├── User.cs
│       │   ├── Project.cs
│       │   └── ProjectTask.cs
│       ├── DTOs/                  # Data transfer objects
│       ├── Data/                  # Database context & migrations
│       └── Program.cs             # Application configuration
├── frontend/
│   ├── vercel.json               # ⚡ Vercel deployment config
│   ├── .env.production           # 🔧 Production environment variables
│   ├── src/
│   │   ├── pages/                # Main application pages
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── ProjectDetails.tsx
│   │   ├── components/            # Reusable components
│   │   │   ├── Navbar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/               # State management
│   │   │   └── AuthContext.tsx
│   │   ├── services/              # API layer
│   │   │   └── api.ts
│   │   ├── types/                 # TypeScript definitions
│   │   │   └── index.ts
│   │   └── App.tsx                # Main application component
│   └── package.json
├── run.sh                         # Quick setup script (Unix)
├── run.bat                        # Quick setup script (Windows)
└── README.md
```

## 🚀 Installation and Setup

### Prerequisites

Ensure you have the following installed:
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) 🔧
- [Node.js 16+](https://nodejs.org/) 📦
- [npm](https://www.npmjs.com/) (comes with Node.js) 📥

### ⚡ Quick Setup (Recommended)

For fastest setup, use the provided automation scripts:

**macOS/Linux:**
```bash
chmod +x run.sh
./run.sh
```

**Windows:**
```cmd
run.bat
```

The script will automatically:
1. ✅ Check for required prerequisites
2. ✅ Install all dependencies
3. ✅ Build both backend and frontend
4. ✅ Start both services
5. ✅ Open the application in your browser

### 🛠️ Manual Setup

If you prefer manual setup or the automated script fails:

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend/ProjectManagerAPI
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Build the application:
```bash
dotnet build
```

4. Run the API server:
```bash
dotnet run
```

🌐 **Backend URLs:**
- API: `http://localhost:5266`
- Swagger Documentation: `http://localhost:5266/swagger`

#### Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

🌐 **Frontend URL:** `http://localhost:3000`

## 📡 API Documentation

> **Interactive Documentation**: Visit `http://localhost:5266/swagger` for complete API testing

### 🔐 Authentication
```http
POST /api/auth/register   # User registration
POST /api/auth/login      # User login
```

### 📋 Projects
```http
GET    /api/projects           # Get all user projects
POST   /api/projects           # Create new project
GET    /api/projects/{id}      # Get project details with tasks
DELETE /api/projects/{id}      # Delete project
```

### ✅ Tasks
```http
POST   /api/projects/{projectId}/tasks   # Create task in project
PUT    /api/tasks/{taskId}              # Update task
DELETE /api/tasks/{taskId}              # Delete task
```

### 🤖 Smart Scheduler
```http
POST   /api/projects/{projectId}/schedule   # Generate optimal task schedule
```

The Smart Scheduler uses **algorithmic intelligence** to automatically organize tasks based on their dependencies and deadlines. Here's how it works:

#### 🧠 Scheduling Methodology

**Algorithm**: **Topological Sorting with Deadline Prioritization**

1. **Dependency Graph Construction**: 
   - Creates a directed acyclic graph (DAG) where tasks are nodes and dependencies are edges
   - Validates that all specified dependencies exist in the task list

2. **Topological Sorting**:
   - Uses Kahn's algorithm to find a linear ordering of tasks that respects all dependencies
   - Ensures no task is scheduled before its prerequisites are completed

3. **Deadline Prioritization**:
   - Among tasks with no remaining dependencies, prioritizes those with earlier due dates
   - Uses a priority queue to efficiently select the next task to schedule

4. **Circular Dependency Detection**:
   - Automatically detects impossible dependency chains (e.g., Task A depends on Task B, which depends on Task A)
   - Returns an error if circular dependencies are found

5. **Feasibility Validation**:
   - Considers estimated hours and working hours per day (8 hours default)
   - Calculates if tasks can realistically be completed by their due dates

**Why This Approach?**
- **Deterministic**: Always produces the same optimal schedule for the same input
- **Efficient**: O(V + E) time complexity where V = tasks, E = dependencies  
- **Reliable**: Mathematically proven to find valid ordering if one exists
- **Practical**: Considers real-world constraints like deadlines and work capacity

**📝 Note**: All project and task endpoints require JWT authentication in the `Authorization` header.

#### Smart Scheduler Request Example:
```json
{
  "tasks": [
    {
      "title": "Design API",
      "estimatedHours": 5,
      "dueDate": "2025-10-25",
      "dependencies": []
    },
    {
      "title": "Implement Backend", 
      "estimatedHours": 12,
      "dueDate": "2025-10-28",
      "dependencies": ["Design API"]
    },
    {
      "title": "Build Frontend",
      "estimatedHours": 10, 
      "dueDate": "2025-10-30",
      "dependencies": ["Design API"]
    },
    {
      "title": "End-to-End Test",
      "estimatedHours": 8,
      "dueDate": "2025-10-31", 
      "dependencies": ["Implement Backend", "Build Frontend"]
    }
  ]
}
```

#### Smart Scheduler Response Example:
```json
{
  "recommendedOrder": [
    "Design API",
    "Implement Backend", 
    "Build Frontend",
    "End-to-End Test"
  ],
  "isValid": true,
  "message": "Tasks scheduled successfully."
}
```

## 🧪 Usage Guide

### Getting Started

1. 📝 **Register**: Create a new account by providing username, email, and password
2. 🔑 **Login**: Sign in with your credentials to access the dashboard
3. 📁 **Create Projects**: Add new projects with titles and descriptions
4. ✅ **Manage Tasks**: Click on any project to add, edit, or delete tasks
5. 📊 **Track Progress**: View completion statistics and progress indicators

### Testing the Application

#### 🖱️ Manual Testing
1. Open `http://localhost:3000` in your browser
2. Register a new user account
3. Create a sample project and add tasks
4. Test all CRUD operations
5. Verify responsive design on different screen sizes

#### 🔧 API Testing
Visit `http://localhost:5266/swagger` for interactive API documentation and testing.

## 🔒 Security Features

- 🔐 **JWT Authentication**: Secure token-based authentication system
- 🛡️ **Password Security**: PBKDF2 hashing with salt for password storage
- 👤 **Authorization**: Users can only access their own data
- 🌐 **CORS Configuration**: Properly configured for frontend-backend communication
- ✅ **Input Validation**: Server-side validation using Data Annotations
- 🛡️ **SQL Injection Prevention**: Entity Framework Core parameterized queries

## ⚙️ Configuration

### Backend Configuration (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=projectmanager.db"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-here",
    "Issuer": "ProjectManagerAPI",
    "Audience": "ProjectManagerClient"
  }
}
```

### 💾 Database
The application uses SQLite for data storage. The database file (`projectmanager.db`) is automatically created in the backend directory when the application starts for the first time.

## 🚀 Development

### Building for Production

#### Backend
```bash
cd backend/ProjectManagerAPI
dotnet publish -c Release
```

#### Frontend
```bash
cd frontend
npm run build
```

### 🧪 Running Tests
```bash
# Backend tests
cd backend/ProjectManagerAPI
dotnet test

# Frontend tests
cd frontend
npm test
```

## 🚀 Production Deployment

This application is configured for deployment on Railway (backend) and Vercel (frontend).

### Quick Deployment Steps

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy Backend to Railway:**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub repository
   - Set environment variables:
     - `ASPNETCORE_ENVIRONMENT=Production`
     - `JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters`
   - Railway will auto-deploy using the Dockerfile

3. **Deploy Frontend to Vercel:**
   - Go to [Vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Set environment variable:
     - `REACT_APP_API_URL=https://your-railway-app.railway.app/api`
   - Vercel will auto-deploy the React app

### Deployment Files Included

- `Dockerfile` - Railway backend deployment
- `railway.json` - Railway configuration
- `start.sh` - Fallback deployment script
- `nixpacks.toml` - Alternative Railway config
- `frontend/vercel.json` - Vercel configuration
- `frontend/.env.production` - Production environment variables

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository 🍴
2. Create a feature branch (`git checkout -b feature/amazing-feature`) 🌿
3. Commit your changes (`git commit -m 'Add some amazing feature'`) 💾
4. Push to the branch (`git push origin feature/amazing-feature`) 🚀
5. Open a Pull Request 📬
