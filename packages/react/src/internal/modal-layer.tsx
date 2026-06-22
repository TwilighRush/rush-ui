/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect } from "react";
import type { ReactNode, RefObject } from "react";

export interface ModalLayerValue {
  containsBranch: (target: Node) => boolean;
  registerBranch: (branch: HTMLElement) => () => void;
}

const ModalLayerContext = createContext<ModalLayerValue | null>(null);

export function ModalLayerProvider({ children, value }: { children: ReactNode; value: ModalLayerValue }) {
  return <ModalLayerContext.Provider value={value}>{children}</ModalLayerContext.Provider>;
}

export function useModalBranch(ref: RefObject<HTMLElement | null>, active: boolean) {
  const layer = useContext(ModalLayerContext);

  useEffect(() => {
    const branch = ref.current;
    if (!active || !layer || !branch) return;
    return layer.registerBranch(branch);
  }, [active, layer, ref]);
}
