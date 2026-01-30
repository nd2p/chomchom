import { useRef, useEffect } from "react";

export function useDebounce<T>(value: T, delay = 300) {
  const ref = useRef(value);
  useEffect(() => {
    const t = setTimeout(() => {
      ref.current = value;
    }, delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return ref.current;
}
