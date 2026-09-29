using Backend.Models;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Backend.Services.Health;

public sealed class MongoHealthCheck : IHealthCheck
{
    private readonly MongoDBContext _context;
    private readonly ILogger<MongoHealthCheck> _logger;

    public MongoHealthCheck(MongoDBContext context, ILogger<MongoHealthCheck> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await _context.PingAsync(cancellationToken);
            return HealthCheckResult.Healthy("MongoDB is reachable.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "MongoDB health check failed.");
            return HealthCheckResult.Unhealthy("MongoDB is not reachable.");
        }
    }
}
