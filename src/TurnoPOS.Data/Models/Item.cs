using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using TurnoPOS.Data.Models.Base;

namespace TurnoPOS.Data.Models;

public class Item : BaseEntity
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

    [ForeignKey(nameof(ParentId)), JsonIgnore]
    public Item? Parent { get; set; }

    [ForeignKey(nameof(DepartmentId))]
    public Department? Department { get; set; }

    public ICollection<Item> Children { get; set; } = [];
}
