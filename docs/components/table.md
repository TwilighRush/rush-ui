# Table 数据表格

`Table` 用于后台列表页、明细表和权限矩阵。组件使用原生 table 语义，负责类型安全的列渲染、密度、表体状态、行选择和排序意图，不负责请求、缓存、筛选或分页。

## 导入

```tsx
import { Table } from "@rush_ui/react";
import type { TableColumn, TableSortState } from "@rush_ui/react";
```

## 基础用法

```tsx
interface Member {
  id: number;
  name: string;
  role: string;
}

const columns = [
  {
    id: "name",
    header: "成员",
    cell: (member) => member.name
  },
  {
    id: "role",
    header: "角色",
    cell: (member) => member.role
  }
] satisfies readonly TableColumn<Member>[];

<Table
  caption="成员列表"
  columns={columns}
  data={members}
  getRowKey={(member) => member.id}
/>;
```

`getRowKey` 必须返回稳定且唯一的 `string | number`。数据重排后，React key 和选择状态都会继续按该值关联，而不是按数组索引关联。

## 自定义单元格

`cell(row, rowIndex)` 可以组合 Rush UI 或业务组件：

```tsx
const columns = [
  {
    id: "status",
    header: "状态",
    cell: (member: Member) => (
      <Badge variant={member.active ? "success" : "default"}>
        {member.active ? "已启用" : "已停用"}
      </Badge>
    )
  },
  {
    id: "actions",
    header: "操作",
    align: "end",
    cell: (member: Member) => <Button aria-label={`编辑${member.name}`}>编辑</Button>
  }
] satisfies readonly TableColumn<Member>[];
```

Table 不识别单元格内部业务语义，也不会禁用、移动焦点或修改传入控件。

## 密度

```tsx
<Table size="sm" {...props} />
<Table size="md" {...props} />
<Table size="lg" {...props} />
```

- `sm`：密集后台列表、弹层内表格。
- `md`：默认页面列表。
- `lg`：字段较少、需要更宽松阅读节奏的表格。

尺寸只改变字号、单元格 padding 和选择列宽，不改变语义或行为。

## 行选择

省略 `rowSelection` 时不渲染选择列；传入空对象时启用默认空选的非受控选择。

```tsx
<Table
  {...props}
  rowSelection={{
    defaultValue: [1],
    isRowDisabled: (member) => member.locked,
    getRowAriaLabel: (member, _index, selected) =>
      `${selected ? "取消选择" : "选择"}成员${member.name}`,
    onValueChange: (keys) => console.log(keys)
  }}
/>
```

受控模式：

```tsx
const [selectedKeys, setSelectedKeys] = useState<TableRowKey[]>([]);

<Table
  {...props}
  rowSelection={{
    value: selectedKeys,
    onValueChange: setSelectedKeys
  }}
/>;
```

选择规则：

- 表头 checkbox 只全选当前 `data` 中可选的行。
- 部分可选行已选时显示半选状态。
- 已选禁选行、当前页外 key 和数据切换后暂时未知的 key 会被保留。
- `isRowDisabled` 使用原生 checkbox disabled 语义。
- Table 不提供顶层 `disabled`，因为它无法可靠禁用自定义单元格中的业务控件。

## 受控排序

```tsx
const [sort, setSort] = useState<TableSortState | null>(null);

const columns = [
  {
    id: "name",
    header: "成员",
    cell: (member: Member) => member.name,
    sortable: true
  }
] satisfies readonly TableColumn<Member>[];

<Table {...props} columns={columns} sort={sort} onSortChange={setSort} />;
```

同一列的点击循环为：未排序 → 升序 → 降序 → 未排序。切换到另一列时从升序开始。

Table 不会排序 `data`。调用方应根据 `onSortChange` 更新请求参数或生成新的数据数组，再把结果传回 Table。

## 加载、空态和错误

```tsx
<Table loading {...props} />

<Table
  {...props}
  data={[]}
  emptyContent={<Empty description="调整筛选条件后重试。" title="未找到成员" />}
/>

<Table
  {...props}
  errorContent={
    <Alert title="成员列表加载失败" variant="error">
      请检查网络后重试。
    </Alert>
  }
/>
```

状态优先级：`loading > errorContent > empty > data`。

- 默认 loading 保留表头，渲染 Skeleton 占位，Table 设置 `aria-busy="true"`。
- 默认 empty 组合小尺寸 Empty。
- `errorContent` 推荐组合 Alert；Table 不会再自动添加 `role="alert"`。
- 自定义状态仍会渲染在合法的 `<tbody><tr><td colSpan>` 内。

## 与 Pagination 组合

```tsx
<div>
  <Table {...tableProps} />
  <Pagination page={page} total={total} onPageChange={setPage} />
</div>
```

Pagination 与 Table 保持独立。页码、pageSize、请求和总条数均由上层状态管理。

## API

### TableProps&lt;T&gt;

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `columns` | `readonly TableColumn<T>[]` | 必填 | 类型安全的列定义。 |
| `data` | `readonly T[]` | 必填 | 当前展示的行数据，顺序由调用方决定。 |
| `getRowKey` | `(row: T) => string \| number` | 必填 | 返回稳定且唯一的行 key。 |
| `caption` | `ReactNode` | `undefined` | 渲染真实 `<caption>` 并为表格命名。 |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 表格密度。 |
| `loading` | `boolean` | `false` | 显示加载体、设置 `aria-busy` 并禁用内建交互。 |
| `loadingContent` | `ReactNode` | 默认 Skeleton | 自定义加载状态内容。 |
| `emptyContent` | `ReactNode` | 默认 Empty | 自定义空态内容。 |
| `errorContent` | `ReactNode` | `undefined` | 错误插槽，推荐传 Alert。 |
| `rowSelection` | `TableRowSelection<T>` | `undefined` | 行选择配置；省略时不渲染选择列。 |
| `sort` | `TableSortState \| null` | `null` | 受控排序状态。 |
| `onSortChange` | `(sort: TableSortState \| null) => void` | `undefined` | 下一步排序意图回调。 |

组件同时继承除 `children` 外的 `React.TableHTMLAttributes<HTMLTableElement>`。`ref`、`className`、`style`、`id`、`aria-*`、`data-*` 和原生事件均落到 `<table>`。

### TableColumn&lt;T&gt;

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | 必填 | 稳定且唯一的列标识。 |
| `header` | `ReactNode` | 必填 | 表头可见内容。 |
| `cell` | `(row: T, rowIndex: number) => ReactNode` | 必填 | 单元格渲染函数。 |
| `align` | `"start" \| "center" \| "end"` | `"start"` | 表头与单元格对齐方式。 |
| `sortable` | `boolean` | `false` | 是否表达为可排序列。 |
| `sortAriaLabel` | `string` | `undefined` | 复杂表头的排序按钮可访问名称。 |

### TableRowSelection&lt;T&gt;

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `readonly TableRowKey[]` | 受控选中 key。与 `defaultValue` 互斥。 |
| `defaultValue` | `readonly TableRowKey[]` | 非受控初始选中 key。 |
| `onValueChange` | `(value: TableRowKey[]) => void` | 选择变化回调。 |
| `isRowDisabled` | `(row: T, rowIndex: number) => boolean` | 判断某行是否禁选。 |
| `getRowAriaLabel` | `(row, rowIndex, selected) => string` | 行 checkbox 可访问名称。 |
| `getSelectAllAriaLabel` | `(selected: boolean) => string` | 表头 checkbox 可访问名称。 |

### 排序类型

```ts
type TableSortDirection = "asc" | "desc";

interface TableSortState {
  columnId: string;
  direction: TableSortDirection;
}
```

## 键盘行为

- Tab：先进入横向滚动区域，再按 DOM 顺序进入排序按钮、行选择 checkbox 和单元格内业务控件。
- Enter / Space：使用原生 button 行为激活排序。
- Space：使用原生 checkbox 行为切换行选择或全选。
- disabled checkbox 与 loading 下的内建控件不可聚焦、不可激活。
- Table 不提供方向键单元格导航，也不给行或单元格添加 `tabIndex`。

## 可访问性

- 使用原生 table 结构，不使用 `role="grid"`。
- 表头使用 `<th scope="col">`。
- `caption` 是真实 caption；也可以通过原生 `aria-label` 或 `aria-labelledby` 命名。
- 三种命名方式都未提供时，默认使用 `aria-label="数据表格"`。
- 当前排序列的 `<th>` 使用 `aria-sort="ascending"` 或 `aria-sort="descending"`。
- 可排序表头内容与排序按钮相邻，避免复杂表头产生嵌套交互控件。
- 全选半选通过原生 checkbox、`indeterminate` 和 `aria-checked="mixed"` 表达。
- loading 设置 `aria-busy`，默认加载内容包含 `role="status"` 文本。
- 颜色不是选择和排序的唯一表达；checkbox、箭头和 ARIA 同时提供状态信息。

## 响应式

Table 内部使用带名称、可聚焦的横向滚动 region，窄屏不会把页面撑宽，纯键盘用户也可以在 region 聚焦时使用方向键滚动。宽表格可以通过原生 `style={{ minWidth: 760 }}` 或外部 class 设置最小宽度。首版不会自动隐藏列，也不会把每行重排为卡片。

## 设计边界

- 不内置请求、缓存、分页、筛选或数据排序。
- 不支持虚拟滚动、固定列、列拖拽、单元格编辑或展开行。
- 不实现 DataGrid 的方向键导航或焦点模型。
- 不提供顶层 disabled，也不管理自定义单元格控件。
- `errorContent`、`emptyContent`、`loadingContent` 是展示插槽，不是异步状态机。
