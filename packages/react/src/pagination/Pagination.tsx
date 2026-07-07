import { forwardRef, useId, useMemo } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";

import { createComponentClassName } from "../internal/component-class-name";
import { joinClassNames } from "../internal/join-class-names";
import { useControllableState } from "../internal/use-controllable-state";
import "./pagination.less";

export type PaginationSize = "sm" | "md" | "lg";

export interface PaginationTotalInfo {
  start: number;
  end: number;
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

type PaginationItem = number | "start-ellipsis" | "end-ellipsis";

interface PaginationBaseProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "onChange"> {
  total: number;
  pageSize?: number;
  siblingCount?: number;
  boundaryCount?: number;
  size?: PaginationSize;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: ReactNode;
  errorText?: ReactNode;
  showTotal?: boolean | ((info: PaginationTotalInfo) => ReactNode);
  previousAriaLabel?: string;
  nextAriaLabel?: string;
  getPageAriaLabel?: (page: number, selected: boolean) => string;
  onPageChange?: (page: number) => void;
}

export type PaginationProps = PaginationBaseProps &
  (
    | {
        page: number;
        defaultPage?: never;
      }
    | {
        page?: never;
        defaultPage?: number;
      }
  );

function normalizePositiveInteger(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(1, Math.floor(value));
}

function normalizeNonNegativeInteger(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.floor(value));
}

function normalizeTotal(total: number): number {
  return typeof total === "number" && Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0;
}

function clampPage(page: number, pageCount: number): number {
  if (!Number.isFinite(page)) {
    return 1;
  }

  return Math.min(Math.max(1, Math.floor(page)), pageCount);
}

function mergeIds(...ids: Array<string | undefined>): string | undefined {
  const mergedIds = ids
    .flatMap((value) => value?.split(/\s+/) ?? [])
    .filter(Boolean);

  return mergedIds.length > 0 ? Array.from(new Set(mergedIds)).join(" ") : undefined;
}

function getPaginationItems(pageCount: number, currentPage: number, siblingCount: number, boundaryCount: number): PaginationItem[] {
  const pages = new Set<number>();

  function addPage(page: number) {
    if (page >= 1 && page <= pageCount) {
      pages.add(page);
    }
  }

  for (let offset = 0; offset < boundaryCount; offset += 1) {
    addPage(1 + offset);
    addPage(pageCount - offset);
  }

  for (let page = currentPage - siblingCount; page <= currentPage + siblingCount; page += 1) {
    addPage(page);
  }

  if (pages.size === 0) {
    addPage(currentPage);
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b);
  const items: PaginationItem[] = [];
  let previousPage: number | undefined;

  sortedPages.forEach((page) => {
    if (previousPage !== undefined) {
      const gap = page - previousPage;

      if (gap === 2) {
        items.push(previousPage + 1);
      } else if (gap > 2) {
        items.push(page < currentPage ? "start-ellipsis" : "end-ellipsis");
      }
    }

    items.push(page);
    previousPage = page;
  });

  return items;
}

function defaultGetPageAriaLabel(page: number, selected: boolean): string {
  return selected ? `第 ${page} 页，当前页` : `前往第 ${page} 页`;
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    boundaryCount = 1,
    className,
    defaultPage = 1,
    disabled = false,
    errorText,
    getPageAriaLabel = defaultGetPageAriaLabel,
    id,
    loading = false,
    loadingText = "分页数据加载中",
    nextAriaLabel = "下一页",
    onKeyDown,
    onPageChange,
    page,
    pageSize = 10,
    previousAriaLabel = "上一页",
    showTotal = false,
    siblingCount = 1,
    size = "md",
    total,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const normalizedTotal = normalizeTotal(total);
  const normalizedPageSize = normalizePositiveInteger(pageSize, 10);
  const normalizedSiblingCount = normalizeNonNegativeInteger(siblingCount, 1);
  const normalizedBoundaryCount = normalizeNonNegativeInteger(boundaryCount, 1);
  const pageCount = Math.max(1, Math.ceil(normalizedTotal / normalizedPageSize));
  const [pageValue, setPageValue] = useControllableState({ value: page, defaultValue: defaultPage, onChange: onPageChange });
  const currentPage = clampPage(pageValue, pageCount);
  const isDisabled = disabled || loading;
  const shouldRenderError = Boolean(errorText);
  const shouldRenderLoading = loading && loadingText !== null && loadingText !== false;
  const loadingId = shouldRenderLoading ? `${baseId}-loading` : undefined;
  const errorId = shouldRenderError ? `${baseId}-error` : undefined;
  const describedBy = mergeIds(ariaDescribedBy, loadingId, errorId);
  const navigationLabel = ariaLabel ?? (ariaLabelledBy ? undefined : "分页");
  const start = normalizedTotal === 0 ? 0 : (currentPage - 1) * normalizedPageSize + 1;
  const end = normalizedTotal === 0 ? 0 : Math.min(currentPage * normalizedPageSize, normalizedTotal);
  const totalInfo: PaginationTotalInfo = {
    start,
    end,
    total: normalizedTotal,
    page: currentPage,
    pageSize: normalizedPageSize,
    pageCount
  };
  const totalContent = typeof showTotal === "function" ? showTotal(totalInfo) : `第 ${start}-${end} 条 / 共 ${normalizedTotal} 条`;
  const shouldRenderTotal = Boolean(showTotal) && totalContent !== null && totalContent !== false;
  const pageItems = useMemo(
    () => getPaginationItems(pageCount, currentPage, normalizedSiblingCount, normalizedBoundaryCount),
    [currentPage, normalizedBoundaryCount, normalizedSiblingCount, pageCount]
  );

  function goToPage(nextPage: number) {
    const clampedPage = clampPage(nextPage, pageCount);

    if (isDisabled || clampedPage === currentPage) {
      return;
    }

    setPageValue(clampedPage);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (!(event.target instanceof HTMLButtonElement)) {
      return;
    }

    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("[data-pagination-control]:not(:disabled)"));
    const currentIndex = buttons.indexOf(event.target);

    if (currentIndex < 0) {
      return;
    }

    let nextIndex = currentIndex;

    if (event.key === "ArrowLeft") {
      nextIndex = Math.max(0, currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      nextIndex = Math.min(buttons.length - 1, currentIndex + 1);
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = buttons.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    buttons[nextIndex]?.focus();
  }

  return (
    <nav
      {...props}
      ref={ref}
      aria-busy={loading || undefined}
      aria-describedby={describedBy}
      aria-label={navigationLabel}
      aria-labelledby={ariaLabelledBy}
      className={joinClassNames("rui-pagination", createComponentClassName("pagination"), className)}
      data-disabled={disabled ? "" : undefined}
      data-invalid={shouldRenderError ? "" : undefined}
      data-loading={loading ? "" : undefined}
      data-size={size}
      id={id}
      onKeyDown={handleKeyDown}
    >
      {shouldRenderTotal ? (
        <div className={joinClassNames(createComponentClassName("pagination", "summary"), "rui-pagination__summary")}>
          {totalContent}
        </div>
      ) : null}

      <ul className={joinClassNames(createComponentClassName("pagination", "list"), "rui-pagination__list")}>
        <li className={joinClassNames(createComponentClassName("pagination", "item"), "rui-pagination__item")}>
          <button
            aria-label={previousAriaLabel}
            className={joinClassNames(
              createComponentClassName("pagination", "button"),
              "rui-pagination__button",
              "rui-pagination__button--edge"
            )}
            data-pagination-control=""
            data-type="previous"
            disabled={isDisabled || currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
            type="button"
          >
            上一页
          </button>
        </li>

        {pageItems.map((item, index) => {
          if (typeof item !== "number") {
            return (
              <li
                aria-hidden="true"
                className={joinClassNames(createComponentClassName("pagination", "item"), "rui-pagination__item")}
                key={`${item}-${index}`}
              >
                <span className={joinClassNames(createComponentClassName("pagination", "ellipsis"), "rui-pagination__ellipsis")}>
                  ...
                </span>
              </li>
            );
          }

          const selected = item === currentPage;

          return (
            <li className={joinClassNames(createComponentClassName("pagination", "item"), "rui-pagination__item")} key={item}>
              <button
                aria-current={selected ? "page" : undefined}
                aria-label={getPageAriaLabel(item, selected)}
                className={joinClassNames(createComponentClassName("pagination", "button"), "rui-pagination__button")}
                data-pagination-control=""
                data-selected={selected ? "" : undefined}
                data-type="page"
                disabled={isDisabled}
                onClick={() => goToPage(item)}
                type="button"
              >
                {item}
              </button>
            </li>
          );
        })}

        <li className={joinClassNames(createComponentClassName("pagination", "item"), "rui-pagination__item")}>
          <button
            aria-label={nextAriaLabel}
            className={joinClassNames(
              createComponentClassName("pagination", "button"),
              "rui-pagination__button",
              "rui-pagination__button--edge"
            )}
            data-pagination-control=""
            data-type="next"
            disabled={isDisabled || currentPage >= pageCount}
            onClick={() => goToPage(currentPage + 1)}
            type="button"
          >
            下一页
          </button>
        </li>
      </ul>

      {shouldRenderLoading ? (
        <div
          className={joinClassNames(createComponentClassName("pagination", "feedback"), "rui-pagination__feedback")}
          data-variant="loading"
          id={loadingId}
          role="status"
        >
          <span aria-hidden="true" className={joinClassNames(createComponentClassName("pagination", "spinner"), "rui-pagination__spinner")} />
          <span>{loadingText}</span>
        </div>
      ) : null}

      {shouldRenderError ? (
        <div
          className={joinClassNames(createComponentClassName("pagination", "feedback"), "rui-pagination__feedback")}
          data-variant="error"
          id={errorId}
          role="alert"
        >
          {errorText}
        </div>
      ) : null}
    </nav>
  );
});
