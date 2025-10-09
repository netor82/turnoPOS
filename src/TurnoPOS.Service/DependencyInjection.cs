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

        services.AddScoped<IDepartmentService, DepartmentService>();
        services.AddScoped<IInventoryService, InventoryService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IThermalPrinterService, ThermalPrinterService>();

        return services;
    }

    public static void Initialize(this IServiceProvider serviceProvider)
    {
        serviceProvider.InitializeDatabase();
    }
}
