using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MyContactAPI.Models;
using NLog.Web;
using System.Text;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
        });
        services.AddControllers();
        services.AddLogging(config =>
        {
            config.AddConsole();
        });

        services.AddDbContext<MyDbContext>(options =>
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));


        services.AddLogging(configure =>
        {
            configure.ClearProviders(); 
            configure.AddNLog("NLog.config"); 
        });
        services.AddCors(c =>
        {
            c.AddPolicy("alloworigin", options => options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
        });

        var key = Encoding.ASCII.GetBytes(Configuration["Jwt:Key"]!);
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = Configuration["Jwt:Issuer"],
                    ValidAudience = Configuration["Jwt:Audience"],
                };

            });

        services.AddAuthorization();

        // Add configuration from appsettings.json
        //Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        //    .AddEnvironmentVariables();

    }

    
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseRouting(); 
        app.UseCors("AllowMyOrigin");
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API v1");
            c.RoutePrefix = "swagger"; 
        });
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}
