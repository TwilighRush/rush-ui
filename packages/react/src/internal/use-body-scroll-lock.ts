import { useEffect } from "react";

const lockCounts = new WeakMap<Document, number>();
const previousOverflow = new WeakMap<Document, string>();

export function useBodyScrollLock(locked: boolean, ownerDocument?: Document) {
  useEffect(() => {
    if (!locked) {
      return;
    }

    const documentNode = ownerDocument ?? document;
    const body = documentNode.body;
    const count = lockCounts.get(documentNode) ?? 0;

    if (count === 0) {
      previousOverflow.set(documentNode, body.style.overflow);
      body.style.overflow = "hidden";
    }

    lockCounts.set(documentNode, count + 1);

    return () => {
      const nextCount = Math.max(0, (lockCounts.get(documentNode) ?? 1) - 1);
      lockCounts.set(documentNode, nextCount);

      if (nextCount === 0) {
        body.style.overflow = previousOverflow.get(documentNode) ?? "";
        previousOverflow.delete(documentNode);
      }
    };
  }, [locked, ownerDocument]);
}
