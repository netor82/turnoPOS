using TurnoPOS.Data.Models;
using TurnoPOS.Data.Repositories;
using TurnoPOS.Service.Interfaces;

namespace TurnoPOS.Service.Services;

public class OrderService(IGenericRepository genericRepository) : IOrderService
{
    public async Task<Order> Create(Order order)
    {
        await UpdateItemStock(order, decrease:true);
        order.Status = OrderStatus.Completed;
        var result = genericRepository.Insert(order);

        await genericRepository.SaveAsync();
        return result;
    }

    private async Task UpdateItemStock(Order order, bool decrease)
    {
        List<long> itemIds = [.. order.OrderLines.Select(ol => ol.ItemId).Distinct()];
        var itemsQuery = genericRepository.Get<Item>(i => itemIds.Contains(i.Id));
        
        var items = (await genericRepository.ToList(itemsQuery))
            .ToDictionary(x => x.Id);
        
        foreach (var orderLine in order.OrderLines)
        {
            if (items.TryGetValue(orderLine.ItemId, out var item))
            {
                item.Stock += (decrease ? -orderLine.Quantity : orderLine.Quantity);
                genericRepository.Update(item);
            }
            else
            {
                throw new KeyNotFoundException($"Item with ID {orderLine.ItemId} not found.");
            }
        }
    }

    public async Task<Order?> GetById(int id)
    {
        var query = genericRepository.Get<Order>(
            x => x.Id == id,
            $"{nameof(Order.OrderLines)}.{nameof(OrderLine.Item)}");

        return (await genericRepository.ToList(query))
            .FirstOrDefault();
    }

    private async Task<Order> Get(int id)
    {
        var query = genericRepository.Get<Order>(x => x.Id == id, nameof(Order.OrderLines));
        return await genericRepository.FirstOrDefault(query)
            ?? throw new KeyNotFoundException($"Item with id {id} not found.");
    }
    public async Task<IList<Order>> GetAll()
    {
        var query = genericRepository.Get<Order>(orderBy: x => x.OrderByDescending(y => y.CreatedAt));
        return await genericRepository.ToList(query);
    }
    public async Task Cancel(int id)
    {
        var order = await Get(id);
        order.Status = OrderStatus.Cancelled;
        genericRepository.Update(order);
        await UpdateItemStock(order, decrease:false);
        await genericRepository.SaveAsync();
    }
}
