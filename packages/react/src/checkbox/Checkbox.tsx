import { createContext, forwardRef, useCallback, useContext, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from "react";
import type { ChangeEvent, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

import { createComponentClassName } from "../internal/component-class-name";
import { joinClassNames } from "../internal/join-class-names";
import "./checkbox.less";

export type CheckboxSize = "sm" | "md" | "lg";
export type CheckboxGroupOrientation = "horizontal" | "vertical";

type NativeCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "size" | "type">;

export interface CheckboxProps extends NativeCheckboxProps {
  size?: CheckboxSize;
  invalid?: boolean;
  indeterminate?: boolean;
  description?: ReactNode;
  errorText?: ReactNode;
  children?: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
}

export interface CheckboxGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  value?: string[];
  defaultValue?: string[];
  name?: string;
  size?: CheckboxSize;
  orientation?: CheckboxGroupOrientation;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  errorText?: ReactNode;
  children?: ReactNode;
  onValueChange?: (value: string[]) => void;
}

interface CheckboxGroupContextValue {
  disabled: boolean;
  invalid: boolean;
  name: string;
  onValueChange: (value: string, checked: boolean) => void;
  size: CheckboxSize;
  value: string[];
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

function isAriaInvalid(value: CheckboxProps["aria-invalid"]): boolean {
  return value === true || value === "true" || value === "grammar" || value === "spelling";
}

function mergeIds(...ids: Array<string | undefined>): string | undefined {
  const mergedIds = ids
    .flatMap((value) => value?.split(/\s+/) ?? [])
    .filter(Boolean);

  return mergedIds.length > 0 ? Array.from(new Set(mergedIds)).join(" ") : undefined;
}

function normalizeCheckboxValue(value: NativeCheckboxProps["value"]): string {
  return value == null ? "on" : String(value);
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    "aria-checked": ariaChecked,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    checked,
    children,
    className,
    defaultChecked,
    description,
    disabled = false,
    errorText,
    id,
    indeterminate = false,
    invalid = false,
    name,
    onChange,
    onCheckedChange,
    required,
    size = "md",
    value,
    ...props
  },
  ref
) {
  const group = useContext(CheckboxGroupContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-control`;
  const checkboxValue = normalizeCheckboxValue(value);
  const effectiveChecked = group ? group.value.includes(checkboxValue) : checked;
  const effectiveDisabled = disabled || Boolean(group?.disabled);
  const effectiveInvalid = invalid || isAriaInvalid(ariaInvalid) || Boolean(group?.invalid);
  const effectiveName = group?.name ?? name;
  const effectiveSize = group?.size ?? size;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const shouldRenderError = effectiveInvalid && Boolean(errorText);
  const errorId = shouldRenderError ? `${inputId}-error` : undefined;
  const describedBy = mergeIds(ariaDescribedBy, descriptionId, errorId);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
    group?.onValueChange(checkboxValue, event.currentTarget.checked);
    onCheckedChange?.(event.currentTarget.checked);
  }

  return (
    <div
      className={joinClassNames("rui-checkbox", createComponentClassName("checkbox"), className)}
      data-disabled={effectiveDisabled ? "" : undefined}
      data-indeterminate={indeterminate ? "" : undefined}
      data-invalid={effectiveInvalid ? "" : undefined}
      data-size={effectiveSize}
    >
      <span className={joinClassNames(createComponentClassName("checkbox", "control"), "rui-checkbox__control")}>
        <input
          {...props}
          ref={inputRef}
          aria-checked={indeterminate ? "mixed" : ariaChecked}
          aria-describedby={describedBy}
          aria-invalid={effectiveInvalid ? true : ariaInvalid}
          checked={effectiveChecked}
          className={joinClassNames(createComponentClassName("checkbox", "native"), "rui-checkbox__native")}
          defaultChecked={group ? undefined : defaultChecked}
          disabled={effectiveDisabled}
          id={inputId}
          name={effectiveName}
          onChange={handleChange}
          required={required}
          type="checkbox"
          value={checkboxValue}
        />
        <span aria-hidden="true" className={joinClassNames(createComponentClassName("checkbox", "box"), "rui-checkbox__box")}>
          <span className={joinClassNames(createComponentClassName("checkbox", "mark"), "rui-checkbox__mark")} />
        </span>
      </span>

      {children || description || shouldRenderError ? (
        <span className={joinClassNames(createComponentClassName("checkbox", "content"), "rui-checkbox__content")}>
          {children ? (
            <label className={joinClassNames(createComponentClassName("checkbox", "label"), "rui-checkbox__label")} htmlFor={inputId}>
              {children}
            </label>
          ) : null}

          {description ? (
            <span
              className={joinClassNames(createComponentClassName("checkbox", "description"), "rui-checkbox__description")}
              id={descriptionId}
            >
              {description}
            </span>
          ) : null}

          {shouldRenderError ? (
            <span className={joinClassNames(createComponentClassName("checkbox", "error"), "rui-checkbox__error")} id={errorId} role="alert">
              {errorText}
            </span>
          ) : null}
        </span>
      ) : null}
    </div>
  );
});

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-labelledby": ariaLabelledBy,
    children,
    className,
    defaultValue = [],
    disabled = false,
    errorText,
    id,
    invalid = false,
    name,
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
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true" || ariaInvalid === "grammar" || ariaInvalid === "spelling";
  const shouldRenderError = isInvalid && Boolean(errorText);
  const errorId = shouldRenderError ? `${groupId}-error` : undefined;
  const requiredId = required ? `${groupId}-required` : undefined;
  const describedBy = mergeIds(ariaDescribedBy, requiredId, errorId);

  const setGroupValue = useCallback(
    (checkboxValue: string, checked: boolean) => {
      const valueSet = new Set(currentValue);

      if (checked) {
        valueSet.add(checkboxValue);
      } else {
        valueSet.delete(checkboxValue);
      }

      const nextValue = currentValue.filter((item) => valueSet.has(item));

      if (checked && !currentValue.includes(checkboxValue)) {
        nextValue.push(checkboxValue);
      }

      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [currentValue, isControlled, onValueChange]
  );

  const contextValue = useMemo<CheckboxGroupContextValue>(
    () => ({
      disabled,
      invalid: isInvalid,
      name: groupName,
      onValueChange: setGroupValue,
      size,
      value: currentValue
    }),
    [currentValue, disabled, groupName, isInvalid, setGroupValue, size]
  );

  return (
    <div
      {...props}
      ref={ref}
      aria-describedby={describedBy}
      aria-invalid={isInvalid ? true : ariaInvalid}
      aria-labelledby={ariaLabelledBy}
      className={joinClassNames("rui-checkbox-group", createComponentClassName("checkboxGroup"), className)}
      data-disabled={disabled ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      data-orientation={orientation}
      data-required={required ? "" : undefined}
      data-size={size}
      id={groupId}
      role="group"
    >
      <CheckboxGroupContext.Provider value={contextValue}>
        <div className={joinClassNames(createComponentClassName("checkboxGroup", "items"), "rui-checkbox-group__items")}>{children}</div>
      </CheckboxGroupContext.Provider>

      {required ? (
        <span
          className={joinClassNames(createComponentClassName("checkboxGroup", "requiredText"), "rui-checkbox-group__required-text")}
          id={requiredId}
        >
          必填
        </span>
      ) : null}

      {shouldRenderError ? (
        <div
          className={joinClassNames(createComponentClassName("checkboxGroup", "error"), "rui-checkbox-group__error")}
          id={errorId}
          role="alert"
        >
          {errorText}
        </div>
      ) : null}
    </div>
  );
});
