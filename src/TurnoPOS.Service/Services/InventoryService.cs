using TurnoPOS.Data.Models;
using TurnoPOS.Data.Repositories;
using TurnoPOS.Service.Interfaces;
using TurnoPOS.Service.Model;

namespace TurnoPOS.Service.Services;

public class InventoryService(IGenericRepository repository) : IInventoryService
{
    public async Task<IEnumerable<ItemDTO>> GetAll(int? parentId, bool includeAll = false)
    {
        var query = repository.Get<Item>(
            i => 
                (
                    !parentId.HasValue
                    ||
                    (parentId == 0 && i.ParentId == null)
                    ||
                    (i.ParentId == parentId)
                )
                && (includeAll || i.IsActive),
            i => i.OrderBy(x => x.IsDirectory));
        return (await repository.ToList(query)).Select(ItemDTO.FromEntity);
    }
    public async Task<Item> GetById(int id)
    {
        return await repository.GetById<Item>(id)
            ?? throw new KeyNotFoundException($"Item with id {id} not found.");
    }
    public async Task<Item> Create(Item item)
    {
        var result = repository.Insert(item);

        await repository.SaveAsync();
        return result;
    }
    public async Task Update(Item item)
    {
        repository.Update(item);
        await repository.SaveAsync();
    }
    public async Task<Item> PatchActive(int id, bool isActive)
    {
        var item = await GetById(id);

        if (item.IsActive != isActive)
        {
            item.IsActive = isActive;
            repository.Update(item);
        }
        return item;
    }
    public async Task<Item> PatchStock(int id, int units)
    {
        var item = await GetById(id);
        
        item.Stock += units;
        repository.Update(item);
        return item;
    }
    public async Task<Item> PatchParent(int id, int? parentId)
    {
        var item = await GetById(id);

        if (item.ParentId != parentId)
        {
            item.ParentId = parentId;
            repository.Update(item);
        }
        return item;
    }
    public async Task<bool> Delete(int id)
    {
        var item = await repository.GetById<Item>(id);
        if (item == null)
        {
            return false;
        }
        repository.Delete(item);
        return true;
    }
}
