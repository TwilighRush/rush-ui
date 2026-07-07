import { forwardRef } from "react";
import type { CSSProperties, HTMLAttributes } from "react";

import { createComponentClassName } from "../internal/component-class-name";
import { joinClassNames } from "../internal/join-class-names";
import "./skeleton.less";

export type SkeletonVariant = "text" | "block" | "circle";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  lines?: number;
  animated?: boolean;
}

function normalizeLines(lines: number | undefined): number {
  if (lines === undefined) return 1;
  if (!Number.isFinite(lines)) return 1;
  return Math.max(1, Math.floor(lines));
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  {
    "aria-hidden": ariaHidden = true,
    animated = true,
    className,
    height,
    lines,
    style,
    variant = "block",
    width,
    ...props
  },
  ref
) {
  const lineCount = normalizeLines(lines);
  const hasLines = variant === "text" && lineCount > 1;
  const sizeStyle: CSSProperties = {
    ...style,
    ...(width !== undefined ? { width } : null),
    ...(height !== undefined ? { height } : null)
  };

  return (
    <div
      {...props}
      aria-hidden={ariaHidden}
      className={joinClassNames("rui-skeleton", createComponentClassName("skeleton"), className)}
      data-animated={animated ? "" : undefined}
      data-has-lines={hasLines ? "" : undefined}
      data-lines={hasLines ? lineCount : undefined}
      data-variant={variant}
      ref={ref}
      style={sizeStyle}
    >
      {hasLines
        ? Array.from({ length: lineCount }, (_, index) => (
            <span
              className={joinClassNames(createComponentClassName("skeleton", "line"), "rui-skeleton__line")}
              key={index}
            />
          ))
        : null}
    </div>
  );
});
