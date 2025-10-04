// Utility functions for formatting values

/**
 * Formats a number as currency.
 * @param value The number to format.
 * @param locale The locale string, e.g. 'en-US'.
 * @param currency The currency code, e.g. 'USD'.
 * @returns The formatted currency string.
 */
export function formatCurrency(
    value: number,
    locale: string = 'es-CR',
    currency: string = 'CRC'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
}

export function formatNumber(
    value: number,
    locale: string = 'es-CR'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
}

/**
 * Formats a date to a locale string.
 * @param date The date to format.
 * @param locale The locale string, e.g. 'en-US'.
 * @param options Intl.DateTimeFormatOptions for custom formatting.
 * @returns The formatted date string.
 */
export function formatDate(
    date: Date | string | undefined,
    locale: string = 'es-CR',
    options?: Intl.DateTimeFormatOptions
): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(locale, options);
}

/**
 * Formats a percentage value.
 * @param value The number to format as percentage (e.g. 0.25 for 25%).
 * @param fractionDigits Number of decimal places.
 * @returns The formatted percentage string.
 */
export function formatPercentage(
    value: number,
    fractionDigits: number = 2
): string {
    return `${(value * 100).toFixed(fractionDigits)}%`;
}