import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";
import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from "react";

import { Portal } from "../internal/Portal";
import { createComponentClassName } from "../internal/component-class-name";
import { joinClassNames } from "../internal/join-class-names";
import { useModalBranch } from "../internal/modal-layer";
import { useAnchoredPosition } from "../internal/use-anchored-position";
import { useDismissableLayer } from "../internal/use-dismissable-layer";
import "./select.less";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  textValue?: string;
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  name?: string;
  size?: SelectSize;
  placeholder?: ReactNode;
  emptyText?: ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  errorText?: ReactNode;
  onValueChange?: (value: string) => void;
}

const TYPEAHEAD_TIMEOUT = 700;
const POPUP_MAX_HEIGHT = 280;

function isAriaInvalid(value: SelectProps["aria-invalid"]): boolean {
  return value === true || value === "true" || value === "grammar" || value === "spelling";
}

function mergeIds(...ids: Array<string | undefined>): string | undefined {
  const mergedIds = ids
    .flatMap((value) => value?.split(/\s+/) ?? [])
    .filter(Boolean);

  return mergedIds.length > 0 ? Array.from(new Set(mergedIds)).join(" ") : undefined;
}

function getOptionText(option: SelectOption): string {
  if (option.textValue) {
    return option.textValue;
  }

  if (typeof option.label === "string" || typeof option.label === "number") {
    return String(option.label);
  }

  return option.value;
}

function isPrintableKey(event: KeyboardEvent<HTMLButtonElement>): boolean {
  return event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey;
}

function getEnabledOptionIndex(options: readonly SelectOption[], fromIndex: number, direction: 1 | -1): number {
  if (options.length === 0) {
    return -1;
  }

  for (let offset = 0; offset < options.length; offset += 1) {
    const nextIndex = (fromIndex + direction * offset + options.length) % options.length;

    if (!options[nextIndex]?.disabled) {
      return nextIndex;
    }
  }

  return -1;
}

function getFirstEnabledOptionIndex(options: readonly SelectOption[]): number {
  return options.findIndex((option) => !option.disabled);
}

function getLastEnabledOptionIndex(options: readonly SelectOption[]): number {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

function getMatchedOptionIndex(options: readonly SelectOption[], query: string, startIndex: number): number {
  if (!query) {
    return -1;
  }

  const normalizedQuery = query.toLocaleLowerCase();

  for (let offset = 1; offset <= options.length; offset += 1) {
    const nextIndex = (startIndex + offset + options.length) % options.length;
    const option = options[nextIndex];

    if (!option || option.disabled) {
      continue;
    }

    if (getOptionText(option).toLocaleLowerCase().startsWith(normalizedQuery)) {
      return nextIndex;
    }
  }

  return -1;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    className,
    defaultValue,
    disabled = false,
    emptyText = "暂无可选项",
    errorText,
    id,
    invalid = false,
    name,
    onValueChange,
    options,
    placeholder = "请选择",
    required = false,
    size = "md",
    value,
    ...props
  },
  ref
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const generatedId = useId();
  const triggerId = id ?? `${generatedId}-control`;
  const listboxId = `${triggerId}-listbox`;
  const valueId = `${triggerId}-value`;
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const typeaheadRef = useRef("");
  const typeaheadTimerRef = useRef<number | undefined>(undefined);
  const currentValue = isControlled ? value : uncontrolledValue;
  const selectedIndex = options.findIndex((option) => option.value === currentValue);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const isInvalid = invalid || isAriaInvalid(ariaInvalid);
  const shouldRenderError = isInvalid && Boolean(errorText);
  const errorId = shouldRenderError ? `${triggerId}-error` : undefined;
  const describedBy = mergeIds(ariaDescribedBy, errorId);
  const activeOptionId = open && activeIndex >= 0 ? `${triggerId}-option-${activeIndex}` : undefined;
  const visibleLabel = selectedOption?.label ?? placeholder;

  useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);

  const getInitialActiveIndex = useCallback(
    (fallback: "first" | "last" = "first") => {
      if (selectedIndex >= 0 && !options[selectedIndex]?.disabled) {
        return selectedIndex;
      }

      return fallback === "last" ? getLastEnabledOptionIndex(options) : getFirstEnabledOptionIndex(options);
    },
    [options, selectedIndex]
  );

  const openListbox = useCallback(
    (fallback: "first" | "last" = "first") => {
      if (disabled) {
        return;
      }

      setOpen(true);
      setActiveIndex(getInitialActiveIndex(fallback));
    },
    [disabled, getInitialActiveIndex]
  );

  const closeListbox = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const commitValue = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      if (nextValue !== currentValue) {
        onValueChange?.(nextValue);
      }
    },
    [currentValue, isControlled, onValueChange]
  );

  const selectOption = useCallback(
    (nextIndex: number) => {
      const option = options[nextIndex];

      if (!option || option.disabled) {
        return;
      }

      commitValue(option.value);
      closeListbox();
      triggerRef.current?.focus();
    },
    [closeListbox, commitValue, options]
  );

  const moveActiveOption = useCallback(
    (direction: 1 | -1) => {
      const baseIndex = activeIndex >= 0 ? activeIndex : getInitialActiveIndex(direction === -1 ? "last" : "first");
      const nextIndex = getEnabledOptionIndex(options, baseIndex + direction, direction);

      if (nextIndex >= 0) {
        setActiveIndex(nextIndex);
      }
    },
    [activeIndex, getInitialActiveIndex, options]
  );

  const runTypeahead = useCallback(
    (key: string) => {
      if (typeof window !== "undefined") {
        window.clearTimeout(typeaheadTimerRef.current);
      }

      const nextBuffer = `${typeaheadRef.current}${key}`.toLocaleLowerCase();
      const isRepeatingCharacter = nextBuffer.length > 1 && Array.from(nextBuffer).every((char) => char === nextBuffer[0]);
      const query = isRepeatingCharacter ? key.toLocaleLowerCase() : nextBuffer;
      const startIndex = activeIndex >= 0 ? activeIndex : selectedIndex >= 0 ? selectedIndex : -1;
      const matchedIndex = getMatchedOptionIndex(options, query, startIndex);

      typeaheadRef.current = nextBuffer;

      if (typeof window !== "undefined") {
        typeaheadTimerRef.current = window.setTimeout(() => {
          typeaheadRef.current = "";
        }, TYPEAHEAD_TIMEOUT);
      }

      if (matchedIndex >= 0) {
        setOpen(true);
        setActiveIndex(matchedIndex);
      }
    },
    [activeIndex, options, selectedIndex]
  );

  const popupPosition = useAnchoredPosition({
    open,
    triggerRef,
    contentRef: popupRef,
    matchTriggerWidth: true,
    maxHeight: POPUP_MAX_HEIGHT
  });
  const dismissableRefs = useMemo(() => [rootRef, popupRef], []);
  useModalBranch(popupRef, open);

  useDismissableLayer({
    open,
    refs: dismissableRefs,
    onDismiss: closeListbox
  });

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.clearTimeout(typeaheadTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (activeOptionId) {
      const activeOption = document.getElementById(activeOptionId);

      if (typeof activeOption?.scrollIntoView === "function") {
        activeOption.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeOptionId]);

  function handleTriggerClick() {
    if (open) {
      closeListbox();
      return;
    }

    openListbox();
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.defaultPrevented || disabled) {
      return;
    }

    if (isPrintableKey(event)) {
      event.preventDefault();
      runTypeahead(event.key);
      return;
    }

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();

        if (!open) {
          openListbox("first");
          return;
        }

        moveActiveOption(1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();

        if (!open) {
          openListbox("last");
          return;
        }

        moveActiveOption(-1);
        break;
      case "Home":
        event.preventDefault();
        setOpen(true);
        setActiveIndex(getFirstEnabledOptionIndex(options));
        break;
      case "End":
        event.preventDefault();
        setOpen(true);
        setActiveIndex(getLastEnabledOptionIndex(options));
        break;
      case "Enter":
      case " ":
        event.preventDefault();

        if (!open) {
          openListbox();
          return;
        }

        if (activeIndex >= 0) {
          selectOption(activeIndex);
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          closeListbox();
        }
        break;
      case "Tab":
        closeListbox();
        break;
      default:
        break;
    }
  }

  function handleOptionClick(index: number) {
    selectOption(index);
  }

  function handleOptionMouseDown(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  const popup = open ? (
    <div
      ref={popupRef}
      className={joinClassNames(createComponentClassName("select", "popup"), "rui-select__popup")}
      style={popupPosition.style}
      data-side={popupPosition.side}
      data-empty={options.length === 0 ? "" : undefined}
      data-size={size}
    >
      <div
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={joinClassNames(createComponentClassName("select", "listbox"), "rui-select__listbox")}
        id={listboxId}
        role="listbox"
      >
        {options.length > 0 ? (
          options.map((option, index) => {
            const selected = option.value === currentValue;
            const active = index === activeIndex;

            return (
              <div
                aria-disabled={option.disabled ? true : undefined}
                aria-selected={selected}
                className={joinClassNames(createComponentClassName("select", "option"), "rui-select__option")}
                data-active={active ? "" : undefined}
                data-disabled={option.disabled ? "" : undefined}
                data-selected={selected ? "" : undefined}
                id={`${triggerId}-option-${index}`}
                key={option.value}
                onClick={() => handleOptionClick(index)}
                onMouseDown={handleOptionMouseDown}
                onMouseEnter={() => {
                  if (!option.disabled) {
                    setActiveIndex(index);
                  }
                }}
                role="option"
              >
                <span className={joinClassNames(createComponentClassName("select", "optionContent"), "rui-select__option-content")}>
                  <span className={joinClassNames(createComponentClassName("select", "optionLabel"), "rui-select__option-label")}>
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className={joinClassNames(createComponentClassName("select", "optionDescription"), "rui-select__option-description")}>
                      {option.description}
                    </span>
                  ) : null}
                </span>
                <span
                  aria-hidden="true"
                  className={joinClassNames(createComponentClassName("select", "optionMark"), "rui-select__option-mark")}
                />
              </div>
            );
          })
        ) : (
          <div className={joinClassNames(createComponentClassName("select", "empty"), "rui-select__empty")}>{emptyText}</div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      <div
        {...props}
        ref={rootRef}
        className={joinClassNames("rui-select", createComponentClassName("select"), className)}
        data-disabled={disabled ? "" : undefined}
        data-empty={options.length === 0 ? "" : undefined}
        data-invalid={isInvalid ? "" : undefined}
        data-open={open ? "" : undefined}
        data-placeholder={selectedOption ? undefined : ""}
        data-size={size}
      >
        <button
          ref={triggerRef}
          aria-activedescendant={activeOptionId}
          aria-controls={listboxId}
          aria-describedby={describedBy}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-invalid={isInvalid ? true : ariaInvalid}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy ? mergeIds(ariaLabelledBy, valueId) : undefined}
          aria-required={required ? true : undefined}
          className={joinClassNames(createComponentClassName("select", "trigger"), "rui-select__trigger")}
          disabled={disabled}
          id={triggerId}
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
          role="combobox"
          type="button"
        >
          <span className={joinClassNames(createComponentClassName("select", "value"), "rui-select__value")} id={valueId}>
            {visibleLabel}
          </span>
          <span
            aria-hidden="true"
            className={joinClassNames(createComponentClassName("select", "indicator"), "rui-select__indicator")}
          >
            ▾
          </span>
        </button>

        {name ? <input disabled={disabled} name={name} type="hidden" value={currentValue ?? ""} /> : null}

        {shouldRenderError ? (
          <div className={joinClassNames(createComponentClassName("select", "error"), "rui-select__error")} id={errorId} role="alert">
            {errorText}
          </div>
        ) : null}
      </div>

      {popup ? <Portal>{popup}</Portal> : null}
    </>
  );
});
