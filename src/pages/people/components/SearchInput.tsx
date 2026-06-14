import { ChangeEvent, ReactElement } from 'react';
import SearchIcon from '@/icons/search.svg?react';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search people',
}: SearchInputProps): ReactElement => {
  return (
    <div className="group relative w-full max-w-[32rem]">
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute left-[1.2rem] top-1/2 h-[1.6rem] w-[1.6rem] -translate-y-1/2 text-[var(--colors-gray-400)] group-focus-within:text-[var(--colors-brand)]"
      />

      <input
        type="search"
        role="searchbox"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        className="w-full rounded-full border border-[var(--colors-gray-300)] bg-[var(--colors-blank)]
          py-[0.9rem] pl-[4rem] pr-[4rem] text-[1.4rem] text-[var(--colors-gray-800)]
          placeholder:text-[var(--colors-gray-400)]
          transition-colors duration-150
          hover:border-[var(--colors-brand)] hover:bg-[var(--colors-brand-subtle)]
          focus:border-[var(--colors-brand)] focus:bg-[var(--colors-blank)] focus:outline-none
          focus:ring-2 focus:ring-[var(--colors-brand)] focus:ring-offset-1"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-[1rem] top-1/2 flex h-[2rem] w-[2rem] -translate-y-1/2 items-center
            justify-center rounded-full text-[var(--colors-gray-400)]
            hover:bg-[var(--colors-gray-100)] hover:text-[var(--colors-gray-700)]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--colors-brand)]"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-[1.4rem] w-[1.4rem]" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};