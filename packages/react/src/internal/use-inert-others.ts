import { useEffect } from "react";
import type { RefObject } from "react";

interface InertState {
  count: number;
  ariaHidden: string | null;
  inert: boolean;
}

const inertStates = new WeakMap<Element, InertState>();

export function useInertOthers(
  open: boolean,
  layerRef: RefObject<HTMLElement | null>,
  isAllowedBranch?: (element: Element) => boolean
) {
  useEffect(() => {
    const layer = layerRef.current;
    if (!open || !layer) return;

    const portalRoot = Array.from(layer.ownerDocument.body.children).find((element) => element === layer || element.contains(layer));
    if (!portalRoot) return;

    const siblings = Array.from(layer.ownerDocument.body.children).filter(
      (element) => element !== portalRoot && !isAllowedBranch?.(element)
    );

    for (const sibling of siblings) {
      const current = inertStates.get(sibling);
      if (current) {
        current.count += 1;
        continue;
      }

      inertStates.set(sibling, {
        count: 1,
        ariaHidden: sibling.getAttribute("aria-hidden"),
        inert: sibling.hasAttribute("inert")
      });
      sibling.setAttribute("aria-hidden", "true");
      sibling.setAttribute("inert", "");
    }

    return () => {
      for (const sibling of siblings) {
        const state = inertStates.get(sibling);
        if (!state) continue;
        state.count -= 1;
        if (state.count > 0) continue;

        if (state.ariaHidden === null) sibling.removeAttribute("aria-hidden");
        else sibling.setAttribute("aria-hidden", state.ariaHidden);
        if (!state.inert) sibling.removeAttribute("inert");
        inertStates.delete(sibling);
      }
    };
  }, [isAllowedBranch, layerRef, open]);
}
