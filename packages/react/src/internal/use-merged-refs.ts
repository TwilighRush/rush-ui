import { useCallback } from "react";
import type { ForwardedRef, MutableRefObject } from "react";

type PossibleRef<T> = ForwardedRef<T> | MutableRefObject<T | null> | undefined;

export function useMergedRefs<T>(...refs: PossibleRef<T>[]) {
  return useCallback(
    (node: T | null) => {
      for (const ref of refs) {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  );
}
