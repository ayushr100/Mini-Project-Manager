using ProjectManagerAPI.DTOs;

namespace ProjectManagerAPI.Services
{
    public interface IProjectService
    {
        Task<IEnumerable<ProjectSummaryDto>> GetUserProjectsAsync(int userId);
        Task<ProjectDto?> GetProjectByIdAsync(int projectId, int userId);
        Task<ProjectDto?> CreateProjectAsync(CreateProjectDto createProjectDto, int userId);
        Task<bool> DeleteProjectAsync(int projectId, int userId);
    }
}