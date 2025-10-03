using TurnoPOS.Data.Models;
using TurnoPOS.Service.Model;

namespace TurnoPOS.Service.Interfaces;

public interface IInventoryService
{
    Task<IEnumerable<ItemDTO>> GetAll(int? parentId, bool includeAll = false);
    Task<Item> GetById(int id);
    Task<Item> Create(Item item);
    Task Update(Item item);
    Task<Item> PatchActive(int id, bool isActive);
    Task<Item> PatchStock(int id, int units);
    Task<Item> PatchParent(int id, int? parentId);
    Task<bool> Delete(int id);
}
