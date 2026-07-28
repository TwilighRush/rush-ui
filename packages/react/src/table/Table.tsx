import { forwardRef } from "react";
import type {
  ForwardedRef,
  ReactElement,
  ReactNode,
  RefAttributes,
  TableHTMLAttributes
} from "react";

import { Checkbox } from "../checkbox";
import { Empty } from "../empty";
import { createComponentClassName } from "../internal/component-class-name";
import { joinClassNames } from "../internal/join-class-names";
import { useControllableState } from "../internal/use-controllable-state";
import { Skeleton } from "../skeleton";
import "./table.less";

export type TableSize = "sm" | "md" | "lg";
export type TableRowKey = string | number;
export type TableColumnAlign = "start" | "center" | "end";
export type TableSortDirection = "asc" | "desc";

export interface TableSortState {
  columnId: string;
  direction: TableSortDirection;
}

export interface TableColumn<T> {
  id: string;
  header: ReactNode;
  cell: (row: T, rowIndex: number) => ReactNode;
  align?: TableColumnAlign;
  sortable?: boolean;
  sortAriaLabel?: string;
}

interface TableRowSelectionBase<T> {
  onValueChange?: (value: TableRowKey[]) => void;
  isRowDisabled?: (row: T, rowIndex: number) => boolean;
  getRowAriaLabel?: (row: T, rowIndex: number, selected: boolean) => string;
  getSelectAllAriaLabel?: (selected: boolean) => string;
}

export type TableRowSelection<T> = TableRowSelectionBase<T> &
  (
    | {
        value: readonly TableRowKey[];
        defaultValue?: never;
      }
    | {
        value?: never;
        defaultValue?: readonly TableRowKey[];
      }
  );

export interface TableProps<T> extends Omit<TableHTMLAttributes<HTMLTableElement>, "children"> {
  columns: readonly TableColumn<T>[];
  data: readonly T[];
  getRowKey: (row: T) => TableRowKey;
  caption?: ReactNode;
  size?: TableSize;
  loading?: boolean;
  loadingContent?: ReactNode;
  emptyContent?: ReactNode;
  errorContent?: ReactNode;
  rowSelection?: TableRowSelection<T>;
  sort?: TableSortState | null;
  onSortChange?: (sort: TableSortState | null) => void;
}

interface TableRowMeta<T> {
  disabled: boolean;
  index: number;
  key: TableRowKey;
  row: T;
}

type TableBodyState = "empty" | "error" | "loading" | null;

function hasRenderableNode(node: ReactNode): boolean {
  return node !== undefined && node !== null && typeof node !== "boolean";
}

function getAriaSort(direction: TableSortDirection | undefined): "ascending" | "descending" | undefined {
  if (direction === "asc") return "ascending";
  if (direction === "desc") return "descending";
  return undefined;
}

function getNextSort(columnId: string, sort: TableSortState | null | undefined): TableSortState | null {
  if (sort?.columnId !== columnId) {
    return { columnId, direction: "asc" };
  }

  if (sort.direction === "asc") {
    return { columnId, direction: "desc" };
  }

  return null;
}

function getNodeText(node: ReactNode): string | undefined {
  return typeof node === "string" || typeof node === "number" ? String(node) : undefined;
}

function getSortButtonLabel<T>(column: TableColumn<T>): string {
  return column.sortAriaLabel ?? `按${getNodeText(column.header) ?? `${column.id}列`}排序`;
}

function DefaultLoadingContent({ columnCount }: { columnCount: number }) {
  const normalizedColumnCount = Math.max(1, columnCount);

  return (
    <div className={joinClassNames(createComponentClassName("table", "loading"), "rui-table__loading")}>
      <span className={joinClassNames(createComponentClassName("table", "srOnly"), "rui-table__sr-only")} role="status">
        数据加载中
      </span>
      <div aria-hidden="true" className={joinClassNames(createComponentClassName("table", "loadingGrid"), "rui-table__loading-grid")}>
        {[0, 1, 2].map((rowIndex) => (
          <div className={joinClassNames(createComponentClassName("table", "loadingRow"), "rui-table__loading-row")} key={rowIndex}>
            {Array.from({ length: normalizedColumnCount }, (_, columnIndex) => (
              <Skeleton
                className={joinClassNames(createComponentClassName("table", "loadingCell"), "rui-table__loading-cell")}
                height={14}
                key={columnIndex}
                variant="text"
                width={columnIndex % 3 === 0 ? "72%" : columnIndex % 3 === 1 ? "54%" : "64%"}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function TableImpl<T>(
  {
    "aria-busy": ariaBusy,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    caption,
    className,
    columns,
    data,
    emptyContent,
    errorContent,
    getRowKey,
    loading = false,
    loadingContent,
    onSortChange,
    rowSelection,
    size = "md",
    sort = null,
    ...props
  }: TableProps<T>,
  ref: ForwardedRef<HTMLTableElement>
) {
  const controlledSelectionValue = rowSelection?.value ? Array.from(rowSelection.value) : undefined;
  const defaultSelectionValue = Array.from(rowSelection?.defaultValue ?? []);
  const [selectedKeys, setSelectedKeys] = useControllableState<TableRowKey[]>({
    value: controlledSelectionValue,
    defaultValue: defaultSelectionValue,
    onChange: rowSelection?.onValueChange
  });
  const selectedKeySet = new Set(selectedKeys);
  const rowMeta: Array<TableRowMeta<T>> = data.map((row, index) => ({
    disabled: rowSelection?.isRowDisabled?.(row, index) ?? false,
    index,
    key: getRowKey(row),
    row
  }));
  const eligibleKeys = rowMeta.filter((item) => !item.disabled).map((item) => item.key);
  const eligibleSelectedCount = eligibleKeys.filter((key) => selectedKeySet.has(key)).length;
  const allRowsSelected = eligibleKeys.length > 0 && eligibleSelectedCount === eligibleKeys.length;
  const someRowsSelected = eligibleSelectedCount > 0 && !allRowsSelected;
  const hasSelection = rowSelection !== undefined;
  const totalColumnCount = columns.length + (hasSelection ? 1 : 0);
  const stateColumnSpan = Math.max(1, totalColumnCount);
  const bodyState: TableBodyState = loading
    ? "loading"
    : hasRenderableNode(errorContent)
      ? "error"
      : data.length === 0
        ? "empty"
        : null;
  const canSelectBodyRows = bodyState === null && eligibleKeys.length > 0;
  const renderedAllRowsSelected = canSelectBodyRows && allRowsSelected;
  const renderedSomeRowsSelected = canSelectBodyRows && someRowsSelected;
  const accessibleLabel = ariaLabel ?? (!ariaLabelledBy && !hasRenderableNode(caption) ? "数据表格" : undefined);
  const viewportLabel = `${ariaLabel ?? getNodeText(caption) ?? "数据表格"}横向滚动区域`;

  function updateRowSelection(item: TableRowMeta<T>, checked: boolean) {
    if (loading || item.disabled) return;

    const isSelected = selectedKeySet.has(item.key);

    if (checked && !isSelected) {
      setSelectedKeys([...selectedKeys, item.key]);
    } else if (!checked && isSelected) {
      setSelectedKeys(selectedKeys.filter((key) => key !== item.key));
    }
  }

  function updateAllRows() {
    if (bodyState !== null || eligibleKeys.length === 0) return;

    const eligibleKeySet = new Set(eligibleKeys);

    if (allRowsSelected) {
      setSelectedKeys(selectedKeys.filter((key) => !eligibleKeySet.has(key)));
      return;
    }

    const nextKeys = [...selectedKeys];
    const nextKeySet = new Set(nextKeys);

    eligibleKeys.forEach((key) => {
      if (!nextKeySet.has(key)) {
        nextKeys.push(key);
        nextKeySet.add(key);
      }
    });

    setSelectedKeys(nextKeys);
  }

  function renderStateBody(state: Exclude<TableBodyState, null>) {
    let content: ReactNode;

    if (state === "loading") {
      content = loadingContent === undefined ? <DefaultLoadingContent columnCount={stateColumnSpan} /> : loadingContent;
    } else if (state === "error") {
      content = errorContent;
    } else {
      content =
        emptyContent === undefined ? (
          <Empty description="当前没有可展示的数据。" icon={null} size="sm" title="暂无数据" />
        ) : (
          emptyContent
        );
    }

    return (
      <tr className={joinClassNames(createComponentClassName("table", "stateRow"), "rui-table__state-row")} data-state={state}>
        <td
          className={joinClassNames(createComponentClassName("table", "stateCell"), "rui-table__state-cell")}
          colSpan={stateColumnSpan}
        >
          {content}
        </td>
      </tr>
    );
  }

  return (
    <div
      aria-label={ariaLabelledBy ? undefined : viewportLabel}
      aria-labelledby={ariaLabelledBy}
      className={createComponentClassName("table", "viewport")}
      role="region"
      tabIndex={0}
    >
      <table
        {...props}
        ref={ref}
        aria-busy={loading ? true : ariaBusy}
        aria-label={accessibleLabel}
        aria-labelledby={ariaLabelledBy}
        className={joinClassNames("rui-table", createComponentClassName("table"), className)}
        data-loading={loading ? "" : undefined}
        data-size={size}
      >
        {hasRenderableNode(caption) ? (
          <caption className={joinClassNames(createComponentClassName("table", "caption"), "rui-table__caption")}>{caption}</caption>
        ) : null}

        <thead className={joinClassNames(createComponentClassName("table", "head"), "rui-table__head")}>
          <tr>
            {hasSelection ? (
              <th
                className={joinClassNames(
                  createComponentClassName("table", "headerCell"),
                  "rui-table__header-cell",
                  "rui-table__selection"
                )}
                scope="col"
              >
                <Checkbox
                  aria-label={
                    bodyState !== null
                      ? "当前状态下不可选择行"
                      : eligibleKeys.length === 0
                        ? "当前页没有可选择的行"
                        : rowSelection.getSelectAllAriaLabel?.(renderedAllRowsSelected) ??
                          (renderedAllRowsSelected ? "取消选择本页全部行" : "选择本页全部行")
                  }
                  checked={renderedAllRowsSelected}
                  disabled={!canSelectBodyRows}
                  indeterminate={renderedSomeRowsSelected}
                  onCheckedChange={updateAllRows}
                  size={size}
                />
              </th>
            ) : null}

            {columns.map((column) => {
              const activeDirection = sort?.columnId === column.id ? sort.direction : undefined;
              const canChangeSort = column.sortable && onSortChange !== undefined;

              return (
                <th
                  aria-sort={column.sortable ? getAriaSort(activeDirection) : undefined}
                  className={joinClassNames(createComponentClassName("table", "headerCell"), "rui-table__header-cell")}
                  data-align={column.align ?? "start"}
                  data-sortable={column.sortable ? "" : undefined}
                  key={column.id}
                  scope="col"
                >
                  {canChangeSort ? (
                    <div className={joinClassNames(createComponentClassName("table", "headerContent"), "rui-table__header-content")}>
                      <div className={joinClassNames(createComponentClassName("table", "headerLabel"), "rui-table__header-label")}>
                        {column.header}
                      </div>
                      <button
                        aria-label={getSortButtonLabel(column)}
                        className={joinClassNames(createComponentClassName("table", "sortButton"), "rui-table__sort-button")}
                        disabled={loading}
                        onClick={() => {
                          if (!loading) onSortChange(getNextSort(column.id, sort));
                        }}
                        type="button"
                      >
                        <span
                          aria-hidden="true"
                          className={joinClassNames(createComponentClassName("table", "sortIndicator"), "rui-table__sort-indicator")}
                          data-direction={activeDirection ?? "none"}
                        >
                          {activeDirection === "asc" ? "↑" : activeDirection === "desc" ? "↓" : "↕"}
                        </span>
                      </button>
                    </div>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className={joinClassNames(createComponentClassName("table", "body"), "rui-table__body")}>
          {bodyState
            ? renderStateBody(bodyState)
            : rowMeta.map((item) => {
                const selected = selectedKeySet.has(item.key);

                return (
                  <tr
                    className={joinClassNames(createComponentClassName("table", "row"), "rui-table__row")}
                    data-selected={selected ? "" : undefined}
                    data-selection-disabled={item.disabled ? "" : undefined}
                    key={item.key}
                  >
                    {hasSelection ? (
                      <td
                        className={joinClassNames(
                          createComponentClassName("table", "cell"),
                          "rui-table__cell",
                          "rui-table__selection"
                        )}
                      >
                        <Checkbox
                          aria-label={
                            rowSelection.getRowAriaLabel?.(item.row, item.index, selected) ??
                            `${selected ? "取消选择" : "选择"}第 ${item.index + 1} 行`
                          }
                          checked={selected}
                          disabled={loading || item.disabled}
                          onCheckedChange={(checked) => updateRowSelection(item, checked)}
                          size={size}
                          value={item.key}
                        />
                      </td>
                    ) : null}

                    {columns.map((column) => (
                      <td
                        className={joinClassNames(createComponentClassName("table", "cell"), "rui-table__cell")}
                        data-align={column.align ?? "start"}
                        key={column.id}
                      >
                        {column.cell(item.row, item.index)}
                      </td>
                    ))}
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
}

type TableComponent = {
  <T>(props: TableProps<T> & RefAttributes<HTMLTableElement>): ReactElement | null;
  displayName?: string;
};

export const Table = forwardRef(TableImpl) as TableComponent;
Table.displayName = "Table";
