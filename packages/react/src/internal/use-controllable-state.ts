import { useCallback, useState } from "react";

export interface UseControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export function useControllableState<T>({ value, defaultValue, onChange }: UseControllableStateOptions<T>) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : uncontrolledValue;

  const setValue = useCallback(
    (nextValue: T) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      if (!Object.is(currentValue, nextValue)) {
        onChange?.(nextValue);
      }
    },
    [currentValue, isControlled, onChange]
  );

  return [currentValue, setValue] as const;
}
