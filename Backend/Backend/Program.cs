using Microsoft.EntityFrameworkCore;

using Backend.Models;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173")
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                      });
});


//services
builder.Services.AddControllers();

string connectionString = builder.Configuration.GetConnectionString("Default") ?? throw new ArgumentNullException("connectionString is Null");
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));

var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);

// middlewares
app.MapControllers();

app.Run();
