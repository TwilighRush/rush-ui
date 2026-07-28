import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

import { Alert, Badge, Button, DropdownMenu, Empty, Pagination, Spinner, Table } from "@rush_ui/react";
import type { TableColumn, TableProps, TableRowKey, TableSortState } from "@rush_ui/react";
import type { Meta, StoryObj } from "@storybook/react";

type MemberStatus = "active" | "disabled" | "invited";

interface Member {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: MemberStatus;
  lastActive: string;
}

const members: Member[] = [
  {
    id: "member-1",
    name: "林一",
    email: "linyi@example.com",
    department: "平台研发",
    role: "管理员",
    status: "active",
    lastActive: "2026-07-10"
  },
  {
    id: "member-2",
    name: "周恬",
    email: "zhoutian@example.com",
    department: "客户成功",
    role: "编辑者",
    status: "invited",
    lastActive: "2026-07-09"
  },
  {
    id: "member-3",
    name: "陈屿",
    email: "chenyu@example.com",
    department: "数据产品",
    role: "只读成员",
    status: "active",
    lastActive: "2026-07-08"
  },
  {
    id: "member-4",
    name: "许棠",
    email: "xutang@example.com",
    department: "外部协作",
    role: "访客",
    status: "disabled",
    lastActive: "2026-06-28"
  },
  {
    id: "member-5",
    name: "沈知夏",
    email: "shenzhixia@example.com",
    department: "财务运营",
    role: "编辑者",
    status: "active",
    lastActive: "2026-07-07"
  }
];

const statusMeta = {
  active: { label: "正常", variant: "success" },
  disabled: { label: "已停用", variant: "default" },
  invited: { label: "待加入", variant: "warning" }
} as const;

const pageStyles = {
  color: "var(--rui-color-ink)",
  display: "grid",
  gap: "24px",
  margin: "0 auto",
  maxWidth: "1120px",
  padding: "32px 24px"
} satisfies CSSProperties;

const stackStyles = {
  display: "grid",
  gap: "24px",
  minWidth: 0
} satisfies CSSProperties;

const panelStyles = {
  background: "var(--rui-color-surface)",
  border: "1px solid var(--rui-color-border)",
  borderRadius: "var(--rui-radius-md)",
  display: "grid",
  gap: "16px",
  minWidth: 0,
  padding: "20px"
} satisfies CSSProperties;

const panelTitleStyles = {
  fontSize: "1rem",
  lineHeight: 1.4,
  margin: 0
} satisfies CSSProperties;

const mutedTextStyles = {
  color: "color-mix(in srgb, var(--rui-color-ink) 68%, transparent)",
  lineHeight: 1.6,
  margin: 0
} satisfies CSSProperties;

const memberCellStyles = {
  display: "grid",
  gap: "2px",
  minWidth: "11rem"
} satisfies CSSProperties;

const secondaryTextStyles = {
  color: "color-mix(in srgb, var(--rui-color-ink) 64%, transparent)",
  fontSize: "0.8125rem"
} satisfies CSSProperties;

const columns: readonly TableColumn<Member>[] = [
  {
    id: "name",
    header: "成员",
    sortable: true,
    sortAriaLabel: "按成员姓名排序",
    cell: (member) => (
      <div style={memberCellStyles}>
        <strong>{member.name}</strong>
        <span style={secondaryTextStyles}>{member.email}</span>
      </div>
    )
  },
  {
    id: "department",
    header: "部门",
    cell: (member) => member.department
  },
  {
    id: "role",
    header: "角色",
    cell: (member) => member.role
  },
  {
    id: "status",
    header: "状态",
    cell: (member) => {
      const meta = statusMeta[member.status];
      return <Badge variant={meta.variant}>{meta.label}</Badge>;
    }
  },
  {
    id: "lastActive",
    header: "最后活跃",
    sortable: true,
    sortAriaLabel: "按最后活跃时间排序",
    cell: (member) => member.lastActive
  }
];

const actionColumn: TableColumn<Member> = {
  id: "actions",
  header: "操作",
  align: "end",
  cell: (member) => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger aria-label={`${member.name}更多操作`}>操作</DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" aria-label={`${member.name}成员操作`}>
        <DropdownMenu.Item>编辑成员</DropdownMenu.Item>
        <DropdownMenu.Item>重发邀请</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item disabled={member.status === "disabled"}>停用成员</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
};

const columnsWithActions: readonly TableColumn<Member>[] = [...columns, actionColumn];

function getMemberKey(member: Member) {
  return member.id;
}

function getRowAriaLabel(member: Member, _rowIndex: number, selected: boolean) {
  return `${selected ? "取消选择" : "选择"}${member.name}`;
}

function getSelectAllAriaLabel(selected: boolean) {
  return selected ? "取消选择本页全部成员" : "选择本页全部成员";
}

function isGuestRowDisabled(member: Member) {
  return member.role === "访客";
}

function MemberTable(props: TableProps<Member>) {
  return <Table {...props} />;
}

const componentDescription = `
Table 用于后台列表、明细表和权限矩阵。v1 使用原生 table 语义，提供泛型列、稳定行 key、三档密度、状态插槽、行选择和受控排序意图，不内置请求、分页或数据排序。

可访问性说明：
- 使用原生 table、thead、tbody、th 和 td；通过 caption、aria-label 或 aria-labelledby 提供表格名称。
- 可排序表头在 th 上设置 aria-sort，排序入口是原生 button，Enter 和 Space 使用浏览器默认激活行为。
- 行选择和全选使用原生 checkbox；默认提供中文名称，也可通过 getter 使用业务对象名称。
- Tab 先进入横向滚动区域，再进入排序、选择和单元格内的业务控件；Table 不实现 role=grid 或方向键单元格导航。
- loading 设置 aria-busy，并禁用 Table 自己创建的排序与选择控件。
`;

const meta = {
  title: "组件/数据展示/Table",
  component: MemberTable,
  args: {
    caption: "工作区成员",
    columns,
    data: members,
    getRowKey: getMemberKey,
    size: "md"
  },
  argTypes: {
    columns: { control: false },
    data: { control: false },
    emptyContent: { control: false },
    errorContent: { control: false },
    getRowKey: { control: false },
    loadingContent: { control: false },
    onSortChange: { control: false },
    rowSelection: { control: false },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"]
    },
    sort: { control: false }
  },
  parameters: {
    docs: {
      description: {
        component: componentDescription
      }
    }
  }
} satisfies Meta<typeof MemberTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "默认表格",
  render: (args) => (
    <main style={pageStyles}>
      <MemberTable {...args} />
    </main>
  )
};

export const Densities: Story = {
  name: "三档密度",
  render: () => (
    <main style={pageStyles}>
      <div style={stackStyles}>
        <MemberTable caption="小尺寸密集成员表格" columns={columns} data={members.slice(0, 3)} getRowKey={getMemberKey} size="sm" />
        <MemberTable caption="中尺寸成员表格" columns={columns} data={members.slice(0, 3)} getRowKey={getMemberKey} size="md" />
        <MemberTable caption="大尺寸成员表格" columns={columns} data={members.slice(0, 3)} getRowKey={getMemberKey} size="lg" />
      </div>
    </main>
  )
};

export const AsyncStates: Story = {
  name: "加载、空态与错误",
  render: () => (
    <main style={pageStyles}>
      <div style={stackStyles}>
        <section aria-labelledby="table-loading-title" style={panelStyles}>
          <h2 id="table-loading-title" style={panelTitleStyles}>加载中</h2>
          <MemberTable
            caption="正在加载的成员表格"
            columns={columns}
            data={members}
            getRowKey={getMemberKey}
            loading
            onSortChange={() => undefined}
            rowSelection={{}}
            sort={null}
          />
        </section>

        <section aria-labelledby="table-empty-title" style={panelStyles}>
          <h2 id="table-empty-title" style={panelTitleStyles}>空结果</h2>
          <MemberTable
            caption="搜索结果成员表格"
            columns={columns}
            data={[]}
            emptyContent={
              <Empty
                actions={<Button variant="outline">清空筛选</Button>}
                description="没有成员匹配当前关键词和状态筛选。"
                size="sm"
                title="未找到匹配成员"
              />
            }
            getRowKey={getMemberKey}
          />
        </section>

        <section aria-labelledby="table-error-title" style={panelStyles}>
          <h2 id="table-error-title" style={panelTitleStyles}>请求失败</h2>
          <MemberTable
            caption="加载失败的成员表格"
            columns={columns}
            data={members}
            errorContent={
              <Alert actions={<Button size="sm" variant="outline">重新加载</Button>} title="成员数据加载失败" variant="error">
                网络连接暂时不可用，请稍后重试。
              </Alert>
            }
            getRowKey={getMemberKey}
          />
        </section>
      </div>
    </main>
  )
};

export const CustomLoading: Story = {
  name: "自定义加载内容",
  render: () => (
    <main style={pageStyles}>
      <MemberTable
        caption="正在同步权限的成员表格"
        columns={columns}
        data={members}
        getRowKey={getMemberKey}
        loading
        loadingContent={
          <div style={{ display: "flex", justifyContent: "center", padding: "40px 20px" }}>
            <Spinner label="正在同步成员权限" />
          </div>
        }
      />
    </main>
  )
};

export const RowSelection: Story = {
  name: "全选、半选与禁选行",
  render: () => (
    <main style={pageStyles}>
      <div style={stackStyles}>
        <p style={mutedTextStyles}>首行默认选中，因此表头处于半选状态；访客行保留在表格中，但不能参与当前页全选。</p>
        <MemberTable
          caption="可选择的工作区成员"
          columns={columns}
          data={members}
          getRowKey={getMemberKey}
          rowSelection={{
            defaultValue: ["member-1"],
            getRowAriaLabel,
            getSelectAllAriaLabel,
            isRowDisabled: isGuestRowDisabled
          }}
        />
      </div>
    </main>
  )
};

function ControlledSelectionExample() {
  const [selectedKeys, setSelectedKeys] = useState<TableRowKey[]>(["member-2"]);

  return (
    <main style={pageStyles}>
      <div style={stackStyles}>
        <p aria-live="polite" style={mutedTextStyles}>
          已选择：{selectedKeys.length > 0 ? selectedKeys.join("、") : "无"}
        </p>
        <MemberTable
          caption="受控选择成员表格"
          columns={columns}
          data={members}
          getRowKey={getMemberKey}
          rowSelection={{
            value: selectedKeys,
            getRowAriaLabel,
            getSelectAllAriaLabel,
            isRowDisabled: isGuestRowDisabled,
            onValueChange: setSelectedKeys
          }}
        />
      </div>
    </main>
  );
}

export const ControlledSelection: Story = {
  name: "受控行选择",
  render: () => <ControlledSelectionExample />
};

function ControlledSortingExample() {
  const [sort, setSort] = useState<TableSortState | null>(null);
  const sortedMembers = useMemo(() => {
    if (!sort) return members;

    const direction = sort.direction === "asc" ? 1 : -1;

    return [...members].sort((left, right) => {
      const result =
        sort.columnId === "name"
          ? left.name.localeCompare(right.name, "zh-CN")
          : left.lastActive.localeCompare(right.lastActive);

      return result * direction;
    });
  }, [sort]);
  const sortDescription = sort ? `${sort.columnId} / ${sort.direction === "asc" ? "升序" : "降序"}` : "未排序";

  return (
    <main style={pageStyles}>
      <div style={stackStyles}>
        <p aria-live="polite" style={mutedTextStyles}>当前排序：{sortDescription}</p>
        <MemberTable
          caption="受控排序成员表格"
          columns={columns}
          data={sortedMembers}
          getRowKey={getMemberKey}
          onSortChange={setSort}
          sort={sort}
        />
      </div>
    </main>
  );
}

export const ControlledSorting: Story = {
  name: "受控三态排序",
  render: () => <ControlledSortingExample />
};

function KeyboardExample() {
  const [sort, setSort] = useState<TableSortState | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<TableRowKey[]>([]);

  return (
    <main style={pageStyles}>
      <div style={stackStyles}>
        <div style={panelStyles}>
          <h2 style={panelTitleStyles}>键盘路径</h2>
          <p style={mutedTextStyles}>
            按 Tab 依次进入全选、排序、行选择和行操作；Space 切换 checkbox，Enter 或 Space 激活排序和菜单。方向键不在单元格之间移动焦点。
          </p>
        </div>
        <MemberTable
          caption="键盘操作成员表格"
          columns={columnsWithActions}
          data={members.slice(0, 3)}
          getRowKey={getMemberKey}
          onSortChange={setSort}
          rowSelection={{
            value: selectedKeys,
            getRowAriaLabel,
            getSelectAllAriaLabel,
            onValueChange: setSelectedKeys
          }}
          sort={sort}
        />
      </div>
    </main>
  );
}

export const KeyboardAndFocus: Story = {
  name: "键盘操作与焦点",
  render: () => <KeyboardExample />,
  play: ({ canvasElement }) => {
    canvasElement.querySelector<HTMLButtonElement>('button[aria-label="按成员姓名排序"]')?.focus();
  }
};

function AdminListExample() {
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<TableRowKey[]>([]);

  return (
    <main style={pageStyles}>
      <section aria-labelledby="member-list-title" style={panelStyles}>
        <header style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between" }}>
          <div>
            <h2 id="member-list-title" style={panelTitleStyles}>成员管理</h2>
            <p style={{ ...mutedTextStyles, marginTop: "4px" }}>维护工作区成员、角色和登录状态。</p>
          </div>
          <Button>邀请成员</Button>
        </header>

        <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between" }}>
          <span style={mutedTextStyles}>已选择 {selectedKeys.length} 位成员</span>
          <Button disabled={selectedKeys.length === 0} size="sm" variant="outline">批量调整角色</Button>
        </div>

        <MemberTable
          caption="工作区成员列表"
          columns={columnsWithActions}
          data={members}
          getRowKey={getMemberKey}
          rowSelection={{
            value: selectedKeys,
            getRowAriaLabel,
            getSelectAllAriaLabel,
            isRowDisabled: isGuestRowDisabled,
            onValueChange: setSelectedKeys
          }}
          size="sm"
        />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Pagination onPageChange={setPage} page={page} pageSize={5} showTotal total={38} />
        </div>
      </section>
    </main>
  );
}

export const AdminList: Story = {
  name: "后台列表组合",
  render: () => <AdminListExample />
};

export const NarrowViewport: Story = {
  name: "窄屏宽表格",
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    }
  },
  render: () => (
    <main style={{ ...pageStyles, maxWidth: "438px" }}>
      <div style={stackStyles}>
        <p style={mutedTextStyles}>容器内容宽度为 390px；表格保留列关系，并在内部 viewport 中横向滚动。</p>
        <div style={{ maxWidth: "390px", minWidth: 0, width: "100%" }}>
          <MemberTable
            caption="窄屏成员列表"
            columns={columnsWithActions}
            data={members}
            getRowKey={getMemberKey}
            rowSelection={{ getRowAriaLabel, getSelectAllAriaLabel }}
            size="sm"
            style={{ minWidth: "820px" }}
          />
        </div>
      </div>
    </main>
  )
};
