import { useEffect, useState, useRef } from 'react';

// Custom hook that waits for the user to stop typing before updating input
export function useDebouncedNumericInput(
  value: number,
  setValue: (value: number) => void,
  min: number,
  max: number,
  delay: number = 600
) {
  const [inputValue, setInputValue] = useState(value.toString());
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const isTyping = useRef(false);

  // Clamp helper to keep values within limits
  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

  // Sync from props when not typing
  useEffect(() => {
    if (!isTyping.current) {
      setInputValue(value.toString());
    }
  }, [value]);
  
  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  // Handle change with debouncing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    isTyping.current = true;

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      const parsed = parseInt(newValue, 10);
      if (!isNaN(parsed)) {
        const clamped = clamp(parsed, min, max);
        setValue(clamped);
        setInputValue(clamped.toString());
      }
      isTyping.current = false;
    }, delay);
  };

  return { inputValue, handleChange };
}