
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
        var response = TaskResponse.FromTask(task);

        return CreatedAtRoute("GetTask", new { id = response.Id }, task);
    }

    [HttpGet] // GET /api/tasks or /api/tasks?status=InProgress
    public async Task<IActionResult> GetTasks([FromQuery] Models.TaskStatus? status, CancellationToken cancellationToken)
    {
        var tasks = await _taskService.GetTasksAsync(status, cancellationToken);
        var response = tasks.Select(TaskResponse.FromTask);

        return Ok(response);
    }

    [HttpGet("{id}", Name = "GetTask")] // GET /api/tasks/{id}
    public async Task<IActionResult> GetTask(string id, CancellationToken cancellationToken)
    {
        var task = await _taskService.GetTaskAsync(id, cancellationToken);

        if (task is null)
        {
            return NotFound(); // 404 Not Found
        }

        return Ok(TaskResponse.FromTask(task));
    }

    [HttpPut("{id}")] // PUT /api/tasks/{id}
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> UpdateTask(string id, [FromBody] UpdateTaskRequest request, CancellationToken cancellationToken)
    {
        var updated = await _taskService.UpdateTaskAsync(id, request, cancellationToken);

        if (!updated)
        {
            return NotFound(); // 404
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
            return NotFound(); // 404
        }

        return NoContent(); // 204 No Content
    }

}
