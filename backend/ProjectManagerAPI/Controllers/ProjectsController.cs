using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectManagerAPI.DTOs;
using ProjectManagerAPI.Services;
using System.Security.Claims;

namespace ProjectManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly ISchedulerService _schedulerService;

        public ProjectsController(IProjectService projectService, ISchedulerService schedulerService)
        {
            _projectService = projectService;
            _schedulerService = schedulerService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var userId = GetUserId();
            var projects = await _projectService.GetUserProjectsAsync(userId);
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(int id)
        {
            var userId = GetUserId();
            var project = await _projectService.GetProjectByIdAsync(id, userId);
            
            if (project == null)
                return NotFound(new { message = "Project not found" });

            return Ok(project);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] CreateProjectDto createProjectDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            var project = await _projectService.CreateProjectAsync(createProjectDto, userId);

            return CreatedAtAction(nameof(GetProject), new { id = project!.Id }, project);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var userId = GetUserId();
            var success = await _projectService.DeleteProjectAsync(id, userId);

            if (!success)
                return NotFound(new { message = "Project not found" });

            return NoContent();
        }

        [HttpPost("{projectId}/schedule")]
        public async Task<IActionResult> ScheduleTasks(int projectId, [FromBody] ScheduleRequestDto scheduleRequest)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            
            // Verify user owns the project
            var project = await _projectService.GetProjectByIdAsync(projectId, userId);
            if (project == null)
                return NotFound(new { message = "Project not found" });

            // Process the scheduling request
            var result = _schedulerService.ScheduleTasks(scheduleRequest);

            if (!result.IsValid)
                return BadRequest(new { message = result.Message });

            return Ok(result);
        }
    }
}