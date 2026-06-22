/* eslint-disable react-refresh/only-export-components */
import { createContext, forwardRef, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import type { HTMLAttributes, ReactNode, RefObject } from "react";

import { Button } from "../button/Button";
import type { ButtonProps } from "../button/Button";
import { Portal } from "../internal/Portal";
import { createComponentClassName } from "../internal/component-class-name";
import { focusFirst, trapTabKey } from "../internal/focus";
import { joinClassNames } from "../internal/join-class-names";
import { ModalLayerProvider } from "../internal/modal-layer";
import { useBodyScrollLock } from "../internal/use-body-scroll-lock";
import { useControllableState } from "../internal/use-controllable-state";
import { useInertOthers } from "../internal/use-inert-others";
import { useMergedRefs } from "../internal/use-merged-refs";
import "./dialog.less";

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  hasDescription: boolean;
  registerTitle: () => () => void;
  registerDescription: () => () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(component: string) {
  const context = useContext(DialogContext);
  if (!context) throw new Error(`${component} 必须在 Dialog.Root 内使用。`);
  return context;
}

export interface DialogRootProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DialogRoot = ({ children, defaultOpen = false, onOpenChange, open: openProp }: DialogRootProps) => {
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const [titleCount, setTitleCount] = useState(0);
  const [descriptionCount, setDescriptionCount] = useState(0);
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const registerTitle = useCallback(() => {
    setTitleCount((count) => count + 1);
    return () => setTitleCount((count) => Math.max(0, count - 1));
  }, []);
  const registerDescription = useCallback(() => {
    setDescriptionCount((count) => count + 1);
    return () => setDescriptionCount((count) => Math.max(0, count - 1));
  }, []);

  return (
    <DialogContext.Provider
      value={{
        open,
        setOpen,
        contentId: `${id}-content`,
        titleId: `${id}-title`,
        descriptionId: `${id}-description`,
        hasTitle: titleCount > 0,
        hasDescription: descriptionCount > 0,
        registerTitle,
        registerDescription,
        triggerRef
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export type DialogTriggerProps = ButtonProps;

const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(function DialogTrigger(
  { className, onClick, variant = "outline", ...props },
  ref
) {
  const context = useDialogContext("Dialog.Trigger");
  const mergedRef = useMergedRefs(ref, context.triggerRef);
  return (
    <Button
      {...props}
      ref={mergedRef}
      aria-controls={context.contentId}
      aria-expanded={context.open}
      aria-haspopup="dialog"
      className={joinClassNames("rui-dialog__trigger", createComponentClassName("dialog", "trigger"), className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) context.setOpen(true);
      }}
      variant={variant}
    />
  );
});

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  closeOnBackdropClick?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    children,
    className,
    closeOnBackdropClick = true,
    initialFocusRef,
    onKeyDown,
    ...props
  },
  ref
) {
  const context = useDialogContext("Dialog.Content");
  const contentRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(ref, contentRef);
  const { open, setOpen, triggerRef } = context;
  const ownerDocument = triggerRef.current?.ownerDocument;
  const branchesRef = useRef(new Set<HTMLElement>());
  const modalLayer = useMemo(
    () => ({
      containsBranch: (target: Node) => Array.from(branchesRef.current).some((branch) => branch.contains(target)),
      registerBranch: (branch: HTMLElement) => {
        branchesRef.current.add(branch);
        return () => branchesRef.current.delete(branch);
      }
    }),
    []
  );

  useBodyScrollLock(open, ownerDocument);
  useInertOthers(open, backdropRef, modalLayer.containsBranch);

  useEffect(() => {
    const content = contentRef.current;
    if (!open || !content) return;

    const documentNode = content.ownerDocument;
    const ownerWindow = documentNode.defaultView ?? window;
    const previousFocus = documentNode.activeElement instanceof HTMLElement ? documentNode.activeElement : null;
    const fallbackFocus = triggerRef.current;
    const frame = ownerWindow.requestAnimationFrame(() => {
      const activeElement = documentNode.activeElement;
      if (
        activeElement instanceof Node &&
        (content.contains(activeElement) || modalLayer.containsBranch(activeElement))
      ) {
        return;
      }
      focusFirst(content, initialFocusRef?.current);
    });
    const handleFocusIn = (event: FocusEvent) => {
      if (event.target instanceof Node && !content.contains(event.target) && !modalLayer.containsBranch(event.target)) {
        focusFirst(content, initialFocusRef?.current);
      }
    };
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      setOpen(false);
    };
    documentNode.addEventListener("focusin", handleFocusIn, true);
    documentNode.addEventListener("keydown", handleKeyDown, true);

    return () => {
      ownerWindow.cancelAnimationFrame(frame);
      documentNode.removeEventListener("focusin", handleFocusIn, true);
      documentNode.removeEventListener("keydown", handleKeyDown, true);
      const target = previousFocus?.isConnected ? previousFocus : fallbackFocus;
      ownerWindow.requestAnimationFrame(() => target?.focus());
    };
  }, [initialFocusRef, modalLayer, open, setOpen, triggerRef]);

  if (!open) return null;

  return (
    <Portal ownerDocument={ownerDocument}>
      <div
        ref={backdropRef}
        className={joinClassNames("rui-dialog__backdrop", createComponentClassName("dialog", "backdrop"))}
        data-state="open"
        onMouseDown={(event) => {
          if (closeOnBackdropClick && event.target === event.currentTarget) context.setOpen(false);
        }}
      >
        <div
          {...props}
          ref={mergedRef}
          aria-describedby={ariaDescribedBy ?? (context.hasDescription ? context.descriptionId : undefined)}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy ?? (ariaLabel ? undefined : context.titleId)}
          aria-modal="true"
          className={joinClassNames("rui-dialog__content", createComponentClassName("dialog", "content"), className)}
          data-state="open"
          id={context.contentId}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.defaultPrevented) return;
            if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              context.setOpen(false);
              return;
            }
            if (contentRef.current) trapTabKey(event, contentRef.current);
          }}
          role="dialog"
          tabIndex={-1}
        >
          <ModalLayerProvider value={modalLayer}>{children}</ModalLayerProvider>
        </div>
      </div>
    </Portal>
  );
});

export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>;

const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(function DialogTitle({ className, ...props }, ref) {
  const { registerTitle, titleId } = useDialogContext("Dialog.Title");
  useEffect(() => registerTitle(), [registerTitle]);
  return <h2 {...props} ref={ref} className={joinClassNames("rui-dialog__title", className)} id={titleId} />;
});

export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(function DialogDescription({ className, ...props }, ref) {
  const { descriptionId, registerDescription } = useDialogContext("Dialog.Description");
  useEffect(() => registerDescription(), [registerDescription]);
  return <p {...props} ref={ref} className={joinClassNames("rui-dialog__description", className)} id={descriptionId} />;
});

export type DialogCloseProps = ButtonProps;

const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(function DialogClose(
  { className, onClick, variant = "ghost", ...props },
  ref
) {
  const context = useDialogContext("Dialog.Close");
  return (
    <Button
      {...props}
      ref={ref}
      className={joinClassNames("rui-dialog__close", createComponentClassName("dialog", "close"), className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) context.setOpen(false);
      }}
      variant={variant}
    />
  );
});

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose
};
