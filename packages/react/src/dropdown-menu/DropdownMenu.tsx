/* eslint-disable react-refresh/only-export-components */
import { createContext, forwardRef, useContext, useEffect, useId, useMemo, useRef } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, KeyboardEvent, ReactNode, RefObject } from "react";

import { Button } from "../button/Button";
import type { ButtonProps } from "../button/Button";
import { Portal } from "../internal/Portal";
import { createComponentClassName } from "../internal/component-class-name";
import { focusRelativeTo } from "../internal/focus";
import { joinClassNames } from "../internal/join-class-names";
import { useModalBranch } from "../internal/modal-layer";
import { useAnchoredPosition } from "../internal/use-anchored-position";
import type { FloatingAlign, FloatingSide } from "../internal/use-anchored-position";
import { useControllableState } from "../internal/use-controllable-state";
import { useDismissableLayer } from "../internal/use-dismissable-layer";
import { useMergedRefs } from "../internal/use-merged-refs";
import "./dropdown-menu.less";

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  triggerId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  focusOnOpenRef: RefObject<"first" | "last">;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext(component: string) {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error(`${component} 必须在 DropdownMenu.Root 内使用。`);
  return context;
}

function getItems(content: HTMLElement | null) {
  return Array.from(content?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
}

function getItemText(item: HTMLButtonElement) {
  return (item.dataset.textValue ?? item.textContent ?? "").trim().toLocaleLowerCase();
}

export interface DropdownMenuRootProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DropdownMenuRoot = ({ children, defaultOpen = false, onOpenChange, open: openProp }: DropdownMenuRootProps) => {
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const focusOnOpenRef = useRef<"first" | "last">("first");

  return (
    <DropdownMenuContext.Provider
      value={{ open, setOpen, contentId: `${id}-content`, triggerId: `${id}-trigger`, triggerRef, contentRef, focusOnOpenRef }}
    >
      {children}
    </DropdownMenuContext.Provider>
  );
};

export type DropdownMenuTriggerProps = ButtonProps;

const DropdownMenuTrigger = forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(function DropdownMenuTrigger(
  { className, onClick, onKeyDown, variant = "outline", ...props },
  ref
) {
  const context = useDropdownMenuContext("DropdownMenu.Trigger");
  const mergedRef = useMergedRefs(ref, context.triggerRef);
  return (
    <Button
      {...props}
      ref={mergedRef}
      aria-controls={context.contentId}
      aria-expanded={context.open}
      aria-haspopup="menu"
      className={joinClassNames("rui-dropdown-menu__trigger", createComponentClassName("dropdownMenu", "trigger"), className)}
      id={context.triggerId}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          context.focusOnOpenRef.current = "first";
          context.setOpen(!context.open);
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          context.focusOnOpenRef.current = event.key === "ArrowUp" ? "last" : "first";
          context.setOpen(true);
        }
      }}
      variant={variant}
    />
  );
});

export interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: FloatingAlign;
  side?: FloatingSide;
  sideOffset?: number;
}

const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(function DropdownMenuContent(
  {
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    align = "end",
    children,
    className,
    onKeyDown,
    side = "bottom",
    sideOffset = 6,
    ...props
  },
  ref
) {
  const context = useDropdownMenuContext("DropdownMenu.Content");
  const mergedRef = useMergedRefs(ref, context.contentRef);
  const layerRefs = useMemo(() => [context.triggerRef, context.contentRef], [context.contentRef, context.triggerRef]);
  const typeaheadRef = useRef("");
  const typeaheadTimerRef = useRef<number | null>(null);
  const ownerDocument = context.triggerRef.current?.ownerDocument;
  const position = useAnchoredPosition({
    open: context.open,
    triggerRef: context.triggerRef,
    contentRef: context.contentRef,
    align,
    side,
    gap: sideOffset
  });
  const modalBranchZIndex = useModalBranch(context.contentRef, context.open);

  useDismissableLayer({
    open: context.open,
    refs: layerRefs,
    onDismiss: () => context.setOpen(false),
    onEscapeKeyDown: () => context.triggerRef.current?.focus()
  });

  useEffect(() => {
    if (!context.open) return;
    const content = context.contentRef.current;
    const ownerWindow = content?.ownerDocument.defaultView ?? window;
    const frame = ownerWindow.requestAnimationFrame(() => {
      const items = getItems(content);
      const item = context.focusOnOpenRef.current === "last" ? items.at(-1) : items[0];
      (item ?? content)?.focus();
    });
    return () => {
      ownerWindow.cancelAnimationFrame(frame);
      if (typeaheadTimerRef.current !== null) ownerWindow.clearTimeout(typeaheadTimerRef.current);
      typeaheadRef.current = "";
    };
  }, [context.contentRef, context.focusOnOpenRef, context.open]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const content = context.contentRef.current;
    const trigger = context.triggerRef.current;
    if (!content || !trigger) return;
    const items = getItems(content);
    const currentIndex = items.indexOf(content.ownerDocument.activeElement as HTMLButtonElement);
    let nextIndex = currentIndex;

    if (event.key === "ArrowDown") nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
    else if (event.key === "ArrowUp") nextIndex = currentIndex < 0 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = items.length - 1;
    else if (event.key === "Tab") {
      event.preventDefault();
      context.setOpen(false);
      content.ownerDocument.defaultView?.requestAnimationFrame(() =>
        focusRelativeTo(trigger, event.shiftKey ? "previous" : "next", content)
      );
      return;
    } else if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      const ownerWindow = content.ownerDocument.defaultView ?? window;
      typeaheadRef.current += event.key.toLocaleLowerCase();
      if (typeaheadTimerRef.current !== null) ownerWindow.clearTimeout(typeaheadTimerRef.current);
      typeaheadTimerRef.current = ownerWindow.setTimeout(() => {
        typeaheadRef.current = "";
        typeaheadTimerRef.current = null;
      }, 700);
      const ordered = items.slice(currentIndex + 1).concat(items.slice(0, currentIndex + 1));
      const match = ordered.find((item) => getItemText(item).startsWith(typeaheadRef.current));
      if (match) {
        event.preventDefault();
        match.focus();
      }
      return;
    } else return;

    event.preventDefault();
    if (items.length === 0) content.focus();
    else items[nextIndex]?.focus();
  }

  if (!context.open) return null;

  return (
    <Portal ownerDocument={ownerDocument}>
      <div
        {...props}
        ref={mergedRef}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy ?? (ariaLabel ? undefined : context.triggerId)}
        aria-orientation="vertical"
        className={joinClassNames("rui-dropdown-menu__content", createComponentClassName("dropdownMenu", "content"), className)}
        data-side={position.side}
        data-state="open"
        id={context.contentId}
        onKeyDown={handleKeyDown}
        role="menu"
        style={{ ...position.style, zIndex: modalBranchZIndex, ...props.style }}
        tabIndex={-1}
      >
        {children}
      </div>
    </Portal>
  );
});

export interface DropdownMenuItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  inset?: boolean;
  textValue?: string;
  onSelect?: () => void;
}

const DropdownMenuItem = forwardRef<HTMLButtonElement, DropdownMenuItemProps>(function DropdownMenuItem(
  { children, className, disabled = false, inset = false, onClick, onMouseMove, onSelect, textValue, type = "button", ...props },
  ref
) {
  const context = useDropdownMenuContext("DropdownMenu.Item");
  return (
    <button
      {...props}
      ref={ref}
      aria-disabled={disabled || undefined}
      className={joinClassNames("rui-dropdown-menu__item", createComponentClassName("dropdownMenu", "item"), className)}
      data-inset={inset ? "" : undefined}
      data-text-value={textValue}
      onClick={(event) => {
        onClick?.(event);
        if (disabled) {
          event.preventDefault();
          return;
        }
        if (!event.defaultPrevented) {
          onSelect?.();
          context.setOpen(false);
          context.triggerRef.current?.focus();
        }
      }}
      onMouseMove={(event) => {
        onMouseMove?.(event);
        if (!event.defaultPrevented) event.currentTarget.focus();
      }}
      role="menuitem"
      tabIndex={-1}
      type={type}
    >
      {children}
    </button>
  );
});

export type DropdownMenuLabelProps = HTMLAttributes<HTMLDivElement>;
const DropdownMenuLabel = forwardRef<HTMLDivElement, DropdownMenuLabelProps>(function DropdownMenuLabel({ className, ...props }, ref) {
  return <div {...props} ref={ref} aria-hidden="true" className={joinClassNames("rui-dropdown-menu__label", className)} />;
});

export type DropdownMenuSeparatorProps = HTMLAttributes<HTMLDivElement>;
const DropdownMenuSeparator = forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return <div {...props} ref={ref} className={joinClassNames("rui-dropdown-menu__separator", className)} role="separator" />;
});

export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator
};
