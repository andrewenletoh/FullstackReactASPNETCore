using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

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
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

    [BsonElement("title")]
    [BsonRequired]
    public string Title { get; set; } = string.Empty;

    [BsonElement("description")]
    [BsonRequired]
    public string Description { get; set; } = string.Empty;

    [BsonElement("status")]
    [BsonRepresentation(BsonType.String)]
    [BsonRequired]
    public TaskStatus Status { get; set; } = TaskStatus.ToDo;
}