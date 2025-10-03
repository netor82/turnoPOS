using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TurnoPOS.Service.Model;

public class ItemDTO
{
    public bool IsDirectory { get; set; } = false;
    public long? ParentId { get; set; }
    public long? DepartmentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public int Order { get; set; }
    public bool IsActive { get; set; } = true;

    public static ItemDTO FromEntity(Data.Models.Item item)
    {
        return new ItemDTO
        {
            IsDirectory = item.IsDirectory,
            ParentId = item.ParentId,
            DepartmentId = item.DepartmentId,
            Name = item.Name,
            Description = item.Description,
            Price = item.Price,
            Stock = item.Stock,
            Order = item.Order,
            IsActive = item.IsActive
        };
    }
}
