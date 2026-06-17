import { forwardRef, useEffect, useId, useImperativeHandle, useRef } from "react";
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";

import { createComponentClassName } from "../internal/component-class-name";
import { joinClassNames } from "../internal/join-class-names";
import "./checkbox.less";

export type CheckboxSize = "sm" | "md" | "lg";

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

function isAriaInvalid(value: CheckboxProps["aria-invalid"]): boolean {
  return value === true || value === "true" || value === "grammar" || value === "spelling";
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    "aria-checked": ariaChecked,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    children,
    className,
    description,
    disabled = false,
    errorText,
    id,
    indeterminate = false,
    invalid = false,
    onChange,
    onCheckedChange,
    size = "md",
    ...props
  },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-control`;
  const isInvalid = invalid || isAriaInvalid(ariaInvalid);
  const descriptionId = description ? `${inputId}-description` : undefined;
  const shouldRenderError = isInvalid && Boolean(errorText);
  const errorId = shouldRenderError ? `${inputId}-error` : undefined;
  const describedBy = [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
    onCheckedChange?.(event.currentTarget.checked);
  }

  return (
    <div
      className={joinClassNames("rui-checkbox", createComponentClassName("checkbox"), className)}
      data-disabled={disabled ? "" : undefined}
      data-indeterminate={indeterminate ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      data-size={size}
    >
      <span className={joinClassNames(createComponentClassName("checkbox", "control"), "rui-checkbox__control")}>
        <input
          {...props}
          ref={inputRef}
          aria-checked={indeterminate ? "mixed" : ariaChecked}
          aria-describedby={describedBy}
          aria-invalid={invalid ? true : ariaInvalid}
          className={joinClassNames(createComponentClassName("checkbox", "native"), "rui-checkbox__native")}
          disabled={disabled}
          id={inputId}
          onChange={handleChange}
          type="checkbox"
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
