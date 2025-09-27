using TurnoPOS.Data.Models.Base;

namespace TurnoPOS.Data.Models;

public class OrderLine : BaseEntity
{
    public long OrderId { get; set; }
    public long ItemId { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal Total => Price * Quantity;
    public Order? Order { get; set; }
    public Item? Item { get; set; }
}
