const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hasAttribute("hidden") &&
      element.getAttribute("aria-hidden") !== "true" &&
      !element.closest("[inert]")
  );
}

export function focusFirst(container: HTMLElement, preferredTarget?: HTMLElement | null) {
  if (preferredTarget && container.contains(preferredTarget)) {
    preferredTarget.focus();
    if (container.ownerDocument.activeElement === preferredTarget) return;
  }

  const [first] = getFocusableElements(container);
  (first ?? container).focus();
}

export function focusRelativeTo(
  reference: HTMLElement,
  direction: "previous" | "next",
  excludedContainer?: HTMLElement | null
) {
  const focusable = getFocusableElements(reference.ownerDocument.body).filter(
    (element) => !excludedContainer?.contains(element)
  );
  const index = focusable.indexOf(reference);
  const target = direction === "next" ? focusable[index + 1] : focusable[index - 1];
  (target ?? reference).focus();
}

export function trapTabKey(event: KeyboardEvent | React.KeyboardEvent, container: HTMLElement) {
  if (event.key !== "Tab") {
    return;
  }

  const focusable = getFocusableElements(container);

  if (focusable.length === 0) {
    event.preventDefault();
    container.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const activeElement = container.ownerDocument.activeElement;

  if (event.shiftKey && (activeElement === first || activeElement === container)) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}
