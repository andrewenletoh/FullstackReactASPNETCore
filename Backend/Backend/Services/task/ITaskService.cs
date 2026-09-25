using Backend.Dtos.Tasks;

namespace Backend.Services.Tasks;

public interface ITaskService
{
    Task<IReadOnlyList<Models.Task>> GetTasksAsync(Models.TaskStatus? status, CancellationToken cancellationToken = default);
    Task<Models.Task?> GetTaskAsync(string id, CancellationToken cancellationToken = default);
    Task<Models.Task> CreateTaskAsync(CreateTaskRequest request, CancellationToken cancellationToken = default);
    Task<bool> UpdateTaskAsync(string id, UpdateTaskRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteTaskAsync(string id, CancellationToken cancellationToken = default);
}
