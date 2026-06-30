/* eslint-disable react-refresh/only-export-components */
import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef
} from "react";
import type {
  FocusEventHandler,
  HTMLAttributes,
  KeyboardEventHandler,
  PointerEventHandler,
  ReactElement,
  ReactNode,
  Ref,
  RefAttributes,
  RefObject
} from "react";

import { Portal } from "../internal/Portal";
import { createComponentClassName } from "../internal/component-class-name";
import { joinClassNames } from "../internal/join-class-names";
import { useModalBranch } from "../internal/modal-layer";
import { useAnchoredPosition } from "../internal/use-anchored-position";
import type { FloatingAlign, FloatingSide } from "../internal/use-anchored-position";
import { useControllableState } from "../internal/use-controllable-state";
import { useMergedRefs } from "../internal/use-merged-refs";
import "./tooltip.less";

type TimerId = ReturnType<Window["setTimeout"]>;

interface TooltipContextValue {
  open: boolean;
  disabled: boolean;
  contentId: string;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  dismissTooltip: () => void;
  handleBlur: () => void;
  handleFocus: () => void;
  handlePointerEnter: (immediate?: boolean) => void;
  handlePointerLeave: () => void;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltipContext(component: string) {
  const context = useContext(TooltipContext);
  if (!context) throw new Error(`${component} 必须在 Tooltip.Root 内使用。`);
  return context;
}

function getOwnerWindow(element: HTMLElement | null): Window | undefined {
  return element?.ownerDocument.defaultView ?? (typeof window === "undefined" ? undefined : window);
}

function mergeIds(...ids: Array<string | undefined>): string | undefined {
  const mergedIds = ids
    .flatMap((value) => value?.split(/\s+/) ?? [])
    .filter(Boolean);

  return mergedIds.length > 0 ? Array.from(new Set(mergedIds)).join(" ") : undefined;
}

function composeEventHandlers<Event>(
  userHandler: ((event: Event) => void) | undefined,
  internalHandler: (event: Event) => void
) {
  return (event: Event) => {
    userHandler?.(event);

    const maybeDefaultPrevented = event as Event & { defaultPrevented?: boolean };
    if (!maybeDefaultPrevented.defaultPrevented) {
      internalHandler(event);
    }
  };
}

export interface TooltipRootProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
  disabled?: boolean;
}

const TooltipRoot = ({
  children,
  closeDelay = 120,
  defaultOpen = false,
  disabled = false,
  onOpenChange,
  open: openProp,
  openDelay = 500
}: TooltipRootProps) => {
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const contentId = `${useId()}-content`;
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const openTimerRef = useRef<TimerId | null>(null);
  const closeTimerRef = useRef<TimerId | null>(null);
  const pointerInsideRef = useRef(false);
  const focusInsideRef = useRef(false);

  const clearOpenTimer = useCallback(() => {
    const ownerWindow = getOwnerWindow(triggerRef.current);
    if (ownerWindow && openTimerRef.current !== null) {
      ownerWindow.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  }, []);

  const clearCloseTimer = useCallback(() => {
    const ownerWindow = getOwnerWindow(triggerRef.current);
    if (ownerWindow && closeTimerRef.current !== null) {
      ownerWindow.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openTooltip = useCallback(
    (immediate = false) => {
      if (disabled) return;
      const ownerWindow = getOwnerWindow(triggerRef.current);
      clearCloseTimer();
      clearOpenTimer();

      if (immediate || openDelay <= 0 || !ownerWindow) {
        setOpen(true);
        return;
      }

      openTimerRef.current = ownerWindow.setTimeout(() => {
        openTimerRef.current = null;
        setOpen(true);
      }, openDelay);
    },
    [clearCloseTimer, clearOpenTimer, disabled, openDelay, setOpen]
  );

  const closeTooltip = useCallback(
    (immediate = false) => {
      const ownerWindow = getOwnerWindow(triggerRef.current);
      clearOpenTimer();
      clearCloseTimer();

      if (immediate || closeDelay <= 0 || !ownerWindow) {
        setOpen(false);
        return;
      }

      closeTimerRef.current = ownerWindow.setTimeout(() => {
        closeTimerRef.current = null;
        setOpen(false);
      }, closeDelay);
    },
    [clearCloseTimer, clearOpenTimer, closeDelay, setOpen]
  );

  const handlePointerEnter = useCallback(
    (immediate = false) => {
      pointerInsideRef.current = true;
      openTooltip(immediate);
    },
    [openTooltip]
  );

  const handlePointerLeave = useCallback(() => {
    pointerInsideRef.current = false;
    if (!focusInsideRef.current) {
      closeTooltip();
    }
  }, [closeTooltip]);

  const handleFocus = useCallback(() => {
    focusInsideRef.current = true;
    openTooltip(true);
  }, [openTooltip]);

  const handleBlur = useCallback(() => {
    focusInsideRef.current = false;
    if (!pointerInsideRef.current) {
      closeTooltip();
    }
  }, [closeTooltip]);

  const dismissTooltip = useCallback(() => {
    pointerInsideRef.current = false;
    focusInsideRef.current = false;
    closeTooltip(true);
  }, [closeTooltip]);

  useEffect(() => {
    return () => {
      clearOpenTimer();
      clearCloseTimer();
    };
  }, [clearCloseTimer, clearOpenTimer]);

  useEffect(() => {
    if (disabled && open) {
      dismissTooltip();
    }
  }, [disabled, dismissTooltip, open]);

  useEffect(() => {
    if (!open) return;
    const ownerDocument = triggerRef.current?.ownerDocument ?? document;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      dismissTooltip();
    };

    ownerDocument.addEventListener("keydown", handleKeyDown, true);
    return () => ownerDocument.removeEventListener("keydown", handleKeyDown, true);
  }, [dismissTooltip, open]);

  return (
    <TooltipContext.Provider
      value={{
        contentId,
        contentRef,
        disabled,
        dismissTooltip,
        handleBlur,
        handleFocus,
        handlePointerEnter,
        handlePointerLeave,
        open,
        triggerRef
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
};

interface TooltipTriggerChildProps {
  "aria-describedby"?: string;
  className?: string;
  onBlur?: FocusEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  onPointerEnter?: PointerEventHandler<HTMLElement>;
  onPointerLeave?: PointerEventHandler<HTMLElement>;
}

type TooltipTriggerElement = ReactElement<TooltipTriggerChildProps>;

export interface TooltipTriggerProps {
  children: TooltipTriggerElement;
  className?: string;
}

function getElementRef(element: TooltipTriggerElement): Ref<HTMLElement> | undefined {
  return (element.props as TooltipTriggerChildProps & RefAttributes<HTMLElement>).ref;
}

const TooltipTrigger = forwardRef<HTMLElement, TooltipTriggerProps>(function TooltipTrigger({ children, className }, ref) {
  const context = useTooltipContext("Tooltip.Trigger");
  const child = Children.only(children);

  if (!isValidElement<TooltipTriggerChildProps>(child)) {
    throw new Error("Tooltip.Trigger 只接受一个可聚焦的 React 元素作为子元素。");
  }

  const childRef = getElementRef(child);
  const mergedRef = useMergedRefs(childRef, context.triggerRef, ref);
  const describedBy = context.open && !context.disabled ? mergeIds(child.props["aria-describedby"], context.contentId) : child.props["aria-describedby"];
  const triggerProps: Partial<TooltipTriggerChildProps> & RefAttributes<HTMLElement> = {
    "aria-describedby": describedBy,
    className: joinClassNames("rui-tooltip__trigger", createComponentClassName("tooltip", "trigger"), child.props.className, className),
    onBlur: composeEventHandlers(child.props.onBlur, () => context.handleBlur()),
    onFocus: composeEventHandlers(child.props.onFocus, () => context.handleFocus()),
    onKeyDown: composeEventHandlers(child.props.onKeyDown, (event) => {
      if (event.key === "Escape" && context.open) {
        event.preventDefault();
        context.dismissTooltip();
      }
    }),
    onPointerEnter: composeEventHandlers(child.props.onPointerEnter, () => context.handlePointerEnter()),
    onPointerLeave: composeEventHandlers(child.props.onPointerLeave, () => context.handlePointerLeave()),
    ref: mergedRef
  };

  return cloneElement(child, triggerProps);
});

export interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: FloatingAlign;
  side?: FloatingSide;
  sideOffset?: number;
}

const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(function TooltipContent(
  { align = "center", children, className, onPointerEnter, onPointerLeave, side = "top", sideOffset = 8, ...props },
  ref
) {
  const context = useTooltipContext("Tooltip.Content");
  const mergedRef = useMergedRefs(ref, context.contentRef);
  const ownerDocument = context.triggerRef.current?.ownerDocument;
  const position = useAnchoredPosition({
    open: context.open,
    triggerRef: context.triggerRef,
    contentRef: context.contentRef,
    align,
    side,
    gap: sideOffset,
    maxHeight: 280,
    minHeight: 32
  });
  const modalBranchZIndex = useModalBranch(context.contentRef, context.open);

  if (!context.open || context.disabled) return null;

  return (
    <Portal ownerDocument={ownerDocument}>
      <div
        {...props}
        ref={mergedRef}
        className={joinClassNames("rui-tooltip__content", createComponentClassName("tooltip", "content"), className)}
        data-side={position.side}
        data-state="open"
        id={context.contentId}
        onPointerEnter={composeEventHandlers(onPointerEnter, () => context.handlePointerEnter(true))}
        onPointerLeave={composeEventHandlers(onPointerLeave, () => context.handlePointerLeave())}
        role="tooltip"
        style={{ ...position.style, zIndex: modalBranchZIndex, ...props.style }}
      >
        {children}
      </div>
    </Portal>
  );
});

export const Tooltip = { Root: TooltipRoot, Trigger: TooltipTrigger, Content: TooltipContent };
