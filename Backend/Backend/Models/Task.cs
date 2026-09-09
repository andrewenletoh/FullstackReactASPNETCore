using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public enum TaskStatus
{
    ToDo,
    InProgress,
    Blocked,
    Done,
    Backlog
}

public class Task
{
    public int Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(32767)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public TaskStatus Status { get; set; } = TaskStatus.ToDo;
}