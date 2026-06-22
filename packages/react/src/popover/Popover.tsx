/* eslint-disable react-refresh/only-export-components */
import { createContext, forwardRef, useContext, useEffect, useId, useMemo, useRef } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactNode, RefObject } from "react";

import { Button } from "../button/Button";
import type { ButtonProps } from "../button/Button";
import { Portal } from "../internal/Portal";
import { createComponentClassName } from "../internal/component-class-name";
import { focusFirst, focusRelativeTo, getFocusableElements } from "../internal/focus";
import { joinClassNames } from "../internal/join-class-names";
import { useModalBranch } from "../internal/modal-layer";
import { useAnchoredPosition } from "../internal/use-anchored-position";
import type { FloatingAlign, FloatingSide } from "../internal/use-anchored-position";
import { useControllableState } from "../internal/use-controllable-state";
import { useDismissableLayer } from "../internal/use-dismissable-layer";
import { useMergedRefs } from "../internal/use-merged-refs";
import "./popover.less";

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext(component: string) {
  const context = useContext(PopoverContext);
  if (!context) throw new Error(`${component} 必须在 Popover.Root 内使用。`);
  return context;
}

export interface PopoverRootProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PopoverRoot = ({ children, defaultOpen = false, onOpenChange, open: openProp }: PopoverRootProps) => {
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const contentId = `${useId()}-content`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  return <PopoverContext.Provider value={{ open, setOpen, contentId, triggerRef, contentRef }}>{children}</PopoverContext.Provider>;
};

export type PopoverTriggerProps = ButtonProps;

const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(function PopoverTrigger(
  { className, onClick, variant = "outline", ...props },
  ref
) {
  const context = usePopoverContext("Popover.Trigger");
  const mergedRef = useMergedRefs(ref, context.triggerRef);
  return (
    <Button
      {...props}
      ref={mergedRef}
      aria-controls={context.contentId}
      aria-expanded={context.open}
      aria-haspopup="dialog"
      className={joinClassNames("rui-popover__trigger", createComponentClassName("popover", "trigger"), className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) context.setOpen(!context.open);
      }}
      variant={variant}
    />
  );
});

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: FloatingAlign;
  side?: FloatingSide;
  sideOffset?: number;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent(
  { align = "start", children, className, initialFocusRef, onKeyDown, side = "bottom", sideOffset = 6, ...props },
  ref
) {
  const context = usePopoverContext("Popover.Content");
  const mergedRef = useMergedRefs(ref, context.contentRef);
  const { contentRef, open, setOpen, triggerRef } = context;
  const layerRefs = useMemo(() => [context.triggerRef, context.contentRef], [context.contentRef, context.triggerRef]);
  const ownerDocument = context.triggerRef.current?.ownerDocument;
  const position = useAnchoredPosition({
    open: context.open,
    triggerRef: context.triggerRef,
    contentRef: context.contentRef,
    align,
    side,
    gap: sideOffset
  });
  useModalBranch(context.contentRef, context.open);

  useDismissableLayer({
    open: context.open,
    refs: layerRefs,
    onDismiss: () => context.setOpen(false),
    onEscapeKeyDown: () => context.triggerRef.current?.focus()
  });

  useEffect(() => {
    const content = contentRef.current;
    if (!open || !content) return;
    const documentNode = content.ownerDocument;
    const ownerWindow = documentNode.defaultView ?? window;
    const frame = ownerWindow.requestAnimationFrame(() => focusFirst(content, initialFocusRef?.current));
    const handleFocusIn = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) return;
      if (!content.contains(event.target) && !triggerRef.current?.contains(event.target)) setOpen(false);
    };
    documentNode.addEventListener("focusin", handleFocusIn);
    return () => {
      ownerWindow.cancelAnimationFrame(frame);
      documentNode.removeEventListener("focusin", handleFocusIn);
    };
  }, [contentRef, initialFocusRef, open, setOpen, triggerRef]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.key !== "Tab") return;
    const content = context.contentRef.current;
    const trigger = context.triggerRef.current;
    if (!content || !trigger) return;
    const focusable = getFocusableElements(content);
    const active = content.ownerDocument.activeElement;
    const first = focusable[0];
    const last = focusable.at(-1);

    if (event.shiftKey && (active === first || active === content)) {
      event.preventDefault();
      context.setOpen(false);
      trigger.focus();
    } else if (!event.shiftKey && (active === last || focusable.length === 0)) {
      event.preventDefault();
      context.setOpen(false);
      content.ownerDocument.defaultView?.requestAnimationFrame(() => focusRelativeTo(trigger, "next", content));
    }
  }

  if (!context.open) return null;

  return (
    <Portal ownerDocument={ownerDocument}>
      <div
        {...props}
        ref={mergedRef}
        className={joinClassNames("rui-popover__content", createComponentClassName("popover", "content"), className)}
        data-side={position.side}
        data-state="open"
        id={context.contentId}
        onKeyDown={handleKeyDown}
        role="dialog"
        style={{ ...position.style, ...props.style }}
        tabIndex={-1}
      >
        {children}
      </div>
    </Portal>
  );
});

export const Popover = { Root: PopoverRoot, Trigger: PopoverTrigger, Content: PopoverContent };
