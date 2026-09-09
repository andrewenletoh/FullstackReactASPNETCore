using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Backend.Models;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost] // POST /api/tasks
    public async Task<IActionResult> AddTask(Models.Task task)
    {
        try
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
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
            var query = _context.Tasks.AsNoTracking();

            if (status.HasValue)
            {
                query = query.Where(t => t.Status == status.Value);
            }

            var tasks = await query.ToListAsync();
            return Ok(tasks); // 200 Ok status code + task objects in the body
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // 500 internal
            // server error + message in the response body
        }
    }

    [HttpGet("{id:int}", Name = "GetTask")] // GET /api/tasks/{id}
    public async Task<IActionResult> GetTask(int id)
    {
        try
        {
            var task = await _context.Tasks.FindAsync(id);
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

    [HttpPut("{id:int}")] // PUT /api/tasks/{id}
    public async Task<IActionResult> UpdateTask(int id, [FromBody] Models.Task task)
    {
        try
        {
            if (id != task.Id)
            {
                return BadRequest("ID in url and body mismatch"); // 400 Bad Request status code
                // + message in the response body
            }
            if (!await _context.Tasks.AnyAsync(t => t.Id == id))
            {
                return NotFound(); // 404 Not Found status code
            }
            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();
            return NoContent(); // 204 status code
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // 500 internal
            // server error + message in the response body
        }
    }

    [HttpDelete("{id:int}")] // DELETE /api/tasks/{id}
    public async Task<IActionResult> DeleteTask(int id)
    {
        try
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound(); // 404 Not Found status code
            }
            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return NoContent(); // 204 status code
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // 500 internal
            // server error + message in the response body
        }
    }
}
