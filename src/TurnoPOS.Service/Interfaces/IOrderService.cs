using TurnoPOS.Data.Models;
using TurnoPOS.Service.Model;

namespace TurnoPOS.Service.Interfaces;

public interface IOrderService
{
    Task<Order> Create(Order order);
    Task<Order?> GetById(int id);
    Task<IList<Order>> GetAll(DateTime date);
    Task<List<ItemSold>> GetItemsSold();
    Task<IEnumerable<DateTime>> GetOrderDates();
    Task Cancel(int id);
    Task Print(int id);
}
