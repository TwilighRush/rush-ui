import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type { CSSProperties, RefObject } from "react";

export type FloatingSide = "top" | "right" | "bottom" | "left";
export type FloatingAlign = "start" | "center" | "end";

export interface UseAnchoredPositionOptions {
  open: boolean;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLElement | null>;
  side?: FloatingSide;
  align?: FloatingAlign;
  gap?: number;
  matchTriggerWidth?: boolean;
  maxHeight?: number;
  minHeight?: number;
}

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useAnchoredPosition({
  open,
  triggerRef,
  contentRef,
  side = "bottom",
  align = "start",
  gap = 6,
  matchTriggerWidth = false,
  maxHeight = 320,
  minHeight = 120
}: UseAnchoredPositionOptions) {
  const [position, setPosition] = useState<{ style: CSSProperties; side: FloatingSide }>({ style: {}, side });

  const update = useCallback(() => {
    const trigger = triggerRef.current;
    const content = contentRef.current;
    if (!trigger || !content) return;

    const rect = trigger.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const ownerWindow = trigger.ownerDocument.defaultView ?? window;
    const viewportWidth = ownerWindow.innerWidth;
    const viewportHeight = ownerWindow.innerHeight;
    const edge = 8;
    const spaces = {
      top: rect.top - gap - edge,
      right: viewportWidth - rect.right - gap - edge,
      bottom: viewportHeight - rect.bottom - gap - edge,
      left: rect.left - gap - edge
    };
    const opposite: Record<FloatingSide, FloatingSide> = { top: "bottom", right: "left", bottom: "top", left: "right" };
    const expectedSize = side === "top" || side === "bottom" ? Math.max(contentRect.height, minHeight) : contentRect.width;
    const alternateSide = opposite[side];
    const resolvedSide = expectedSize > spaces[side] && spaces[alternateSide] > spaces[side] ? alternateSide : side;
    const availableHeight = Math.max(
      0,
      Math.min(maxHeight, resolvedSide === "top" || resolvedSide === "bottom" ? spaces[resolvedSide] : viewportHeight - edge * 2)
    );
    const width = matchTriggerWidth ? rect.width : contentRect.width;

    const style: CSSProperties = {
      maxHeight: availableHeight,
      width: matchTriggerWidth ? rect.width : undefined,
      position: "fixed"
    };

    if (resolvedSide === "top" || resolvedSide === "bottom") {
      let left = rect.left;
      if (align === "center") left = rect.left + (rect.width - width) / 2;
      if (align === "end") left = rect.right - width;
      style.left = Math.max(edge, Math.min(left, viewportWidth - width - edge));
      if (resolvedSide === "bottom") style.top = rect.bottom + gap;
      else style.bottom = viewportHeight - rect.top + gap;
    } else {
      let top = rect.top;
      if (align === "center") top = rect.top + (rect.height - contentRect.height) / 2;
      if (align === "end") top = rect.bottom - contentRect.height;
      style.top = Math.max(edge, Math.min(top, viewportHeight - contentRect.height - edge));
      if (resolvedSide === "right") style.left = rect.right + gap;
      else style.right = viewportWidth - rect.left + gap;
    }

    setPosition({ style, side: resolvedSide });
  }, [align, contentRef, gap, matchTriggerWidth, maxHeight, minHeight, side, triggerRef]);

  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    update();
  }, [open, update]);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const content = contentRef.current;
    const ownerWindow = trigger?.ownerDocument.defaultView ?? window;
    let frame = 0;
    const scheduleUpdate = () => {
      ownerWindow.cancelAnimationFrame(frame);
      frame = ownerWindow.requestAnimationFrame(update);
    };
    const ResizeObserverConstructor = ownerWindow.ResizeObserver;
    const observer = ResizeObserverConstructor ? new ResizeObserverConstructor(scheduleUpdate) : null;
    if (trigger) observer?.observe(trigger);
    if (content) observer?.observe(content);
    ownerWindow.addEventListener("resize", scheduleUpdate);
    ownerWindow.addEventListener("scroll", scheduleUpdate, true);
    return () => {
      ownerWindow.cancelAnimationFrame(frame);
      observer?.disconnect();
      ownerWindow.removeEventListener("resize", scheduleUpdate);
      ownerWindow.removeEventListener("scroll", scheduleUpdate, true);
    };
  }, [contentRef, open, triggerRef, update]);

  return position;
}
