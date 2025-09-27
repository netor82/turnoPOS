using TurnoPOS.Data.Models;
using TurnoPOS.Data.Repositories;
using TurnoPOS.Service.Interfaces;

namespace TurnoPOS.Service.Services;

public class InventoryService(IGenericRepository genericRepository) : IInventoryService
{
    public async Task<IEnumerable<Item>> GetAll(int? parentId, bool includeAll = false)
    {
        var query = genericRepository.Get<Item>(i => 
            i.ParentId == parentId
            && (includeAll || i.IsActive));
        return await genericRepository.ToListAsync(query);
    }
    public async Task<Item> GetById(int id)
    {
        return await genericRepository.GetById<Item>(id)
            ?? throw new KeyNotFoundException($"Item with id {id} not found.");
    }
    public Item Create(Item item)
    {
        return genericRepository.Insert(item);
    }
    public void Update(Item item)
    {
        genericRepository.Update(item);
    }
    public async Task<Item> PatchActive(int id, bool isActive)
    {
        var item = await GetById(id);

        if (item.IsActive != isActive)
        {
            item.IsActive = isActive;
            genericRepository.Update(item);
        }
        return item;
    }
    public async Task<Item> PatchStock(int id, int units)
    {
        var item = await GetById(id);
        
        item.Stock += units;
        genericRepository.Update(item);
        return item;
    }
    public async Task<Item> PatchParent(int id, int? parentId)
    {
        var item = await GetById(id);

        if (item.ParentId != parentId)
        {
            item.ParentId = parentId;
            genericRepository.Update(item);
        }
        return item;
    }
    public async Task<bool> Delete(int id)
    {
        var item = await genericRepository.GetById<Item>(id);
        if (item == null)
        {
            return false;
        }
        genericRepository.Delete(item);
        return true;
    }
}
