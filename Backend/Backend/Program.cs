using Backend.Models;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);

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

builder.Services.AddSingleton<MongoDBContext>();

var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);

// middlewares
app.MapControllers();

app.Run();
