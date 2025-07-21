import React, { useEffect, useRef } from "react";

interface SearchBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDebouncedChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  onDebouncedChange,
  placeholder = "Search...",
  className,
  debounceMs = 300,
}) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!onDebouncedChange) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onDebouncedChange(value);
    }, debounceMs);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, onDebouncedChange, debounceMs]);

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded px-3 py-2 w-full md:w-64 bg-white text-gray-900 dark:bg-gray-900 dark:text-white dark:border-gray-700 ${className || ""}`}
    />
  );
};

export default SearchBox; 