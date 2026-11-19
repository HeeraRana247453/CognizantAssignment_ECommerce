import { useState, useEffect } from 'react';

// Works like useState, but the value is also saved in localStorage
// and read back when the app loads.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch (error) {
      console.error(`Could not read "${key}" from localStorage`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Could not save "${key}" to localStorage`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
