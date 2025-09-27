using TurnoPOS.Data.Models.Base;

namespace TurnoPOS.Data.Models;

public class Department : BaseEntity
{
    public string Name { get; set; } = string.Empty;
}
