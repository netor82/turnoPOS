using System.ComponentModel.DataAnnotations;

namespace TurnoPOS.Service.Configuration;

public class TurnoOptions
{
    [Required]
    public string PrinterName { get; set; } = string.Empty;
    [Required]
    public string FooterMessage { get; set; } = string.Empty;
}
