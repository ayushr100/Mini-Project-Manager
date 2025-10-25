# Project Manager

A modern full-stack project management application built with .NET 8 Web API backend and React TypeScript frontend. Features secure authentication, project organization, and task management capabilities.

## Overview

This application provides a comprehensive project management solution with user authentication, project creation and organization, and detailed task management. Built using industry-standard technologies and following clean architecture principles.

### Key Features

- 🔐 **Secure Authentication**: JWT-based authentication with PBKDF2 password hashing
- 📋 **Project Management**: Create, view, and manage projects with progress tracking
- ✅ **Task Management**: Add, edit, and track tasks with due dates and completion status
- 📱 **Responsive Design**: Modern UI that works across all device sizes
- ⚡ **Real-time Updates**: Dynamic progress indicators and status updates
- 💾 **Data Persistence**: SQLite database for reliable data storage

## 🛠️ Technology Stack

### Backend
- **Framework**: ASP.NET Core 8.0 ⚙️
- **ORM**: Entity Framework Core 🗄️
- **Database**: SQLite 💾
- **Authentication**: JWT (JSON Web Tokens) 🔐
- **Documentation**: Swagger/OpenAPI 📚

### Frontend
- **Framework**: React 19 ⚛️
- **Language**: TypeScript 📘
- **Routing**: React Router v7 🛣️
- **HTTP Client**: Axios 🌐
- **State Management**: React Context API 🔄

## Architecture

The application follows clean architecture principles with clear separation of concerns:

### Backend Architecture
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and data processing
- **Models**: Define data entities and relationships
- **DTOs**: Data Transfer Objects for API communication
- **Data Layer**: Entity Framework Core with SQLite

### Frontend Architecture
- **Pages**: Main application views (Login, Dashboard, Project Details)
- **Components**: Reusable UI components
- **Services**: API communication layer
- **Context**: Authentication and state management
- **Types**: TypeScript interfaces and type definitions

## Project Structure

```
Mini Project Manager/
├── backend/
│   └── ProjectManagerAPI/
│       ├── Controllers/           # API endpoints
│       │   ├── AuthController.cs
│       │   ├── ProjectsController.cs
│       │   └── TasksController.cs
│       ├── Services/              # Business logic
│       │   ├── AuthService.cs
│       │   ├── ProjectService.cs
│       │   └── TaskService.cs
│       ├── Models/                # Data entities
│       │   ├── User.cs
│       │   ├── Project.cs
│       │   └── ProjectTask.cs
│       ├── DTOs/                  # Data transfer objects
│       │   ├── AuthDto.cs
│       │   ├── ProjectDto.cs
│       │   └── TaskDto.cs
│       ├── Data/                  # Database context
│       │   └── ApplicationDbContext.cs
│       └── Program.cs             # Application configuration
├── frontend/
│   ├── src/
│   │   ├── pages/                 # Main application pages
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

**📝 Note**: All project and task endpoints require JWT authentication in the `Authorization` header.

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

## 🤝 Contributing

1. Fork the repository 🍴
2. Create a feature branch (`git checkout -b feature/amazing-feature`) 🌿
3. Commit your changes (`git commit -m 'Add some amazing feature'`) 💾
4. Push to the branch (`git push origin feature/amazing-feature`) 🚀
5. Open a Pull Request 📬
