
using Backend.Dtos.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Backend.Models;
using Backend.Services.Tasks;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpPost] // POST /api/tasks
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> AddTask([FromBody] CreateTaskRequest request, CancellationToken cancellationToken)
    {
        var task = await _taskService.CreateTaskAsync(request, cancellationToken);

        if (task is null)
        {
            return Problem(detail: "Something went wrong."); // 500 Creation failed for some reason
        }

        return CreatedAtRoute("GetTask", new { id = task.Id }, task);
    }

    [HttpGet] // GET /api/tasks or /api/tasks?status=InProgress
    public async Task<IActionResult> GetTasks([FromQuery] Models.TaskStatus? status, CancellationToken cancellationToken)
    {
        var tasks = await _taskService.GetTasksAsync(status);

        if (tasks is null)
        {
            return Problem(detail: "Something went wrong."); // 500 Fetching tasks list failed for some reason
        }

        return Ok(tasks);
    }

    [HttpGet("{id}", Name = "GetTask")] // GET /api/tasks/{id}
    public async Task<IActionResult> GetTask(string id, CancellationToken cancellationToken)
    {
        var task = await _taskService.GetTaskAsync(id, cancellationToken);

        if (task is null)
        {
            return NotFound(); // 404 Not Found
        }

        return Ok(task);
    }

    [HttpPut("{id}")] // PUT /api/tasks/{id}
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> UpdateTask(string id, [FromBody] UpdateTaskRequest request, CancellationToken cancellationToken)
    {
        var updated = await _taskService.UpdateTaskAsync(id, request, cancellationToken);

        if (!updated)
        {
            return Problem(detail: "Something went wrong."); // 500 Editing task failed for some reason
        }

        return NoContent(); // 204 No Content
    }


    [HttpDelete("{id}")] // DELETE /api/tasks/{id}
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> DeleteTask(string id, CancellationToken cancellationToken)
    {
        var deleted = await _taskService.DeleteTaskAsync(id, cancellationToken);

        if (!deleted)
        {
            return Problem(detail: "Something went wrong."); // 500 Deleting task failed for some reason
        }

        return NoContent(); // 204 No Content
    }

}
