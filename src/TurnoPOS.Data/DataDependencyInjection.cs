using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TurnoPOS.Data.Repositories;

namespace TurnoPOS.Data;

public static class DataDependencyInjection
{
    public static void ConfigureDataServices(this IServiceCollection services, ConfigurationManager configuration)
    {
        // Add DbContext with SQLite
        services.AddDbContext<TurnoDbContext>(options =>
            options.UseSqlite("Data Source=turnopos.db"));

        services.AddTransient<IGenericRepository, GenericRepository>();
    }

    public static void InitializeDatabase(this IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<TurnoDbContext>();
        dbContext.Database.Migrate();
    }
}
