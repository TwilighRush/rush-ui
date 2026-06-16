import { forwardRef, useId, useImperativeHandle, useRef, useState } from "react";
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";

import { createComponentClassName } from "../internal/component-class-name";
import { joinClassNames } from "../internal/join-class-names";
import "./input.less";

export type InputSize = "sm" | "md" | "lg";

type NativeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "prefix" | "size">;

export interface InputProps extends NativeInputProps {
  size?: InputSize;
  invalid?: boolean;
  errorText?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  startAddon?: ReactNode;
  endAddon?: ReactNode;
  allowClear?: boolean;
  clearAriaLabel?: string;
  showCount?: boolean;
  onClear?: () => void;
  onValueChange?: (value: string) => void;
}

function getInputValueText(value: NativeInputProps["value"] | NativeInputProps["defaultValue"]): string {
  if (Array.isArray(value)) {
    return value.join("");
  }

  return value == null ? "" : String(value);
}

function setInputElementValue(input: HTMLInputElement, value: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(input, "value")?.set;
  const prototype = Object.getPrototypeOf(input) as HTMLInputElement;
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;

  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(input, value);
    return;
  }

  if (valueSetter) {
    valueSetter.call(input, value);
    return;
  }

  input.value = value;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    allowClear = false,
    className,
    clearAriaLabel = "清空输入",
    defaultValue,
    disabled = false,
    endAddon,
    errorText,
    id,
    invalid = false,
    maxLength,
    onChange,
    onClear,
    onValueChange,
    prefix,
    readOnly = false,
    showCount = false,
    size = "md",
    startAddon,
    suffix,
    type = "text",
    value,
    ...props
  },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isDispatchingClearRef = useRef(false);
  const didDispatchClearChangeRef = useRef(false);
  const generatedId = useId();
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() => getInputValueText(defaultValue));
  const currentValue = isControlled ? getInputValueText(value) : uncontrolledValue;
  const valueLength = Array.from(currentValue).length;
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true" || ariaInvalid === "grammar" || ariaInvalid === "spelling";
  const shouldRenderError = isInvalid && Boolean(errorText);
  const errorId = shouldRenderError ? `${id ?? generatedId}-error` : undefined;
  const countId = showCount ? `${id ?? generatedId}-count` : undefined;
  const describedBy = [ariaDescribedBy, errorId, countId].filter(Boolean).join(" ") || undefined;
  const shouldRenderClear = allowClear && valueLength > 0 && !disabled && !readOnly;
  const countText = typeof maxLength === "number" && maxLength >= 0 ? `${valueLength} / ${maxLength}` : String(valueLength);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (isDispatchingClearRef.current) {
      didDispatchClearChangeRef.current = true;
    }

    if (!isControlled) {
      setUncontrolledValue(event.currentTarget.value);
    }

    onChange?.(event);
    onValueChange?.(event.currentTarget.value);
  }

  function handleClear() {
    if (disabled || readOnly) {
      return;
    }

    const input = inputRef.current;

    if (!input) {
      onValueChange?.("");
      onClear?.();
      return;
    }

    isDispatchingClearRef.current = true;
    didDispatchClearChangeRef.current = false;
    setInputElementValue(input, "");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    isDispatchingClearRef.current = false;

    if (!didDispatchClearChangeRef.current) {
      if (!isControlled) {
        setUncontrolledValue("");
      }

      onValueChange?.("");
    }

    onClear?.();
    input.focus();
  }

  return (
    <div
      className={joinClassNames("rui-input", createComponentClassName("input"), className)}
      data-allow-clear={allowClear ? "" : undefined}
      data-clearable={shouldRenderClear ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-show-count={showCount ? "" : undefined}
      data-size={size}
    >
      <span className={joinClassNames(createComponentClassName("input", "control"), "rui-input__control")}>
        {startAddon ? (
          <span className={joinClassNames(createComponentClassName("input", "addon"), "rui-input__addon")}>
            {startAddon}
          </span>
        ) : null}

        {prefix ? (
          <span aria-hidden="true" className={joinClassNames(createComponentClassName("input", "prefix"), "rui-input__icon")}>
            {prefix}
          </span>
        ) : null}

        <input
          {...props}
          ref={inputRef}
          aria-describedby={describedBy}
          aria-invalid={invalid ? true : ariaInvalid}
          className={joinClassNames(createComponentClassName("input", "native"), "rui-input__native")}
          defaultValue={defaultValue}
          disabled={disabled}
          id={id}
          maxLength={maxLength}
          onChange={handleChange}
          readOnly={readOnly}
          type={type}
          value={value}
        />

        {suffix ? (
          <span aria-hidden="true" className={joinClassNames(createComponentClassName("input", "suffix"), "rui-input__icon")}>
            {suffix}
          </span>
        ) : null}

        {allowClear ? (
          <button
            aria-hidden={shouldRenderClear ? undefined : true}
            aria-label={clearAriaLabel}
            className={joinClassNames(createComponentClassName("input", "clear"), "rui-input__clear")}
            data-hidden={shouldRenderClear ? undefined : ""}
            disabled={!shouldRenderClear}
            onClick={handleClear}
            tabIndex={shouldRenderClear ? undefined : -1}
            type="button"
          >
            ×
          </button>
        ) : null}

        {endAddon ? (
          <span className={joinClassNames(createComponentClassName("input", "addon"), "rui-input__addon")}>
            {endAddon}
          </span>
        ) : null}
      </span>

      {shouldRenderError || showCount ? (
        <div className={joinClassNames(createComponentClassName("input", "meta"), "rui-input__meta")}>
          {shouldRenderError ? (
            <div className={joinClassNames(createComponentClassName("input", "error"), "rui-input__error")} id={errorId} role="alert">
              {errorText}
            </div>
          ) : null}

          {showCount ? (
            <div className={joinClassNames(createComponentClassName("input", "count"), "rui-input__count")} id={countId}>
              {countText}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});
