using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectManagerAPI.DTOs;
using ProjectManagerAPI.Services;
using System.Security.Claims;

namespace ProjectManagerAPI.Controllers
{
    [ApiController]
    [Route("api")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        [HttpPost("projects/{projectId}/tasks")]
        public async Task<IActionResult> CreateTask(int projectId, [FromBody] CreateTaskDto createTaskDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            var task = await _taskService.CreateTaskAsync(projectId, createTaskDto, userId);

            if (task == null)
                return NotFound(new { message = "Project not found" });

            return CreatedAtAction(nameof(CreateTask), new { projectId = projectId, id = task.Id }, task);
        }

        [HttpPut("tasks/{taskId}")]
        public async Task<IActionResult> UpdateTask(int taskId, [FromBody] UpdateTaskDto updateTaskDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetUserId();
            var task = await _taskService.UpdateTaskAsync(taskId, updateTaskDto, userId);

            if (task == null)
                return NotFound(new { message = "Task not found" });

            return Ok(task);
        }

        [HttpDelete("tasks/{taskId}")]
        public async Task<IActionResult> DeleteTask(int taskId)
        {
            var userId = GetUserId();
            var success = await _taskService.DeleteTaskAsync(taskId, userId);

            if (!success)
                return NotFound(new { message = "Task not found" });

            return NoContent();
        }
    }
}