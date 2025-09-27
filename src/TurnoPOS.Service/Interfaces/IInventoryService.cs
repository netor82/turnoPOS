using TurnoPOS.Data.Models;

namespace TurnoPOS.Service.Interfaces;

public interface IInventoryService
{
    Task<IEnumerable<Item>> GetAll(int? parentId, bool includeAll = false);
    Task<Item> GetById(int id);
    Item Create(Item item);
    void Update(Item item);
    Task<Item> PatchActive(int id, bool isActive);
    Task<Item> PatchStock(int id, int units);
    Task<Item> PatchParent(int id, int? parentId);
    Task<bool> Delete(int id);
}
