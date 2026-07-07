import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";

import { createComponentClassName } from "../internal/component-class-name";
import { joinClassNames } from "../internal/join-class-names";
import "./spinner.less";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  label?: ReactNode;
}

function hasRenderableNode(node: ReactNode): boolean {
  return node !== undefined && node !== null && typeof node !== "boolean";
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { "aria-hidden": ariaHidden, "aria-label": ariaLabel, className, label, role = "status", size = "md", ...props },
  ref
) {
  const isDecorative = ariaHidden === true || ariaHidden === "true";
  const hasLabel = hasRenderableNode(label);

  return (
    <span
      {...props}
      aria-hidden={ariaHidden}
      aria-label={isDecorative ? undefined : ariaLabel ?? (hasLabel ? undefined : "加载中")}
      className={joinClassNames("rui-spinner", createComponentClassName("spinner"), className)}
      data-size={size}
      ref={ref}
      role={isDecorative ? undefined : role}
    >
      <span
        aria-hidden="true"
        className={joinClassNames(createComponentClassName("spinner", "indicator"), "rui-spinner__indicator")}
      />
      {hasLabel ? (
        <span className={joinClassNames(createComponentClassName("spinner", "label"), "rui-spinner__label")}>{label}</span>
      ) : null}
    </span>
  );
});
