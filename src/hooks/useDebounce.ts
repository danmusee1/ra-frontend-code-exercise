import { useEffect, useState } from 'react';

/** Debounces a value by `delayMs` — useful for delaying network requests while typing. */
export const useDebounce = <T,>(value: T, delayMs = 350): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
};