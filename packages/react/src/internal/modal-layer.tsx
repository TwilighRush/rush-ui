/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect } from "react";
import type { CSSProperties, ReactNode, RefObject } from "react";

export interface ModalLayerValue {
  containsBranch: (target: Node) => boolean;
  registerBranch: (branch: HTMLElement) => () => void;
  branchZIndex?: CSSProperties["zIndex"];
}

const ModalLayerContext = createContext<ModalLayerValue | null>(null);

export function ModalLayerProvider({ children, value }: { children: ReactNode; value: ModalLayerValue }) {
  return <ModalLayerContext.Provider value={value}>{children}</ModalLayerContext.Provider>;
}

export function useModalLayer(): ModalLayerValue | null {
  return useContext(ModalLayerContext);
}

export function getModalBranchZIndex(
  zIndex: CSSProperties["zIndex"] | undefined,
  fallback: CSSProperties["zIndex"]
): CSSProperties["zIndex"] {
  const baseZIndex = zIndex === undefined || zIndex === "auto" ? fallback : zIndex;
  return typeof baseZIndex === "number" ? baseZIndex + 1 : `calc(${baseZIndex} + 1)`;
}

export function useModalBranch(ref: RefObject<HTMLElement | null>, active: boolean): CSSProperties["zIndex"] | undefined {
  const layer = useModalLayer();

  useEffect(() => {
    const branch = ref.current;
    if (!active || !layer || !branch) return;
    return layer.registerBranch(branch);
  }, [active, layer, ref]);

  return active ? layer?.branchZIndex : undefined;
}
