import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

import { createComponentClassName } from "../internal/component-class-name";
import { joinClassNames } from "../internal/join-class-names";
import "./switch.less";

export type SwitchSize = "sm" | "md" | "lg";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "children" | "size" | "type"> {
  children?: ReactNode;
  size?: SwitchSize;
  description?: ReactNode;
  invalid?: boolean;
  errorText?: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
}

function mergeIds(...ids: Array<string | undefined>) {
  const value = ids.filter(Boolean).join(" ");
  return value || undefined;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    children,
    className,
    description,
    disabled = false,
    errorText,
    id: idProp,
    invalid = false,
    onChange,
    onCheckedChange,
    size = "md",
    ...props
  },
  ref
) {
  const generatedId = useId();
  const id = idProp ?? `${generatedId}-input`;
  const descriptionId = description ? `${generatedId}-description` : undefined;
  const errorId = invalid && errorText ? `${generatedId}-error` : undefined;

  return (
    <span
      className={joinClassNames("rui-switch", createComponentClassName("switch"), className)}
      data-disabled={disabled ? "" : undefined}
      data-invalid={invalid ? "" : undefined}
      data-size={size}
    >
      <span className="rui-switch__control">
        <input
          {...props}
          ref={ref}
          aria-describedby={mergeIds(ariaDescribedBy, descriptionId, errorId)}
          aria-invalid={ariaInvalid ?? (invalid || undefined)}
          className={joinClassNames("rui-switch__input", createComponentClassName("switch", "input"))}
          disabled={disabled}
          id={id}
          onChange={(event) => {
            onChange?.(event);
            onCheckedChange?.(event.currentTarget.checked);
          }}
          role="switch"
          type="checkbox"
        />
        <span aria-hidden="true" className={joinClassNames("rui-switch__track", createComponentClassName("switch", "track"))}>
          <span className={joinClassNames("rui-switch__thumb", createComponentClassName("switch", "thumb"))} />
        </span>
      </span>
      {children ? <label className="rui-switch__label" htmlFor={id}>{children}</label> : null}
      {description || errorId ? (
        <span className="rui-switch__content">
          {description ? <span className="rui-switch__description" id={descriptionId}>{description}</span> : null}
          {errorId ? <span className="rui-switch__error" id={errorId}>{errorText}</span> : null}
        </span>
      ) : null}
    </span>
  );
});
