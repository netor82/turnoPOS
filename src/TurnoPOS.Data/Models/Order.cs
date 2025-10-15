using TurnoPOS.Data.Models.Base;

namespace TurnoPOS.Data.Models;

public class Order : BaseEntity
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    public decimal Total { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Completed;
    public PaymentType PaymentType { get; set; } = PaymentType.Cash;
    public List<OrderLine> OrderLines { get; set; } = [];
}

public enum OrderStatus
{
    Completed = 1,
    Cancelled = 2
}

public enum PaymentType
{
    Cash = 1,
    Card = 2,
    Transfer = 3,
    Sinpe = 4,
    Other
}