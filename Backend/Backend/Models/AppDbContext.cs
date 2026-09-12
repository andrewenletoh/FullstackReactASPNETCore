using MongoDB.Driver;
using MongoDB.Driver.Authentication.AWS;

namespace Backend.Models;

public class MongoDBContext
{
    private readonly IMongoDatabase _database;
    public MongoDBContext(IConfiguration config)
    {
        // Registers the AWS auth provider so the driver knows how to fetch credentials
        // for the MONGODB-AWS mechanism.
        MongoClientSettings.Extensions.AddAWSAuthentication();

        // With authMechanism=MONGODB-AWS&authSource=$external already in the connection
        // string, the driver auto-retrieves credentials (AWS_ACCESS_KEY_ID, etc.) from
        // Lambda's environment - no explicit Credential object needed.
        var settings = MongoClientSettings.FromConnectionString(config.GetConnectionString("Default"));

        var client = new MongoClient(settings);


        _database = client.GetDatabase(config["MongoDbName"] ?? "backend");
    }

    public IMongoCollection<Task> Tasks => _database.GetCollection<Task>("tasks");

}