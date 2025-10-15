using Microsoft.Extensions.Options;
using TurnoPOS.Data.Models;
using TurnoPOS.Data.Repositories;
using TurnoPOS.Service.Configuration;
using TurnoPOS.Service.Interfaces;
using TurnoPOS.Service.Model;

namespace TurnoPOS.Service.Services;

public class OrderService(IGenericRepository repository,
    IOptions<TurnoOptions> options,
    IThermalPrinterService printer) : IOrderService
{
    public async Task<Order> Create(Order order)
    {
        await UpdateItemStock(order, decrease: true);
        order.Status = OrderStatus.Completed;
        var result = repository.Insert(order);

        await repository.SaveAsync();
        return result;
    }

    private async Task UpdateItemStock(Order order, bool decrease)
    {
        List<long> itemIds = [.. order.OrderLines.Select(ol => ol.ItemId).Distinct()];
        var itemsQuery = repository.Get<Item>(i => itemIds.Contains(i.Id));

        var items = (await repository.ToList(itemsQuery))
            .ToDictionary(x => x.Id);

        foreach (var orderLine in order.OrderLines)
        {
            if (items.TryGetValue(orderLine.ItemId, out var item))
            {
                item.Stock += (decrease ? -orderLine.Quantity : orderLine.Quantity);
                repository.Update(item);
            }
            else
            {
                throw new KeyNotFoundException($"Item with ID {orderLine.ItemId} not found.");
            }
        }
    }

    public async Task<Order?> GetById(int id)
    {
        var query = repository.Get<Order>(
            x => x.Id == id,
            $"{nameof(Order.OrderLines)}.{nameof(OrderLine.Item)}");

        return (await repository.ToList(query))
            .FirstOrDefault();
    }

    private async Task<Order> Get(int id, bool withItems = false)
    {
        var query = repository.Get<Order>(x => x.Id == id,
            withItems
            ? $"{nameof(Order.OrderLines)}.{nameof(OrderLine.Item)}.{nameof(Item.Department)}"
            : nameof(Order.OrderLines));
        return await repository.FirstOrDefault(query)
            ?? throw new KeyNotFoundException($"Item with id {id} not found.");
    }
    public async Task<IList<Order>> GetAll(DateTime date)
    {
        var query = repository.Get<Order>(x=> x.CreatedAt.Date == date.Date,
            orderBy: x => x.OrderByDescending(y => y.CreatedAt));
        return await repository.ToList(query);
    }

    public async Task<List<ItemSold>> GetItemsSold(DateTime? date)
    {
        var query = repository.Query<OrderLine>()
            .Where(ol =>
                ol.Order.Status == OrderStatus.Completed
                && (!date.HasValue || ol.Order.CreatedAt.Date == date.Value.Date))
            .GroupBy(ol => ol.Item)
            .Select(g => new ItemSold
            {
                Id = g.Key.Id,
                Name = g.Key.Name,
                Quantity = g.Sum(ol => ol.Quantity),
                Total = g.Sum(ol => ol.Price * ol.Quantity)
            })
            .OrderBy(iS => iS.Name);

        var items = await repository.ToList(query);

        return items;
    }
    public async Task Cancel(int id)
    {
        var order = await Get(id);
        order.Status = OrderStatus.Cancelled;
        repository.Update(order);
        await UpdateItemStock(order, decrease: false);
        await repository.SaveAsync();
    }

    public async Task Print(int id)
    {
        var order = await Get(id, true);
        var lines = new List<PrintLine>
        {
            new() { Type = PrintLineType.Header, Text = $"Detalles de la orden " + order.Id },
            new() { Type = PrintLineType.Text, Text = order.CreatedAt.ToString("d/M/yyyy hh:mm:ss tt") },
            new() { Type = PrintLineType.BlankLine, Text = "" },
            new() { Type = PrintLineType.TableHeader1, Text = "Detalle" },
            new() { Type = PrintLineType.TableHeader2, Text = "Precio" },
            new() { Type = PrintLineType.TableHeader3, Text = "Subtotal" },
        };

        foreach (var line in order.OrderLines)
        {
            lines.Add(new PrintLine
            {
                Type = PrintLineType.TableColumn1,
                Text = $"{line.Quantity} x {line.Item?.Name ?? "N/A"}"
            });
            lines.Add(new PrintLine
            {
                Type = PrintLineType.TableColumn2,
                Text = $"{line.Price:N0}"
            });
            lines.Add(new PrintLine
            {
                Type = PrintLineType.TableColumn3,
                Text = $"{(line.Price * line.Quantity):N0}"
            });
        }

        var totalPrice = order.OrderLines.Sum(ol => ol.Price * ol.Quantity);
        lines.Add(new PrintLine { Type = PrintLineType.BlankLine, Text = "" });
        lines.Add(new PrintLine { Type = PrintLineType.TableHeader2, Text = "Total:" });
        lines.Add(new PrintLine { Type = PrintLineType.TableHeader3, Text = $"₡{totalPrice:N0}" });
        lines.Add(new PrintLine { Type = PrintLineType.BlankLine, Text = "" });
        lines.Add(new PrintLine { Type = PrintLineType.FootNote, Text = options.Value.FooterMessage });

        printer.Print(lines);

        var itemsByDepartment = order.OrderLines.GroupBy(ol => ol.Item!.Department);
        foreach (var group in itemsByDepartment)
        {
            lines.Clear();
            lines.Add(new() { Type = PrintLineType.Text, Text = $"Orden {id}. Retirar en: " + (group.Key?.Name ?? "Cocina") });
            lines.Add(new PrintLine { Type = PrintLineType.BlankLine, Text = "" });

            foreach (var line in group)
            {
                lines.Add(new() { Type = PrintLineType.Text, Text = $"{line.Quantity} x {line.Item?.Name ?? "N/A"}" });
            }
            printer.Print(lines);
        }

        lines.Clear();

    }

    public async Task<IEnumerable<DateTime>> GetOrderDates()
    {
        var query = repository.Query<Order>()
            .Select(x => x.CreatedAt.Date)
            .Distinct()
            .Order();

        var result = await repository.ToList(query);
        return result;
    }
}
