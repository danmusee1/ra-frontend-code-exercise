import { ButtonHTMLAttributes, ReactElement, ReactNode, forwardRef } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  children: ReactNode;
};

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-[var(--colors-brand)] text-[var(--colors-blank)] hover:bg-[var(--colors-brand-hover)] active:bg-[var(--colors-brand-active)]',
  secondary:
    'bg-[var(--colors-blank)] text-[var(--colors-gray-700)] border border-[var(--colors-gray-300)] hover:border-[var(--colors-brand)] hover:text-[var(--colors-brand)]',
  danger:
    'bg-[var(--colors-redPink)] text-[var(--colors-blank)] hover:bg-[#e6434f] active:bg-[#cc3b46]',
};

/**
 * Pill-shaped button matching the design system's Default / Hover / Focus / Loading states.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref): ReactElement => {
  const { variant = 'primary', isLoading, disabled, className = '', children, ...rest } = props;

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[1.4rem]
        font-medium transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--colors-brand)] focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <span
          role="status"
          aria-label="Loading"
          className="h-[1.6rem] w-[1.6rem] animate-spin rounded-full border-2 border-current border-t-transparent opacity-60"
        />
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';