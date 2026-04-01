export interface BasicPriceCalculatorConfig {
    enabled: boolean;
    currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
    basePrice: number;
}

// Price calculation utilities
export const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$'
};

export const formatPrice = (amount: number, currency: string): string => {
    const symbol = CURRENCY_SYMBOLS[currency] || '$';
    return `${symbol}${amount.toLocaleString()}`;
};