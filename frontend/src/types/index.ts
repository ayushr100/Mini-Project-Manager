export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
}

export interface LoginData {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  tasks: Task[];
}

export interface ProjectSummary {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  taskCount: number;
  completedTaskCount: number;
}

export interface CreateProjectData {
  title: string;
  description?: string;
}

export interface Task {
  id: number;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  createdAt: string;
  projectId: number;
}

export interface CreateTaskData {
  title: string;
  dueDate?: string;
}

export interface UpdateTaskData {
  title: string;
  dueDate?: string;
  isCompleted: boolean;
}