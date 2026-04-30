import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import type { ButtonSize, ButtonVariant } from "../button";
import { createComponentClassName } from "../internal/component-class-name";
import { joinClassNames } from "../internal/join-class-names";
import "./icon-button.less";

export type IconButtonVariant = ButtonVariant;
export type IconButtonSize = ButtonSize;

type IconButtonAccessibleName =
  | {
      "aria-label": string;
      "aria-labelledby"?: string;
    }
  | {
      "aria-label"?: string;
      "aria-labelledby": string;
    };

type NativeIconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "aria-labelledby" | "children">;

export type IconButtonProps = NativeIconButtonProps &
  IconButtonAccessibleName & {
    icon: ReactNode;
    variant?: IconButtonVariant;
    size?: IconButtonSize;
    loading?: boolean;
  };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, disabled = false, icon, loading = false, type = "button", variant = "ghost", size = "md", ...props },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      ref={ref}
      aria-busy={loading || undefined}
      className={joinClassNames("rui-icon-button", createComponentClassName("icon-button"), className)}
      data-disabled={isDisabled ? "" : undefined}
      data-loading={loading ? "" : undefined}
      data-size={size}
      data-variant={variant}
      disabled={isDisabled}
      type={type}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className={joinClassNames(createComponentClassName("icon-button", "spinner"), "rui-icon-button__spinner")}
        />
      ) : (
        <span aria-hidden="true" className={joinClassNames(createComponentClassName("icon-button", "icon"), "rui-icon-button__icon")}>
          {icon}
        </span>
      )}
    </button>
  );
});
