using TurnoPOS.Data.Models;

namespace TurnoPOS.Service.Interfaces;

public interface IDepartmentService
{
    Task<IList<Department>> GetAll();
    Task<Department?> GetById(long id);
    Task<Department> Create(Department department);
    Task Update(Department department);
}
