using Backend.Dtos.Tasks;
using Backend.Models;
using MongoDB.Driver;

namespace Backend.Services.Tasks;

public sealed class TaskService : ITaskService
{
    private readonly MongoDBContext _context;
    private readonly ILogger<TaskService> _logger;

    public TaskService(MongoDBContext context, ILogger<TaskService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IReadOnlyList<Models.Task>> GetTasksAsync(
        Models.TaskStatus? status,
        CancellationToken cancellationToken = default)
    {
        var filter = status.HasValue
            ? Builders<Models.Task>.Filter.Eq(t => t.Status, status.Value)
            : Builders<Models.Task>.Filter.Empty;

        var tasks = await _context.Tasks.Find(filter).ToListAsync(cancellationToken);

        _logger.LogInformation("Retrieved {TaskCount} tasks with status filter {Status}", tasks.Count, status);
        return tasks;
    }

    public async Task<Models.Task?> GetTaskAsync(string id, CancellationToken cancellationToken = default)
    {
        return await _context.Tasks
            .Find(t => t.Id == id)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<Models.Task> CreateTaskAsync(
        CreateTaskRequest request,
        CancellationToken cancellationToken = default)
    {
        var task = new Models.Task
        {
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Status = request.Status
        };

        await _context.Tasks.InsertOneAsync(task, cancellationToken: cancellationToken);

        _logger.LogInformation("Created task {TaskId} with status {Status}", task.Id, task.Status);
        return task;
    }

    public async Task<bool> UpdateTaskAsync(
        string id,
        UpdateTaskRequest request,
        CancellationToken cancellationToken = default)
    {
        var update = Builders<Models.Task>.Update
            .Set(t => t.Title, request.Title.Trim())
            .Set(t => t.Description, request.Description.Trim())
            .Set(t => t.Status, request.Status);

        var result = await _context.Tasks.UpdateOneAsync(
            t => t.Id == id,
            update,
            cancellationToken: cancellationToken);

        if (result.MatchedCount == 0)
        {
            return false;
        }

        _logger.LogInformation("Updated task {TaskId} with status {Status}", id, request.Status);
        return true;
    }

    public async Task<bool> DeleteTaskAsync(string id, CancellationToken cancellationToken = default)
    {
        var result = await _context.Tasks.DeleteOneAsync(
            t => t.Id == id,
            cancellationToken);

        if (result.DeletedCount == 0)
        {
            return false;
        }

        _logger.LogInformation("Deleted task {TaskId}", id);
        return true;
    }
}
