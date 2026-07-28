import { createRef, useState } from "react";

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Alert } from "../alert";
import { Table } from "./Table";
import type { TableColumn, TableSortState } from "./Table";

interface Member {
  id: number;
  name: string;
  role: string;
  locked?: boolean;
}

const members = [
  { id: 1, name: "张三", role: "管理员" },
  { id: 2, locked: true, name: "李四", role: "编辑者" },
  { id: 3, name: "王五", role: "访客" }
] satisfies Member[];

const columns = [
  {
    cell: (member: Member) => member.name,
    header: "姓名",
    id: "name",
    sortAriaLabel: "按姓名排序",
    sortable: true
  },
  {
    align: "center",
    cell: (member: Member) => member.role,
    header: "角色",
    id: "role",
    sortAriaLabel: "按角色排序",
    sortable: true
  }
] satisfies readonly TableColumn<Member>[];

const getRowKey = (member: Member) => member.id;

describe("Table", () => {
  it("renders native table semantics, caption, headers and cells", () => {
    render(<Table caption="成员列表" columns={columns} data={members} getRowKey={getRowKey} />);

    const table = screen.getByRole("table", { name: "成员列表" });
    const headers = within(table).getAllByRole("columnheader");

    expect(table.tagName).toBe("TABLE");
    expect(table).not.toHaveAttribute("role");
    expect(screen.queryByRole("grid")).toBeNull();
    expect(within(table).getByRole("caption", { name: "成员列表" })).toBeInTheDocument();
    expect(table.querySelector("thead")).toBeInTheDocument();
    expect(table.querySelector("tbody")).toBeInTheDocument();
    expect(headers).toHaveLength(2);
    headers.forEach((header) => expect(header).toHaveAttribute("scope", "col"));
    expect(within(table).getAllByRole("row")).toHaveLength(4);
    expect(within(table).getAllByRole("cell")).toHaveLength(6);
    expect(within(table).getByRole("cell", { name: "张三" })).toBeInTheDocument();
    expect(within(table).getByRole("cell", { name: "管理员" })).toBeInTheDocument();
  });

  it("renders typed custom cells with row indexes and preserves data order", () => {
    const customColumns = [
      {
        cell: (member: Member, rowIndex: number) => (
          <button type="button">{`${rowIndex + 1}. ${member.name}`}</button>
        ),
        header: "成员",
        id: "member"
      }
    ] satisfies readonly TableColumn<Member>[];

    render(<Table caption="成员顺序" columns={customColumns} data={[members[2], members[0]]} getRowKey={getRowKey} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons.map((button) => button.textContent)).toEqual(["1. 王五", "2. 张三"]);
  });

  it("forwards the table ref, className, size and native attributes", () => {
    const ref = createRef<HTMLTableElement>();

    render(
      <Table
        aria-describedby="member-table-help"
        aria-label="成员数据"
        className="custom-table"
        columns={columns}
        data={members}
        data-track="members"
        getRowKey={getRowKey}
        ref={ref}
        size="sm"
      />
    );

    const table = screen.getByRole("table", { name: "成员数据" });
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
    expect(ref.current).toBe(table);
    expect(table).toHaveClass("custom-table");
    expect(table).toHaveAttribute("aria-describedby", "member-table-help");
    expect(table).toHaveAttribute("data-track", "members");
    expect(table).toHaveAttribute("data-size", "sm");
  });

  it("provides a default accessible name when no caption or aria label is supplied", () => {
    render(<Table columns={columns} data={members} getRowKey={getRowKey} />);

    expect(screen.getByRole("table", { name: "数据表格" })).toBeInTheDocument();
  });

  it("supports uncontrolled row selection", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <Table
        caption="成员列表"
        columns={columns}
        data={members}
        getRowKey={getRowKey}
        rowSelection={{ defaultValue: [1], onValueChange: handleValueChange }}
      />
    );

    expect(screen.getByRole("checkbox", { name: "取消选择第 1 行" })).toBeChecked();
    const thirdRowCheckbox = screen.getByRole("checkbox", { name: "选择第 3 行" });

    await user.click(thirdRowCheckbox);

    expect(screen.getByRole("checkbox", { name: "取消选择第 3 行" })).toBeChecked();
    expect(handleValueChange).toHaveBeenLastCalledWith([1, 3]);
  });

  it("keeps controlled row selection tied to value", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <Table
        caption="成员列表"
        columns={columns}
        data={members}
        getRowKey={getRowKey}
        rowSelection={{ onValueChange: handleValueChange, value: [1] }}
      />
    );

    const thirdRowCheckbox = screen.getByRole("checkbox", { name: "选择第 3 行" });
    await user.click(thirdRowCheckbox);

    expect(handleValueChange).toHaveBeenCalledWith([1, 3]);
    expect(thirdRowCheckbox).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "选择第 3 行" })).toBe(thirdRowCheckbox);
  });

  it("exposes mixed state when only some selectable rows are selected", () => {
    render(
      <Table
        caption="成员列表"
        columns={columns}
        data={members}
        getRowKey={getRowKey}
        rowSelection={{ defaultValue: [1], isRowDisabled: (member) => Boolean(member.locked) }}
      />
    );

    const selectAll = screen.getByRole<HTMLInputElement>("checkbox", { name: "选择本页全部行" });
    expect(selectAll.indeterminate).toBe(true);
    expect(selectAll).toHaveAttribute("aria-checked", "mixed");
    expect(selectAll).not.toBeChecked();
  });

  it("selects current eligible rows while preserving off-page and disabled keys", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <Table
        caption="成员列表"
        columns={columns}
        data={members}
        getRowKey={getRowKey}
        rowSelection={{
          defaultValue: [99, 2],
          isRowDisabled: (member) => Boolean(member.locked),
          onValueChange: handleValueChange
        }}
      />
    );

    const disabledSelectedRow = screen.getByRole("checkbox", { name: "取消选择第 2 行" });
    expect(disabledSelectedRow).toBeChecked();
    expect(disabledSelectedRow).toBeDisabled();

    await user.click(screen.getByRole("checkbox", { name: "选择本页全部行" }));

    expect(handleValueChange).toHaveBeenLastCalledWith([99, 2, 1, 3]);
    expect(screen.getByRole("checkbox", { name: "取消选择本页全部行" })).toBeChecked();

    await user.click(screen.getByRole("checkbox", { name: "取消选择本页全部行" }));

    expect(handleValueChange).toHaveBeenLastCalledWith([99, 2]);
    expect(disabledSelectedRow).toBeChecked();
  });

  it("disables row and select-all controls when no row is eligible", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <Table
        caption="锁定成员"
        columns={columns}
        data={[members[1]]}
        getRowKey={getRowKey}
        rowSelection={{ isRowDisabled: () => true, onValueChange: handleValueChange }}
      />
    );

    const selectAll = screen.getByRole("checkbox", { name: "当前页没有可选择的行" });
    const rowCheckbox = screen.getByRole("checkbox", { name: "选择第 1 行" });
    expect(selectAll).toBeDisabled();
    expect(rowCheckbox).toBeDisabled();

    await user.click(selectAll);
    await user.click(rowCheckbox);
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  it("keeps uncontrolled selection attached to stable row keys after reordering", () => {
    const { rerender } = render(
      <Table
        caption="成员列表"
        columns={columns}
        data={members}
        getRowKey={getRowKey}
        rowSelection={{ defaultValue: [1] }}
      />
    );

    rerender(
      <Table
        caption="成员列表"
        columns={columns}
        data={[members[2], members[0], members[1]]}
        getRowKey={getRowKey}
        rowSelection={{ defaultValue: [1] }}
      />
    );

    const selectedRow = screen.getByText("张三").closest("tr");
    expect(selectedRow).not.toBeNull();
    expect(within(selectedRow as HTMLTableRowElement).getByRole("checkbox")).toBeChecked();
    expect(selectedRow).toHaveAttribute("data-selected", "");
  });

  it("supports custom accessible labels for row and select-all controls", () => {
    render(
      <Table
        caption="成员列表"
        columns={columns}
        data={members}
        getRowKey={getRowKey}
        rowSelection={{
          defaultValue: [1],
          getRowAriaLabel: (member, _index, selected) => `${selected ? "取消选择" : "选择"}成员${member.name}`,
          getSelectAllAriaLabel: (selected) => (selected ? "取消选择全部成员" : "选择全部成员")
        }}
      />
    );

    expect(screen.getByRole("checkbox", { name: "取消选择成员张三" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "选择成员李四" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "选择全部成员" })).toHaveAttribute("aria-checked", "mixed");
  });

  it("uses native sort buttons and maps controlled sort state to aria-sort", () => {
    render(
      <Table
        caption="成员列表"
        columns={columns}
        data={members}
        getRowKey={getRowKey}
        onSortChange={() => undefined}
        sort={{ columnId: "name", direction: "asc" }}
      />
    );

    const nameSort = screen.getByRole("button", { name: "按姓名排序" });
    const roleSort = screen.getByRole("button", { name: "按角色排序" });
    expect(nameSort.tagName).toBe("BUTTON");
    expect(nameSort).toHaveAttribute("type", "button");
    expect(nameSort.closest("th")).toHaveAttribute("aria-sort", "ascending");
    expect(roleSort.closest("th")).not.toHaveAttribute("aria-sort");
  });

  it("keeps complex header controls separate from the sort button", () => {
    const complexColumns = [
      {
        cell: (member: Member) => member.name,
        header: <button aria-label="查看姓名字段说明" type="button">姓名</button>,
        id: "name",
        sortAriaLabel: "按姓名排序",
        sortable: true
      }
    ] satisfies readonly TableColumn<Member>[];

    render(
      <Table
        caption="成员列表"
        columns={complexColumns}
        data={members}
        getRowKey={getRowKey}
        onSortChange={() => undefined}
      />
    );

    const helpButton = screen.getByRole("button", { name: "查看姓名字段说明" });
    const sortButton = screen.getByRole("button", { name: "按姓名排序" });
    expect(sortButton).not.toContainElement(helpButton);
    expect(helpButton).not.toContainElement(sortButton);
    expect(helpButton.closest("th")).toBe(sortButton.closest("th"));
  });

  it("emits the controlled three-state sort cycle and starts another column ascending", async () => {
    const user = userEvent.setup();
    const handleSortChange = vi.fn();
    const renderTable = (sort: TableSortState | null) => (
      <Table
        caption="成员列表"
        columns={columns}
        data={members}
        getRowKey={getRowKey}
        onSortChange={handleSortChange}
        sort={sort}
      />
    );
    const { rerender } = render(renderTable(null));
    const nameSort = screen.getByRole("button", { name: "按姓名排序" });

    await user.click(nameSort);
    expect(handleSortChange).toHaveBeenNthCalledWith(1, { columnId: "name", direction: "asc" });
    expect(nameSort.closest("th")).not.toHaveAttribute("aria-sort");

    rerender(renderTable({ columnId: "name", direction: "asc" }));
    await user.click(nameSort);
    expect(handleSortChange).toHaveBeenNthCalledWith(2, { columnId: "name", direction: "desc" });

    rerender(renderTable({ columnId: "name", direction: "desc" }));
    await user.click(nameSort);
    expect(handleSortChange).toHaveBeenNthCalledWith(3, null);

    await user.click(screen.getByRole("button", { name: "按角色排序" }));
    expect(handleSortChange).toHaveBeenNthCalledWith(4, { columnId: "role", direction: "asc" });
  });

  it("does not reorder data when controlled sort state changes", async () => {
    const user = userEvent.setup();

    function ControlledTable() {
      const [sort, setSort] = useState<TableSortState | null>(null);

      return (
        <Table
          caption="成员列表"
          columns={columns}
          data={[members[2], members[0]]}
          getRowKey={getRowKey}
          onSortChange={setSort}
          sort={sort}
        />
      );
    }

    render(<ControlledTable />);
    await user.click(screen.getByRole("button", { name: "按姓名排序" }));

    expect(screen.getByRole("button", { name: "按姓名排序" }).closest("th")).toHaveAttribute("aria-sort", "ascending");
    const body = screen.getByRole("table", { name: "成员列表" }).querySelector("tbody");
    expect(body).not.toBeNull();
    expect(within(body as HTMLTableSectionElement).getAllByRole("row").map((row) => row.textContent)).toEqual([
      "王五访客",
      "张三管理员"
    ]);
  });

  it("activates native sort buttons with Tab, Enter and Space", async () => {
    const user = userEvent.setup();
    const handleSortChange = vi.fn();

    render(
      <Table
        caption="成员列表"
        columns={columns}
        data={members}
        getRowKey={getRowKey}
        onSortChange={handleSortChange}
        sort={null}
      />
    );

    const nameSort = screen.getByRole("button", { name: "按姓名排序" });
    await user.tab();
    expect(screen.getByRole("region", { name: "成员列表横向滚动区域" })).toHaveFocus();

    await user.tab();
    expect(nameSort).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(handleSortChange).toHaveBeenNthCalledWith(1, { columnId: "name", direction: "asc" });

    await user.keyboard(" ");
    expect(handleSortChange).toHaveBeenNthCalledWith(2, { columnId: "name", direction: "asc" });
  });

  it("marks loading semantics and prevents built-in interactions", async () => {
    const user = userEvent.setup();
    const handleSortChange = vi.fn();
    const handleValueChange = vi.fn();

    render(
      <Table
        caption="成员列表"
        columns={columns}
        data={members}
        getRowKey={getRowKey}
        loading
        onSortChange={handleSortChange}
        rowSelection={{ onValueChange: handleValueChange }}
        sort={null}
      />
    );

    const table = screen.getByRole("table", { name: "成员列表" });
    const sortButton = screen.getByRole("button", { name: "按姓名排序" });
    const selectAll = screen.getByRole("checkbox", { name: "当前状态下不可选择行" });
    expect(table).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveTextContent("数据加载中");
    expect(sortButton).toBeDisabled();
    expect(selectAll).toBeDisabled();
    expect(screen.queryByText("张三")).toBeNull();

    await user.click(sortButton);
    await user.click(selectAll);
    expect(handleSortChange).not.toHaveBeenCalled();
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  it("does not select hidden rows while an error state replaces the body", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <Table
        caption="成员列表"
        columns={columns}
        data={members}
        errorContent={<Alert title="成员加载失败" variant="error" />}
        getRowKey={getRowKey}
        rowSelection={{ defaultValue: [1], onValueChange: handleValueChange }}
      />
    );

    const selectAll = screen.getByRole<HTMLInputElement>("checkbox", { name: "当前状态下不可选择行" });
    expect(selectAll).toBeDisabled();
    expect(selectAll).not.toBeChecked();
    expect(selectAll.indeterminate).toBe(false);
    expect(screen.queryByRole("checkbox", { name: "取消选择第 1 行" })).toBeNull();

    await user.click(selectAll);
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  it("uses loading, error, empty and data precedence while retaining the header", () => {
    const renderTable = ({ data, errorContent, loading }: { data: readonly Member[]; errorContent?: string; loading?: boolean }) => (
      <Table
        caption="成员状态"
        columns={columns}
        data={data}
        emptyContent="空状态内容"
        errorContent={errorContent}
        getRowKey={getRowKey}
        loading={loading}
        loadingContent="加载状态内容"
      />
    );
    const { rerender } = render(renderTable({ data: members, errorContent: "错误状态内容", loading: true }));

    expect(screen.getByText("加载状态内容")).toBeInTheDocument();
    expect(screen.queryByText("错误状态内容")).toBeNull();
    expect(screen.queryByText("空状态内容")).toBeNull();
    expect(screen.queryByText("张三")).toBeNull();
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);

    rerender(renderTable({ data: members, errorContent: "错误状态内容" }));
    expect(screen.getByText("错误状态内容")).toBeInTheDocument();
    expect(screen.queryByText("张三")).toBeNull();

    rerender(renderTable({ data: [] }));
    expect(screen.getByText("空状态内容")).toBeInTheDocument();

    rerender(renderTable({ data: members }));
    expect(screen.getByText("张三")).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "成员状态" })).not.toHaveAttribute("aria-busy");
  });

  it("renders state content in a valid spanning table cell and composes Alert errors", () => {
    render(
      <Table
        caption="成员列表"
        columns={columns}
        data={[]}
        errorContent={
          <Alert title="成员加载失败" variant="error">
            请稍后重试。
          </Alert>
        }
        getRowKey={getRowKey}
        rowSelection={{}}
      />
    );

    const alert = screen.getByRole("alert");
    const stateCell = alert.closest("td");
    expect(alert).toHaveTextContent("成员加载失败");
    expect(stateCell).not.toBeNull();
    expect(stateCell).toHaveAttribute("colspan", "3");
    expect(stateCell?.parentElement?.tagName).toBe("TR");
    expect(stateCell?.parentElement?.parentElement?.tagName).toBe("TBODY");
  });

  it("renders the default Empty state and accepts numeric error content", () => {
    const { rerender } = render(<Table caption="成员列表" columns={columns} data={[]} getRowKey={getRowKey} />);

    expect(screen.getByText("暂无数据")).toBeInTheDocument();
    expect(screen.getByText("当前没有可展示的数据。")).toBeInTheDocument();

    rerender(<Table caption="成员列表" columns={columns} data={members} errorContent={0} getRowKey={getRowKey} />);
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.queryByText("张三")).toBeNull();
  });
});
