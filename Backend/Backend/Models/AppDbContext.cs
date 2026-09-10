using MongoDB.Driver;

namespace Backend.Models;

public class MongoDBContext
{
    private readonly IMongoDatabase _database;
    public MongoDBContext(IConfiguration config)
    {
        var client = new MongoClient(config.GetConnectionString("Default"));
        _database = client.GetDatabase(config["MongoDbName"] ?? "backend");
    }

    public IMongoCollection<Task> Tasks => _database.GetCollection<Task>("tasks");

}