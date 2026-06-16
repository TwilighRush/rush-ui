import { forwardRef, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import type { ChangeEvent, ReactNode, TextareaHTMLAttributes } from "react";

import { createComponentClassName } from "../internal/component-class-name";
import { joinClassNames } from "../internal/join-class-names";
import "./textarea.less";

export type TextareaSize = "sm" | "md" | "lg";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export interface TextareaAutoSizeOptions {
  minRows?: number;
  maxRows?: number;
}

type NativeTextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "children" | "size">;

export interface TextareaProps extends NativeTextareaProps {
  size?: TextareaSize;
  invalid?: boolean;
  errorText?: ReactNode;
  suffix?: ReactNode;
  showCount?: boolean;
  autoSize?: boolean | TextareaAutoSizeOptions;
  onValueChange?: (value: string) => void;
}

function getTextareaValueText(value: NativeTextareaProps["value"] | NativeTextareaProps["defaultValue"]): string {
  if (Array.isArray(value)) {
    return value.join("");
  }

  return value == null ? "" : String(value);
}

function getPositiveRowCount(value: number | undefined): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }

  return Math.max(1, Math.floor(value));
}

function getAutoSizeOptions(autoSize: TextareaProps["autoSize"]): TextareaAutoSizeOptions | undefined {
  if (!autoSize) {
    return undefined;
  }

  return autoSize === true ? {} : autoSize;
}

function getLineHeight(textarea: HTMLTextAreaElement): number {
  const styles = window.getComputedStyle(textarea);
  const lineHeight = Number.parseFloat(styles.lineHeight);

  if (Number.isFinite(lineHeight)) {
    return lineHeight;
  }

  const fontSize = Number.parseFloat(styles.fontSize);
  return Number.isFinite(fontSize) ? fontSize * 1.5 : 22;
}

function getBlockPadding(textarea: HTMLTextAreaElement): number {
  const styles = window.getComputedStyle(textarea);
  const paddingTop = Number.parseFloat(styles.paddingTop);
  const paddingBottom = Number.parseFloat(styles.paddingBottom);

  return (Number.isFinite(paddingTop) ? paddingTop : 0) + (Number.isFinite(paddingBottom) ? paddingBottom : 0);
}

function syncTextareaAutoHeight(textarea: HTMLTextAreaElement, autoSize: TextareaProps["autoSize"]) {
  const options = getAutoSizeOptions(autoSize);

  if (!options) {
    textarea.style.removeProperty("height");
    textarea.style.removeProperty("overflow-y");
    return;
  }

  const minRows = getPositiveRowCount(options.minRows);
  const maxRows = getPositiveRowCount(options.maxRows);
  const lineHeight = getLineHeight(textarea);
  const blockPadding = getBlockPadding(textarea);
  const minHeight = minRows ? lineHeight * minRows + blockPadding : undefined;
  const maxHeight = maxRows ? lineHeight * maxRows + blockPadding : undefined;

  textarea.style.height = "auto";

  const measuredHeight = textarea.scrollHeight;
  const nextHeight = Math.max(minHeight ?? 0, maxHeight ? Math.min(measuredHeight, maxHeight) : measuredHeight);

  textarea.style.height = `${nextHeight}px`;
  textarea.style.overflowY = maxHeight && measuredHeight > maxHeight ? "auto" : "hidden";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    autoSize = false,
    className,
    defaultValue,
    disabled = false,
    errorText,
    id,
    invalid = false,
    maxLength,
    onChange,
    onValueChange,
    readOnly = false,
    showCount = false,
    size = "md",
    style,
    suffix,
    value,
    ...props
  },
  ref
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const generatedId = useId();
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(() => getTextareaValueText(defaultValue));
  const currentValue = isControlled ? getTextareaValueText(value) : uncontrolledValue;
  const valueLength = Array.from(currentValue).length;
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true" || ariaInvalid === "grammar" || ariaInvalid === "spelling";
  const shouldRenderError = isInvalid && Boolean(errorText);
  const errorId = shouldRenderError ? `${id ?? generatedId}-error` : undefined;
  const countId = showCount ? `${id ?? generatedId}-count` : undefined;
  const describedBy = [ariaDescribedBy, errorId, countId].filter(Boolean).join(" ") || undefined;
  const countText = typeof maxLength === "number" && maxLength >= 0 ? `${valueLength} / ${maxLength}` : String(valueLength);

  useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

  useIsomorphicLayoutEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    syncTextareaAutoHeight(textarea, autoSize);
  }, [autoSize, currentValue, size]);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    if (!isControlled) {
      setUncontrolledValue(event.currentTarget.value);
    }

    onChange?.(event);
    onValueChange?.(event.currentTarget.value);
  }

  return (
    <div
      className={joinClassNames("rui-textarea", createComponentClassName("textarea"), className)}
      data-auto-size={autoSize ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-show-count={showCount ? "" : undefined}
      data-size={size}
      style={style}
    >
      <span className={joinClassNames(createComponentClassName("textarea", "control"), "rui-textarea__control")}>
        <textarea
          {...props}
          ref={textareaRef}
          aria-describedby={describedBy}
          aria-invalid={invalid ? true : ariaInvalid}
          className={joinClassNames(createComponentClassName("textarea", "native"), "rui-textarea__native")}
          defaultValue={defaultValue}
          disabled={disabled}
          id={id}
          maxLength={maxLength}
          onChange={handleChange}
          readOnly={readOnly}
          value={value}
        />

        {suffix ? (
          <span aria-hidden="true" className={joinClassNames(createComponentClassName("textarea", "suffix"), "rui-textarea__suffix")}>
            {suffix}
          </span>
        ) : null}
      </span>

      {shouldRenderError || showCount ? (
        <div className={joinClassNames(createComponentClassName("textarea", "meta"), "rui-textarea__meta")}>
          {shouldRenderError ? (
            <div
              className={joinClassNames(createComponentClassName("textarea", "error"), "rui-textarea__error")}
              id={errorId}
              role="alert"
            >
              {errorText}
            </div>
          ) : null}

          {showCount ? (
            <div className={joinClassNames(createComponentClassName("textarea", "count"), "rui-textarea__count")} id={countId}>
              {countText}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});
