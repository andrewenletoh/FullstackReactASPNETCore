namespace Backend.Dtos.Tasks;

public record TaskResponse(
    string Id,
    string Title,
    string Description,
    Models.TaskStatus Status
)
{
    public static TaskResponse FromTask(Models.Task task)
    {
        return new TaskResponse(
            task.Id,
            task.Title,
            task.Description,
            task.Status
        );
    }
}
