using System.Text;
using BLL.Interfaces;
using BLL.Services;
using Core.Configurations;
using Core.Helpers;
using Core.Models;
using DAL;
using DAL.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QuestPDF.Infrastructure;

namespace Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.OperationFilter<SwaggerFileOperationFilter>();
            });

            // CORS (з підтримкою credentials)
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontendApp", policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            // DB
            builder.Services.AddDbContext<ApplicationContext>(options =>
            {
                options.UseLazyLoadingProxies()
                    .UseSqlServer(builder.Configuration.GetConnectionString("DBConnectionString"));
            });

            // Services & Repos
            builder.Services.AddScoped<IDeviceService, DeviceService>();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<IElixirService, ElixirService>();
            builder.Services.AddScoped<IHistoryService, HistoryService>();
            builder.Services.AddScoped<INoteService, NoteService>();
            builder.Services.AddScoped<IPreferencesService, PreferencesService>();
            builder.Services.AddScoped<IFileRepository, FileRepository>();
            builder.Services.AddScoped<IBackupService>(provider =>
                new BackupService(
                    builder.Configuration.GetConnectionString("DBConnectionString"),
                    provider.GetRequiredService<ILogger<BackupService>>(),
                    builder.Configuration));
            builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            builder.Services.AddScoped<UnitOfWork>();

            builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection(nameof(EmailSettings)));

            // Identity (без cookie login-redirect!)
            builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
            {
                options.SignIn.RequireConfirmedAccount = false;
            })
                .AddEntityFrameworkStores<ApplicationContext>()
                .AddDefaultTokenProviders();

            builder.Services.AddScoped<UserManager<AppUser>>();
            builder.Services.AddScoped<SignInManager<AppUser>>();

            // JWT config
            var jwtKey = builder.Configuration["Jwt:Key"];
            var jwtIssuer = builder.Configuration["Jwt:Issuer"];
            var jwtAudience = builder.Configuration["Jwt:Audience"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!));

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = jwtIssuer,
                        ValidateAudience = true,
                        ValidAudience = jwtAudience,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Cookies["access_token"];
                            if (!string.IsNullOrEmpty(accessToken))
                            {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        },
                        OnChallenge = context =>
                        {
                            context.HandleResponse();
                            context.Response.StatusCode = 401;
                            context.Response.ContentType = "application/json";
                            return context.Response.WriteAsync("{\"message\":\"Unauthorized\"}");
                        }
                    };
                });

            builder.Services.AddAuthorization();

            // Logging
            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();

            // PDF
            QuestPDF.Settings.License = LicenseType.Community;

            var app = builder.Build();

            // Middlewares
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseDefaultFiles();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("AllowFrontendApp");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.MapFallbackToFile("/index.html");

            app.Run();

            Console.WriteLine("Application has been stopped.");
        }
    }
}
