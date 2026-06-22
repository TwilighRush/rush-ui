import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  children: ReactNode;
  ownerDocument?: Document | null;
}

export function Portal({ children, ownerDocument }: PortalProps) {
  if (!ownerDocument && typeof document === "undefined") {
    return null;
  }

  return createPortal(children, (ownerDocument ?? document).body);
}
