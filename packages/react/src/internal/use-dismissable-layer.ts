import { useEffect, useRef } from "react";
import type { RefObject } from "react";

const layerStacks = new WeakMap<Document, symbol[]>();

export interface UseDismissableLayerOptions {
  open: boolean;
  refs: Array<RefObject<HTMLElement | null>>;
  onDismiss: () => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
}

export function useDismissableLayer({ open, refs, onDismiss, onEscapeKeyDown }: UseDismissableLayerOptions) {
  const layerId = useRef(Symbol("dismissable-layer"));
  const onDismissRef = useRef(onDismiss);
  const onEscapeKeyDownRef = useRef(onEscapeKeyDown);
  onDismissRef.current = onDismiss;
  onEscapeKeyDownRef.current = onEscapeKeyDown;

  useEffect(() => {
    if (!open) return;

    const ownerDocument = refs.find((ref) => ref.current)?.current?.ownerDocument ?? document;
    const currentLayerId = layerId.current;
    const stack = layerStacks.get(ownerDocument) ?? [];
    stack.push(currentLayerId);
    layerStacks.set(ownerDocument, stack);

    const isTopLayer = () => stack[stack.length - 1] === currentLayerId;
    const handlePointerDown = (event: PointerEvent) => {
      if (!isTopLayer()) return;
      if (!(event.target instanceof Node)) return;
      if (refs.some((ref) => ref.current?.contains(event.target as Node))) return;
      onDismissRef.current();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !isTopLayer()) return;
      onEscapeKeyDownRef.current?.(event);
      if (!event.defaultPrevented) {
        event.preventDefault();
        onDismissRef.current();
      }
    };

    ownerDocument.addEventListener("pointerdown", handlePointerDown);
    ownerDocument.addEventListener("keydown", handleKeyDown, true);
    return () => {
      ownerDocument.removeEventListener("pointerdown", handlePointerDown);
      ownerDocument.removeEventListener("keydown", handleKeyDown, true);
      const index = stack.lastIndexOf(currentLayerId);
      if (index >= 0) stack.splice(index, 1);
      if (stack.length === 0) layerStacks.delete(ownerDocument);
    };
  }, [open, refs]);
}
