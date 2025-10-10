using TurnoPOS.Service.Model;

namespace TurnoPOS.Service.Interfaces;

public interface IThermalPrinterService
{
    void Print(IEnumerable<PrintLine> line);
    void PrintVertical(string text);
}
