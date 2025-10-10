namespace TurnoPOS.Service.Model;

public class ItemSold
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Total { get; set; }
}
