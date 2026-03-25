import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { createComponentClassName } from "../internal/component-class-name";
import "./button.less";

export type ButtonVariant = "solid" | "outline" | "ghost" | "subtle";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

function joinClassNames(...values: Array<string | undefined | false>): string {
  return values.filter(Boolean).join(" ");
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    disabled = false,
    endIcon,
    loading = false,
    loadingText,
    startIcon,
    type = "button",
    variant = "solid",
    size = "md",
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;
  const label = loading && loadingText ? loadingText : children;

  return (
    <button
      {...props}
      ref={ref}
      aria-busy={loading || undefined}
      className={joinClassNames("rui-button", createComponentClassName("button"), className)}
      data-disabled={isDisabled ? "" : undefined}
      data-loading={loading ? "" : undefined}
      data-size={size}
      data-variant={variant}
      disabled={isDisabled}
      type={type}
    >
      {loading ? (
        <span aria-hidden="true" className={createComponentClassName("button", "spinner")}>
          <span className="rui-button__spinner" />
        </span>
      ) : startIcon ? (
        <span aria-hidden="true" className={joinClassNames(createComponentClassName("button", "icon"), "rui-button__icon")}>
          {startIcon}
        </span>
      ) : null}

      <span className={createComponentClassName("button", "label")}>{label}</span>

      {!loading && endIcon ? (
        <span aria-hidden="true" className={joinClassNames(createComponentClassName("button", "icon"), "rui-button__icon")}>
          {endIcon}
        </span>
      ) : null}
    </button>
  );
});
