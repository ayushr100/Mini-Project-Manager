using ProjectManagerAPI.DTOs;

namespace ProjectManagerAPI.Services
{
    public interface ITaskService
    {
        Task<TaskDto?> CreateTaskAsync(int projectId, CreateTaskDto createTaskDto, int userId);
        Task<TaskDto?> UpdateTaskAsync(int taskId, UpdateTaskDto updateTaskDto, int userId);
        Task<bool> DeleteTaskAsync(int taskId, int userId);
    }
}