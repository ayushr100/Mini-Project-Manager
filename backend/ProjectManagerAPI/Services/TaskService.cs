using Microsoft.EntityFrameworkCore;
using ProjectManagerAPI.Data;
using ProjectManagerAPI.DTOs;
using ProjectManagerAPI.Models;

namespace ProjectManagerAPI.Services
{
    public class TaskService : ITaskService
    {
        private readonly ApplicationDbContext _context;

        public TaskService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TaskDto?> CreateTaskAsync(int projectId, CreateTaskDto createTaskDto, int userId)
        {
            // Check if project exists and belongs to the user
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
                return null;

            var task = new ProjectTask
            {
                Title = createTaskDto.Title,
                DueDate = createTaskDto.DueDate,
                ProjectId = projectId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                CreatedAt = task.CreatedAt,
                ProjectId = task.ProjectId
            };
        }

        public async Task<TaskDto?> UpdateTaskAsync(int taskId, UpdateTaskDto updateTaskDto, int userId)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

            if (task == null)
                return null;

            task.Title = updateTaskDto.Title;
            task.DueDate = updateTaskDto.DueDate;
            task.IsCompleted = updateTaskDto.IsCompleted;

            await _context.SaveChangesAsync();

            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                CreatedAt = task.CreatedAt,
                ProjectId = task.ProjectId
            };
        }

        public async Task<bool> DeleteTaskAsync(int taskId, int userId)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

            if (task == null)
                return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}