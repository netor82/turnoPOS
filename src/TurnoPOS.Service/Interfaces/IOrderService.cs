using TurnoPOS.Data.Models;

namespace TurnoPOS.Service.Interfaces;

public interface IOrderService
{
    Task<Order> Create(Order order);
    Task<Order?> GetById(int id);
    Task<IList<Order>> GetAll();
    Task Cancel(int id);
    Task Print(int id);
}
