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
 

/** Derives up to two initials from a person's name, e.g. "Mrs. Marta Dooley" -> "MD" */
export const getInitials = (name: string): string => {
  const words = name
    .split(/\s+/)
    .filter((word) => word.length > 0)
    // Drop common titles so initials reflect the person's actual name
    .filter((word) => !/^(mr|mrs|ms|dr|miss|prof)\.?$/i.test(word));
 
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
 
  const first = words[0][0];
  const last = words[words.length - 1][0];
  return `${first}${last}`.toUpperCase();
};
 
/** Soft, accessible-contrast colour pairs for generated avatars */
const AVATAR_PALETTE: { bg: string; fg: string }[] = [
  { bg: '#FDECD2', fg: '#9A5B13' }, // peach
  { bg: '#DCFCE7', fg: '#15803D' }, // green
  { bg: '#DBEAFE', fg: '#1D4ED8' }, // blue
  { bg: '#F3E8FF', fg: '#7E22CE' }, // purple
  { bg: '#FCE7F3', fg: '#BE185D' }, // pink
  { bg: '#FEF3C7', fg: '#A16207' }, // yellow
  { bg: '#E0F2FE', fg: '#0369A1' }, // sky
];
 
/** Deterministically maps an id to a colour pair so avatars stay stable across renders */
export const getAvatarColors = (seed: number): { bg: string; fg: string } => {
  const index = Math.abs(seed) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
};