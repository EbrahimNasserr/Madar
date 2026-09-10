import { useEffect, useState } from "react";

/**
 * Delays updating the returned value until `delay` ms have passed
 * since the last change to `value`. Use this to avoid firing an API
 * request on every keystroke in a search input.
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
