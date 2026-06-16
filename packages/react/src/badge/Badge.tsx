import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

import { createComponentClassName } from "../internal/component-class-name";
import { joinClassNames } from "../internal/join-class-names";
import "./badge.less";

export type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "processing";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { children, className, variant = "default", size = "md", ...props },
  ref
) {
  return (
    <span
      {...props}
      ref={ref}
      className={joinClassNames("rui-badge", createComponentClassName("badge"), className)}
      data-size={size}
      data-variant={variant}
    >
      <span aria-hidden="true" className={joinClassNames(createComponentClassName("badge", "indicator"), "rui-badge__indicator")} />
      <span className={joinClassNames(createComponentClassName("badge", "label"), "rui-badge__label")}>{children}</span>
    </span>
  );
});
