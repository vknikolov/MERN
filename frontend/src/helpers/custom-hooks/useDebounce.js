import { useEffect, useState } from "react";
// Custom hook to debounce a value over a specified delay
export function useDebounce(value, delay = 400) {
  // State to hold the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  // Update debounced value after the specified delay when the input value changes
  useEffect(() => {
    // Set a timer to update the debounced value
    const timer = setTimeout(() => {
      // Update the debounced value
      setDebouncedValue(value);
    }, delay);
    // Cleanup function to clear the timer if value or delay changes before timeout
    return () => {
      clearTimeout(timer);
    };
    // Dependency array to re-run effect when value or delay changes
  }, [value, delay]);

  return debouncedValue;
}
