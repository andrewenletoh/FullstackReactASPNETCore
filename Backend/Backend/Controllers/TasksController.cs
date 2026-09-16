using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

using Backend.Models;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TasksController : ControllerBase
{
    private readonly MongoDBContext _context;

    public TasksController(MongoDBContext context)
    {
        _context = context;
    }

    [HttpPost] // POST /api/tasks
    [Authorize]
    public async Task<IActionResult> AddTask(Models.Task task)
    {
        try
        {
            await _context.Tasks.InsertOneAsync(task);
            return CreatedAtRoute("GetTask", new { id = task.Id }, task); // 201 Created
            // status code + location of the resource (http://localhost:3000/api/tasks/{id})
            // + task object in the body
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // 500 internal
            // server error + message in the response body
        }
    }

    [HttpGet] // GET /api/tasks or /api/tasks?status=InProgress
    public async Task<IActionResult> GetTasks([FromQuery] Models.TaskStatus? status)
    {
        try
        {
            var filter = status.HasValue
                ? Builders<Models.Task>.Filter.Eq(t => t.Status, status.Value)
                : Builders<Models.Task>.Filter.Empty;

            var tasks = await _context.Tasks.Find(filter).ToListAsync();
            return Ok(tasks); // 200 Ok status code + task objects in the body
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // 500 internal
            // server error + message in the response body
        }
    }

    [HttpGet("{id}", Name = "GetTask")] // GET /api/tasks/{id}
    public async Task<IActionResult> GetTask(string id)
    {
        try
        {
            var task = await _context.Tasks.Find(t => t.Id == id).FirstOrDefaultAsync();
            if (task == null)
            {
                return NotFound(); // 404 Not Found status code
            }
            return Ok(task); // 200 Ok status code + task object in the body
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // 500 internal
            // server error + message in the response body
        }
    }

    [HttpPut("{id}")] // PUT /api/tasks/{id}
    [Authorize]
    public async Task<IActionResult> UpdateTask(string id, [FromBody] Models.Task task)
    {
        try
        {
            if (id != task.Id)
            {
                return BadRequest("ID in url and body mismatch"); // 400 Bad Request status code
                // + message in the response body
            }
            var result = await _context.Tasks.ReplaceOneAsync(t => t.Id == id, task);
            if (result.MatchedCount == 0)
            {
                return NotFound(); // 404 Not Found status code
            }
            return NoContent(); // 204 status code
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // 500 internal
            // server error + message in the response body
        }
    }

    [HttpDelete("{id}")] // DELETE /api/tasks/{id}
    [Authorize]
    public async Task<IActionResult> DeleteTask(string id)
    {
        try
        {
            var result = await _context.Tasks.DeleteOneAsync(t => t.Id == id);
            if (result.DeletedCount == 0)
            {
                return NotFound(); // 404 Not Found status code
            }
            return NoContent(); // 204 status code
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // 500 internal
            // server error + message in the response body
        }
    }
}
