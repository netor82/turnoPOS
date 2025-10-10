using System.Drawing;
using System.Drawing.Printing;
using System.Runtime.Versioning;
using TurnoPOS.Service.Interfaces;
using TurnoPOS.Service.Model;

namespace TurnoPOS.Service.Services;

[SupportedOSPlatform("windows6.1")]
public class ThermalPrinterService() : IThermalPrinterService
{
    private IEnumerator<PrintLine>? lines;
    private string textToPrint = string.Empty;

    private const string printerName = "80 Printer Series";

    private static readonly Font normalFont = new("Verdana", 10);
    private static readonly Font headerFont = new("Verdana", 12, FontStyle.Bold);
    private static readonly Font tableFont = new("Verdana", 8);
    private static readonly Font tableHeaderFont = new("Verdana", 8, FontStyle.Bold);
    private static readonly Font verticalFont = new("Verdana", 170);
    private static readonly StringFormat formatRight = new() { Alignment = StringAlignment.Far };
    private static readonly StringFormat formatCenter = new() { Alignment = StringAlignment.Center };
    private static readonly StringFormat formatDefault = new();
    private static readonly StringFormat formatVertical = new() { FormatFlags = StringFormatFlags.DirectionVertical };
    private const int dotsPerLine = 290;
    private const int gap = 5;
    private const int column2Start = (int)(dotsPerLine * 0.56); // 55% - 12% - 12%
    private const int column3Start = (int)(dotsPerLine * 0.77);


    public void Print(IEnumerable<PrintLine> line)
    {
        lines = line.GetEnumerator();

        PrintDocument pd = new()
        {
            DocumentName = "TurnoPOS Receipt",
            DefaultPageSettings = { Margins = new Margins(0, 0, 0, 0) },
            PrinterSettings = { PrinterName = printerName, Copies = 1 }
        };
        pd.PrintPage += new PrintPageEventHandler(Pd_Print);
        pd.Print();
    }

    private void Pd_Print(object sender, PrintPageEventArgs e)
    {
        if (lines == null || e.Graphics == null)
        {
            return;
        }
        int normalFontHeight = (int)normalFont.GetHeight(e.Graphics);
        int headerFontHeight = (int)headerFont.GetHeight(e.Graphics);
        int tableHeaderFontHeight = (int)tableHeaderFont.GetHeight(e.Graphics);
        int leftMargin = e.MarginBounds.Left;
        int topMargin = e.MarginBounds.Top;

        int yPos = topMargin;

        Font font;
        StringFormat format;
        int fontHeight;
        Rectangle rectangle = new() { Height = 100 };
        PrintLineType currentType;
        while (lines.MoveNext())
        {
            currentType = lines.Current.Type;
            switch (currentType)
            {
                case PrintLineType.Header:
                    font = headerFont;
                    format = formatDefault;
                    fontHeight = headerFontHeight;
                    break;
                case PrintLineType.TableHeader1:
                    font = tableHeaderFont;
                    format = formatCenter;
                    fontHeight = tableHeaderFontHeight;
                    break;
                case PrintLineType.TableHeader2 or PrintLineType.TableHeader3:
                    font = tableHeaderFont;
                    format = formatRight;
                    fontHeight = tableHeaderFontHeight;
                    break;
                case PrintLineType.TableColumn1:
                    font = tableFont;
                    format = formatDefault;
                    fontHeight = tableHeaderFontHeight;
                    break;
                case PrintLineType.TableColumn2 or PrintLineType.TableColumn3:
                    font = tableFont;
                    format = formatRight;
                    fontHeight = tableHeaderFontHeight;
                    break;
                default:
                    font = normalFont;
                    format = formatDefault;
                    fontHeight = normalFontHeight;
                    break;
            }

            rectangle.Y = yPos;
            switch (currentType)
            {
                case PrintLineType.TableHeader1 or PrintLineType.TableColumn1:
                    rectangle.X = leftMargin;
                    rectangle.Width = column2Start - gap;
                    break;
                case PrintLineType.TableHeader2 or PrintLineType.TableColumn2:
                    rectangle.X = leftMargin + column2Start;
                    rectangle.Width = column3Start - column2Start - gap;
                    break;
                case PrintLineType.TableHeader3 or PrintLineType.TableColumn3:
                    rectangle.X = leftMargin + column3Start;
                    rectangle.Width = dotsPerLine - column3Start - gap;
                    break;
                default:
                    rectangle.X = leftMargin;
                    rectangle.Width = dotsPerLine;
                    break;
            }

            e.Graphics.DrawString(lines.Current.Text, font, Brushes.Black, rectangle, format);
            if (currentType is not PrintLineType.TableHeader1 and not PrintLineType.TableHeader2 and not PrintLineType.TableColumn1 and not PrintLineType.TableColumn2)
            {
                yPos += fontHeight;
            }
        }
    }

    public void PrintVertical(string text)
    {
        textToPrint = text.Trim();

        PrintDocument pd = new()
        {
            DocumentName = "TurnoPOS Label",
            DefaultPageSettings = { Margins = new Margins(0, 0, 0, 0) },
            PrinterSettings = { PrinterName = printerName, Copies = 1 }
        };
        pd.PrintPage += new PrintPageEventHandler(Pd_PrintVertical);
        pd.Print();
    }

    private void Pd_PrintVertical(object sender, PrintPageEventArgs e)
    {
        Console.Write("Printing vertical: " + textToPrint);
        e.Graphics.DrawString(textToPrint, verticalFont, Brushes.Black, 0, 0, formatVertical);
    }
}
