import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";
import type { ChangeEvent, HTMLAttributes, InputHTMLAttributes, KeyboardEvent, ReactNode } from "react";

import { createComponentClassName } from "../internal/component-class-name";
import { joinClassNames } from "../internal/join-class-names";
import "./radio.less";

export type RadioSize = "sm" | "md" | "lg";
export type RadioGroupOrientation = "horizontal" | "vertical";

type NativeRadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "size" | "type">;

export interface RadioProps extends NativeRadioProps {
  size?: RadioSize;
  invalid?: boolean;
  description?: ReactNode;
  errorText?: ReactNode;
  children?: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
}

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  value?: string;
  defaultValue?: string;
  name?: string;
  size?: RadioSize;
  orientation?: RadioGroupOrientation;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  errorText?: ReactNode;
  children?: ReactNode;
  onValueChange?: (value: string) => void;
}

interface RadioRegistryItem {
  input: HTMLInputElement;
  value: string;
}

interface RadioGroupContextValue {
  disabled: boolean;
  invalid: boolean;
  name: string;
  onValueChange: (value: string) => void;
  registerRadio: (value: string, input: HTMLInputElement) => () => void;
  required: boolean;
  size: RadioSize;
  value: string | undefined;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function isAriaInvalid(value: RadioProps["aria-invalid"]): boolean {
  return value === true || value === "true" || value === "grammar" || value === "spelling";
}

function mergeIds(...ids: Array<string | undefined>): string | undefined {
  const mergedIds = ids
    .flatMap((value) => value?.split(/\s+/) ?? [])
    .filter(Boolean);

  return mergedIds.length > 0 ? Array.from(new Set(mergedIds)).join(" ") : undefined;
}

function normalizeRadioValue(value: NativeRadioProps["value"]): string {
  return value == null ? "on" : String(value);
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    checked,
    children,
    className,
    defaultChecked,
    description,
    disabled,
    errorText,
    id,
    invalid = false,
    name,
    onChange,
    onCheckedChange,
    required,
    size,
    value,
    ...props
  },
  ref
) {
  const group = useContext(RadioGroupContext);
  const registerRadio = group?.registerRadio;
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-control`;
  const radioValue = normalizeRadioValue(value);
  const effectiveChecked = group ? group.value === radioValue : checked;
  const effectiveDisabled = Boolean(disabled) || Boolean(group?.disabled);
  const effectiveInvalid = invalid || isAriaInvalid(ariaInvalid) || Boolean(group?.invalid);
  const effectiveName = group?.name ?? name;
  const effectiveRequired = required ?? group?.required ?? false;
  const effectiveSize = size ?? group?.size ?? "md";
  const descriptionId = description ? `${inputId}-description` : undefined;
  const shouldRenderError = effectiveInvalid && Boolean(errorText);
  const errorId = shouldRenderError ? `${inputId}-error` : undefined;
  const describedBy = mergeIds(ariaDescribedBy, descriptionId, errorId);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  useEffect(() => {
    const input = inputRef.current;

    if (!registerRadio || !input) {
      return;
    }

    return registerRadio(radioValue, input);
  }, [radioValue, registerRadio]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);

    if (event.currentTarget.checked) {
      group?.onValueChange(radioValue);
    }

    onCheckedChange?.(event.currentTarget.checked);
  }

  return (
    <div
      className={joinClassNames("rui-radio", createComponentClassName("radio"), className)}
      data-checked={effectiveChecked ? "" : undefined}
      data-disabled={effectiveDisabled ? "" : undefined}
      data-invalid={effectiveInvalid ? "" : undefined}
      data-size={effectiveSize}
    >
      <span className={joinClassNames(createComponentClassName("radio", "control"), "rui-radio__control")}>
        <input
          {...props}
          ref={inputRef}
          aria-describedby={describedBy}
          aria-invalid={effectiveInvalid ? true : ariaInvalid}
          checked={effectiveChecked}
          className={joinClassNames(createComponentClassName("radio", "native"), "rui-radio__native")}
          defaultChecked={group ? undefined : defaultChecked}
          disabled={effectiveDisabled}
          id={inputId}
          name={effectiveName}
          onChange={handleChange}
          required={effectiveRequired}
          type="radio"
          value={radioValue}
        />
        <span aria-hidden="true" className={joinClassNames(createComponentClassName("radio", "circle"), "rui-radio__circle")}>
          <span className={joinClassNames(createComponentClassName("radio", "mark"), "rui-radio__mark")} />
        </span>
      </span>

      {children || description || shouldRenderError ? (
        <span className={joinClassNames(createComponentClassName("radio", "content"), "rui-radio__content")}>
          {children ? (
            <label className={joinClassNames(createComponentClassName("radio", "label"), "rui-radio__label")} htmlFor={inputId}>
              {children}
            </label>
          ) : null}

          {description ? (
            <span className={joinClassNames(createComponentClassName("radio", "description"), "rui-radio__description")} id={descriptionId}>
              {description}
            </span>
          ) : null}

          {shouldRenderError ? (
            <span className={joinClassNames(createComponentClassName("radio", "error"), "rui-radio__error")} id={errorId} role="alert">
              {errorText}
            </span>
          ) : null}
        </span>
      ) : null}
    </div>
  );
});

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-labelledby": ariaLabelledBy,
    children,
    className,
    defaultValue,
    disabled = false,
    errorText,
    id,
    invalid = false,
    name,
    onKeyDown,
    onValueChange,
    orientation = "vertical",
    required = false,
    size = "md",
    value,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const groupId = id ?? `${generatedId}-group`;
  const groupName = name ?? `${groupId}-name`;
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const currentValue = isControlled ? value : uncontrolledValue;
  const radioItemsRef = useRef<RadioRegistryItem[]>([]);
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true" || ariaInvalid === "grammar" || ariaInvalid === "spelling";
  const shouldRenderError = isInvalid && Boolean(errorText);
  const errorId = shouldRenderError ? `${groupId}-error` : undefined;
  const describedBy = mergeIds(ariaDescribedBy, errorId);

  const registerRadio = useCallback((radioValue: string, input: HTMLInputElement) => {
    const item: RadioRegistryItem = { input, value: radioValue };
    radioItemsRef.current = [...radioItemsRef.current, item];

    return () => {
      radioItemsRef.current = radioItemsRef.current.filter((registeredItem) => registeredItem !== item);
    };
  }, []);

  const setGroupValue = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange]
  );

  const contextValue = useMemo<RadioGroupContextValue>(
    () => ({
      disabled,
      invalid: isInvalid,
      name: groupName,
      onValueChange: setGroupValue,
      registerRadio,
      required,
      size,
      value: currentValue
    }),
    [currentValue, disabled, groupName, isInvalid, registerRadio, required, setGroupValue, size]
  );

  function getOrderedEnabledRadios(): RadioRegistryItem[] {
    return radioItemsRef.current
      .filter(({ input }) => input.isConnected && !input.disabled)
      .sort((a, b) => {
        if (a.input.compareDocumentPosition(b.input) & Node.DOCUMENT_POSITION_PRECEDING) {
          return 1;
        }

        return -1;
      });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const keyToDirection: Record<string, number | undefined> = {
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -1
    };
    const direction = keyToDirection[event.key];
    const isHomeKey = event.key === "Home";
    const isEndKey = event.key === "End";

    if (direction === undefined && !isHomeKey && !isEndKey) {
      return;
    }

    const enabledRadios = getOrderedEnabledRadios();

    if (enabledRadios.length === 0) {
      return;
    }

    event.preventDefault();

    const activeElement = document.activeElement;
    const activeIndex = enabledRadios.findIndex(({ input, value: radioValue }) => input === activeElement || radioValue === currentValue);
    let nextIndex = 0;

    if (isHomeKey) {
      nextIndex = 0;
    } else if (isEndKey) {
      nextIndex = enabledRadios.length - 1;
    } else if (direction !== undefined) {
      const currentIndex = activeIndex >= 0 ? activeIndex : direction === -1 ? enabledRadios.length - 1 : 0;
      nextIndex = (currentIndex + direction + enabledRadios.length) % enabledRadios.length;
    }

    const nextRadio = enabledRadios[nextIndex];

    nextRadio.input.focus();

    if (!nextRadio.input.checked) {
      nextRadio.input.click();
    }
  }

  return (
    <div
      {...props}
      ref={ref}
      aria-describedby={describedBy}
      aria-invalid={isInvalid ? true : ariaInvalid}
      aria-labelledby={ariaLabelledBy}
      aria-orientation={orientation}
      aria-required={required ? true : undefined}
      className={joinClassNames("rui-radio-group", createComponentClassName("radioGroup"), className)}
      data-disabled={disabled ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      data-orientation={orientation}
      data-size={size}
      id={groupId}
      onKeyDown={handleKeyDown}
      role="radiogroup"
    >
      <RadioGroupContext.Provider value={contextValue}>
        <div className={joinClassNames(createComponentClassName("radioGroup", "items"), "rui-radio-group__items")}>{children}</div>
      </RadioGroupContext.Provider>

      {shouldRenderError ? (
        <div className={joinClassNames(createComponentClassName("radioGroup", "error"), "rui-radio-group__error")} id={errorId} role="alert">
          {errorText}
        </div>
      ) : null}
    </div>
  );
});
