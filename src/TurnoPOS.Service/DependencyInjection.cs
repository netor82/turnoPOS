using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TurnoPOS.Data;
using TurnoPOS.Service.Interfaces;
using TurnoPOS.Service.Services;

namespace TurnoPOS.Service;

public static class DependencyInjection
{
    public static IServiceCollection ConfigureServices(this IServiceCollection services, ConfigurationManager configuration)
    {
        services.ConfigureDataServices(configuration);

        services.AddScoped<IInventoryService, InventoryService>();

        return services;
    }

    public static void Initialize(this IServiceProvider serviceProvider)
    {
        serviceProvider.InitializeDatabase();
    }
}
