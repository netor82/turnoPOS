using TurnoPOS.Data.Models;
using TurnoPOS.Data.Repositories;
using TurnoPOS.Service.Interfaces;

namespace TurnoPOS.Service.Services;

public class DepartmentService(IGenericRepository repository) : IDepartmentService
{
    public async Task<Department> Create(Department department)
    {
        var result = repository.Insert(department);

        await repository.SaveAsync();
        return result;
    }

    public async Task<IList<Department>> GetAll()
    {
        var query = repository.Get<Department>(d => true, orderBy: x => x.OrderBy(d => d.Name));
        return await repository.ToListAsync(query);
    }

    public async Task<Department?> GetById(long id)
    {
        return await repository.GetById<Department>(id);
    }
}
