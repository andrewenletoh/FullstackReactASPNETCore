using MongoDB.Driver;
using MongoDB.Driver.Authentication.AWS;

namespace Backend.Models;

public class MongoDBContext
{
    private readonly IMongoDatabase _database;

    public IMongoCollection<Task> Tasks => _database.GetCollection<Task>("tasks");
    public IMongoCollection<User> Users => _database.GetCollection<User>("users");
    public MongoDBContext(IConfiguration config)
    {
        // Registers the AWS auth provider so the driver knows how to fetch credentials
        // for the MONGODB-AWS mechanism.
        MongoClientSettings.Extensions.AddAWSAuthentication();

        // With authMechanism=MONGODB-AWS&authSource=$external already in the connection
        // string, the driver auto-retrieves credentials (AWS_ACCESS_KEY_ID, etc.) from
        // Lambda's environment
        var settings = MongoClientSettings.FromConnectionString(config.GetConnectionString("Default"));

        var client = new MongoClient(settings);

        _database = client.GetDatabase(config["MongoDbName"] ?? "backend");

        var usernameIndex = new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(u => u.Username), new CreateIndexOptions { Unique = true });
        Users.Indexes.CreateOne(usernameIndex);
    }

}