/**
 * Formats a salary stored in minor units (cents) into the design's
 * "CODE amount SYMBOL" format, e.g. `formatSalary(21500098, 'EUR')` -> "EUR 215.000,98 €"
 */
export const formatSalary = (amountInMinorUnits: number, currencyCode: string): string => {
  const amount = amountInMinorUnits / 100;
 
  const formattedAmount = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
 
  return `${currencyCode} ${formattedAmount} ${getCurrencySymbol(currencyCode)}`;
};
 
/**
 * Resolves a currency code (e.g. "EUR") to its narrow symbol (e.g. "€"),
 * falling back to the code itself if the runtime doesn't recognise it.
 */
export const getCurrencySymbol = (currencyCode: string): string => {
  try {
    const parts = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol',
    }).formatToParts(0);
 
    return parts.find((part) => part.type === 'currency')?.value ?? currencyCode;
  } catch {
    return currencyCode;
  }
};
 

