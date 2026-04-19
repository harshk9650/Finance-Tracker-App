export const currencies = {
  USD: { symbol: '$', rate: 1, name: 'US Dollar' },
  EUR: { symbol: '\u20ac', rate: 0.92, name: 'Euro' },
  GBP: { symbol: '\u00a3', rate: 0.79, name: 'British Pound' },
  INR: { symbol: '\u20b9', rate: 83.5, name: 'Indian Rupee' },
  JPY: { symbol: '\u00a5', rate: 148.5, name: 'Japanese Yen' },
  CAD: { symbol: 'C$', rate: 1.35, name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', rate: 1.52, name: 'Australian Dollar' },
}

export const convertAmount = (amount, fromCurrency, toCurrency) => {
  const fromRate = currencies[fromCurrency]?.rate || 1
  const toRate = currencies[toCurrency]?.rate || 1
  return (amount / fromRate) * toRate
}

export const formatCurrency = (amount, currencyCode) => {
  const currency = currencies[currencyCode] || currencies.USD
  return `${currency.symbol}${amount.toFixed(2)}`
}
