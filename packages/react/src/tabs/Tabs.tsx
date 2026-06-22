/* eslint-disable react-refresh/only-export-components */
import { createContext, forwardRef, useContext, useId } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, KeyboardEvent } from "react";

import { createComponentClassName } from "../internal/component-class-name";
import { joinClassNames } from "../internal/join-class-names";
import { useControllableState } from "../internal/use-controllable-state";
import "./tabs.less";

export type TabsOrientation = "horizontal" | "vertical";
export type TabsActivationMode = "automatic" | "manual";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  orientation: TabsOrientation;
  activationMode: TabsActivationMode;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string) {
  const context = useContext(TabsContext);
  if (!context) throw new Error(`${component} 必须在 Tabs.Root 内使用。`);
  return context;
}

function valueId(value: string) {
  return encodeURIComponent(value).split("%").join("-");
}

interface TabsSharedRootProps extends HTMLAttributes<HTMLDivElement> {
  onValueChange?: (value: string) => void;
  orientation?: TabsOrientation;
  activationMode?: TabsActivationMode;
}

export type TabsRootProps = TabsSharedRootProps & (
  | { value: string; defaultValue?: never }
  | { value?: never; defaultValue: string }
);

const TabsRoot = forwardRef<HTMLDivElement, TabsRootProps>(function TabsRoot(
  {
    activationMode = "automatic",
    children,
    className,
    defaultValue,
    onValueChange,
    orientation = "horizontal",
    value: valueProp,
    ...props
  },
  ref
) {
  const [value, setValue] = useControllableState({ value: valueProp, defaultValue: defaultValue ?? "", onChange: onValueChange });
  const baseId = useId();

  return (
    <TabsContext.Provider value={{ value, setValue, orientation, activationMode, baseId }}>
      <div
        {...props}
        ref={ref}
        className={joinClassNames("rui-tabs", createComponentClassName("tabs"), className)}
        data-orientation={orientation}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
});

export type TabsListProps = HTMLAttributes<HTMLDivElement>;

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList({ className, ...props }, ref) {
  const context = useTabsContext("Tabs.List");
  return (
    <div
      {...props}
      ref={ref}
      aria-orientation={context.orientation}
      className={joinClassNames("rui-tabs__list", createComponentClassName("tabs", "list"), className)}
      role="tablist"
    />
  );
});

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { className, disabled = false, onClick, onKeyDown, type = "button", value, ...props },
  ref
) {
  const context = useTabsContext("Tabs.Trigger");
  const selected = context.value === value;

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const list = event.currentTarget.closest('[role="tablist"]');
    const tabs = Array.from(list?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? []);
    const currentIndex = tabs.indexOf(event.currentTarget);
    const previousKeys = context.orientation === "horizontal" ? ["ArrowLeft"] : ["ArrowUp"];
    const nextKeys = context.orientation === "horizontal" ? ["ArrowRight"] : ["ArrowDown"];
    let nextIndex = currentIndex;

    if (previousKeys.includes(event.key)) nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (nextKeys.includes(event.key)) nextIndex = (currentIndex + 1) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    const nextTab = tabs[nextIndex];
    nextTab?.focus();

    if (context.activationMode === "automatic") {
      const nextValue = nextTab?.dataset.value;
      if (nextValue) context.setValue(nextValue);
    }
  }

  return (
    <button
      {...props}
      ref={ref}
      aria-controls={`${context.baseId}-panel-${valueId(value)}`}
      aria-selected={selected}
      className={joinClassNames("rui-tabs__trigger", createComponentClassName("tabs", "trigger"), className)}
      data-state={selected ? "active" : "inactive"}
      data-value={value}
      disabled={disabled}
      id={`${context.baseId}-tab-${valueId(value)}`}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) context.setValue(value);
      }}
      onKeyDown={handleKeyDown}
      role="tab"
      tabIndex={selected ? 0 : -1}
      type={type}
    />
  );
});

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  forceMount?: boolean;
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { children, className, forceMount = false, value, ...props },
  ref
) {
  const context = useTabsContext("Tabs.Content");
  const selected = context.value === value;

  if (!selected && !forceMount) return null;

  return (
    <div
      {...props}
      ref={ref}
      aria-labelledby={`${context.baseId}-tab-${valueId(value)}`}
      className={joinClassNames("rui-tabs__content", createComponentClassName("tabs", "content"), className)}
      data-state={selected ? "active" : "inactive"}
      hidden={!selected}
      id={`${context.baseId}-panel-${valueId(value)}`}
      role="tabpanel"
      tabIndex={0}
    >
      {children}
    </div>
  );
});

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent
};
