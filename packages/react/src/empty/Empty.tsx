import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";

import { createComponentClassName } from "../internal/component-class-name";
import { joinClassNames } from "../internal/join-class-names";
import "./empty.less";

export type EmptySize = "sm" | "md" | "lg";

export interface EmptyProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  size?: EmptySize;
}

function hasRenderableNode(node: ReactNode): boolean {
  return node !== undefined && node !== null && typeof node !== "boolean";
}

const defaultIcon = (
  <span className={joinClassNames(createComponentClassName("empty", "default-icon"), "rui-empty__default-icon")}>
    <span className={joinClassNames(createComponentClassName("empty", "default-line"), "rui-empty__default-line")} />
    <span className={joinClassNames(createComponentClassName("empty", "default-line"), "rui-empty__default-line")} />
    <span className={joinClassNames(createComponentClassName("empty", "default-line"), "rui-empty__default-line")} />
  </span>
);

export const Empty = forwardRef<HTMLDivElement, EmptyProps>(function Empty(
  { actions, className, description, icon, size = "md", title, ...props },
  ref
) {
  const renderedIcon = icon === undefined ? defaultIcon : icon;
  const hasIcon = hasRenderableNode(renderedIcon);
  const hasDescription = hasRenderableNode(description);
  const hasActions = hasRenderableNode(actions);

  return (
    <div
      {...props}
      ref={ref}
      className={joinClassNames("rui-empty", createComponentClassName("empty"), className)}
      data-has-actions={hasActions ? "" : undefined}
      data-has-icon={hasIcon ? "" : undefined}
      data-size={size}
    >
      {hasIcon ? (
        <div aria-hidden="true" className={joinClassNames(createComponentClassName("empty", "icon"), "rui-empty__icon")}>
          {renderedIcon}
        </div>
      ) : null}

      <div className={joinClassNames(createComponentClassName("empty", "body"), "rui-empty__body")}>
        <div className={joinClassNames(createComponentClassName("empty", "title"), "rui-empty__title")}>{title}</div>
        {hasDescription ? (
          <div className={joinClassNames(createComponentClassName("empty", "description"), "rui-empty__description")}>{description}</div>
        ) : null}
      </div>

      {hasActions ? <div className={joinClassNames(createComponentClassName("empty", "actions"), "rui-empty__actions")}>{actions}</div> : null}
    </div>
  );
});
