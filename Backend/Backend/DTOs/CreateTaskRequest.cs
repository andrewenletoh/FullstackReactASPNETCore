using System.ComponentModel.DataAnnotations;
namespace Backend.Dtos.Tasks;

public sealed class CreateTaskRequest
{
    [Required]
    [StringLength(120, MinimumLength = 1)]
    public string Title { get; init; } = string.Empty;

    [Required]
    [StringLength(2000)]
    public string Description { get; init; } = string.Empty;

    public Models.TaskStatus Status { get; init; } = Models.TaskStatus.ToDo;
}
