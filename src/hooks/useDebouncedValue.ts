import { useEffect, useState } from 'react';

type UseDebouncedValueOptions = {
  delay?: number;
};

export const useDebouncedValue = <T>(value: T, delay: number | UseDebouncedValueOptions = 300): T => {
  const resolvedDelay = typeof delay === 'number' ? delay : delay.delay ?? 300;
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, resolvedDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, resolvedDelay]);

  return debouncedValue;
};

export default useDebouncedValue;
