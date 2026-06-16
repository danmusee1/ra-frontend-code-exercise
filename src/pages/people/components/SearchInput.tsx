import {  ReactElement, useState } from 'react';
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
  const [focused, setFocused] = useState(false);

  const showClearButton = focused || value.length > 0;

  return (
    <div className="group relative w-full max-w-[32rem]">
      {/* Search Icon */}
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute left-[1.2rem] top-1/2 h-[1.6rem] w-[1.6rem]
          -translate-y-1/2 text-[var(--colors-gray-400)]
          group-focus-within:text-[var(--colors-brand)]"
      />

      {/* Input */}
      <input
        type="search"
        role="searchbox"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
         
className={`w-full rounded-full border border-[var(--colors-gray-300)]
  py-[0.9rem] pl-[4rem] pr-[4rem]
  text-[1.4rem] text-[var(--colors-gray-800)]
  placeholder:text-[var(--colors-gray-400)]
  transition-colors duration-150
  hover:border-[var(--colors-brand)]
  focus:border-[var(--colors-brand)]
  focus:outline-none
  focus:ring-2 focus:ring-[var(--colors-brand)]
  focus:ring-offset-1
${value ? 'bg-[var(--colors-blank)] focus:bg-[var(--colors-blank)]' : 'bg-[var(--colors-blank)] focus:bg-[var(--colors-brand-subtle)]'}
`}
      />

      {/* Clear Button */}
      <button
        type="button"
        onClick={() => onChange('')}
        aria-label="Clear search"
        className={`
          absolute right-[1rem] top-1/2 flex h-[2rem] w-[2rem]
          -translate-y-1/2 items-center justify-center
          rounded-full transition-all duration-150

          text-[var(--colors-gray-400)]
          hover:bg-[var(--colors-gray-100)]
          hover:text-[var(--colors-gray-700)]

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--colors-brand)]

          ${showClearButton ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}
        `}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-[1.4rem] w-[1.4rem]"
          aria-hidden="true"
        >
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};