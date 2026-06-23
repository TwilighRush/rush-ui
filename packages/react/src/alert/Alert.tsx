import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";

import { createComponentClassName } from "../internal/component-class-name";
import { joinClassNames } from "../internal/join-class-names";
import "./alert.less";

export type AlertVariant = "default" | "success" | "warning" | "error" | "info";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: AlertVariant;
  title?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
}

const defaultAlertIcons: Record<AlertVariant, ReactNode> = {
  default: "i",
  success: "✓",
  warning: "!",
  error: "!",
  info: "i"
};

function hasRenderableNode(node: ReactNode): boolean {
  return node !== undefined && node !== null && typeof node !== "boolean";
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { actions, children, className, icon, role, title, variant = "info", ...props },
  ref
) {
  const renderedIcon = icon === undefined ? defaultAlertIcons[variant] : icon;
  const hasIcon = hasRenderableNode(renderedIcon);
  const hasTitle = hasRenderableNode(title);
  const hasContent = hasRenderableNode(children);
  const hasActions = hasRenderableNode(actions);
  const alertRole = role ?? (variant === "error" ? "alert" : "status");

  return (
    <div
      {...props}
      ref={ref}
      className={joinClassNames("rui-alert", createComponentClassName("alert"), className)}
      data-has-icon={hasIcon ? "" : undefined}
      data-variant={variant}
      role={alertRole}
    >
      {hasIcon ? (
        <span aria-hidden="true" className={joinClassNames(createComponentClassName("alert", "icon"), "rui-alert__icon")}>
          {renderedIcon}
        </span>
      ) : null}

      <div className={joinClassNames(createComponentClassName("alert", "body"), "rui-alert__body")}>
        {hasTitle ? <div className={joinClassNames(createComponentClassName("alert", "title"), "rui-alert__title")}>{title}</div> : null}
        {hasContent ? (
          <div className={joinClassNames(createComponentClassName("alert", "content"), "rui-alert__content")}>{children}</div>
        ) : null}
      </div>

      {hasActions ? <div className={joinClassNames(createComponentClassName("alert", "actions"), "rui-alert__actions")}>{actions}</div> : null}
    </div>
  );
});
