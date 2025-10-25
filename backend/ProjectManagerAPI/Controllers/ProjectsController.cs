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

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
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
    }
}