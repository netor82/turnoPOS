namespace TurnoPOS.Service.Model;

public class PrintLine
{
    public PrintLineType Type { get; set; }
    public string Text { get; set; } = string.Empty;
}

public enum PrintLineType
{
    Text,
    BlankLine,
    Header,

    TableHeader1,
    TableHeader2,
    TableHeader3,

    TableColumn1,
    TableColumn2,
    TableColumn3
}
