export type ButtonVariant = 'primary' | 'secondary' | 'danger';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--colors-brand)] text-[var(--colors-blank)] hover:bg-[var(--colors-brand-hover)] active:bg-[var(--colors-brand-active)]',
  secondary:
    'bg-[var(--colors-blank)] text-[var(--colors-gray-700)] border border-[var(--colors-gray-300)] hover:border-[var(--colors-brand)] hover:text-[var(--colors-brand)]',
  danger:
    'bg-[var(--colors-redPink)] text-[var(--colors-blank)] hover:bg-[#e6434f] active:bg-[#cc3b46]',
};

const BASE_BUTTON_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[1.4rem] ' +
  'font-medium transition-colors duration-150 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--colors-brand)] focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

/**
 * Returns the button's visual classes so non-`<button>` elements (e.g. a
 * Tanstack Router `Link` styled as a primary action) can match its appearance.
 */
export const getButtonClasses = (variant: ButtonVariant = 'primary', className = ''): string =>
  `${BASE_BUTTON_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`;
