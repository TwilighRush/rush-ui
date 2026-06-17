import { cloneElement, forwardRef, useId } from "react";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";

import { createComponentClassName } from "../internal/component-class-name";
import { joinClassNames } from "../internal/join-class-names";
import "./field.less";

export interface FieldControlProps {
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
  errorText?: ReactNode;
  id?: string;
  invalid?: boolean;
  required?: boolean;
}

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label?: ReactNode;
  helpText?: ReactNode;
  errorText?: ReactNode;
  invalid?: boolean;
  required?: boolean;
  requiredMark?: ReactNode;
  optionalText?: ReactNode;
  controlId?: string;
  children: ReactElement<FieldControlProps>;
}

function mergeDescribedBy(...ids: Array<string | undefined>): string | undefined {
  const mergedIds = ids
    .flatMap((value) => value?.split(/\s+/) ?? [])
    .filter(Boolean);

  return mergedIds.length > 0 ? Array.from(new Set(mergedIds)).join(" ") : undefined;
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  {
    children,
    className,
    controlId,
    errorText,
    helpText,
    invalid = false,
    label,
    optionalText,
    required = false,
    requiredMark = "*",
    ...props
  },
  ref
) {
  const generatedId = useId();
  const childProps = children.props;
  const resolvedControlId = controlId ?? childProps.id ?? `${generatedId}-control`;
  const labelId = label ? `${resolvedControlId}-label` : undefined;
  const helpId = helpText ? `${resolvedControlId}-help` : undefined;
  const describedBy = mergeDescribedBy(childProps["aria-describedby"], helpId);
  const labelledBy = mergeDescribedBy(childProps["aria-labelledby"], labelId);
  const isInvalid = invalid || Boolean(errorText) || Boolean(childProps.invalid);
  const control = cloneElement(children, {
    "aria-describedby": describedBy,
    "aria-labelledby": labelledBy,
    errorText: errorText ?? childProps.errorText,
    id: resolvedControlId,
    invalid: isInvalid,
    required: childProps.required ?? required
  });

  return (
    <div
      {...props}
      ref={ref}
      className={joinClassNames("rui-field", createComponentClassName("field"), className)}
      data-invalid={isInvalid ? "" : undefined}
      data-required={required ? "" : undefined}
    >
      {label ? (
        <div className={joinClassNames(createComponentClassName("field", "header"), "rui-field__header")}>
          <span className={joinClassNames(createComponentClassName("field", "labelGroup"), "rui-field__label-group")}>
            <label className={joinClassNames(createComponentClassName("field", "label"), "rui-field__label")} htmlFor={resolvedControlId}>
              <span className={joinClassNames(createComponentClassName("field", "labelText"), "rui-field__label-text")} id={labelId}>
                {label}
              </span>
            </label>

            {required ? (
              <span
                aria-hidden="true"
                className={joinClassNames(createComponentClassName("field", "requiredMark"), "rui-field__required-mark")}
              >
                {requiredMark}
              </span>
            ) : null}
          </span>

          {!required && optionalText ? (
            <span className={joinClassNames(createComponentClassName("field", "optionalText"), "rui-field__optional-text")}>
              {optionalText}
            </span>
          ) : null}
        </div>
      ) : null}

      {helpText ? (
        <div className={joinClassNames(createComponentClassName("field", "help"), "rui-field__help")} id={helpId}>
          {helpText}
        </div>
      ) : null}

      <div className={joinClassNames(createComponentClassName("field", "control"), "rui-field__control")}>{control}</div>
    </div>
  );
});
