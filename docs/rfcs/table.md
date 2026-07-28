# Table RFC

## 状态

- 草案

## 摘要

`Table` 是 `@rush_ui/react` 的语义数据表格组件，用于后台列表页、明细表和权限矩阵。首版提供类型安全的列定义、稳定行标识、三档密度、加载/错误/空态插槽、行选择与纯受控排序，同时保持数据请求、分页和排序实现由业务层负责。

Table v1 是轻量语义表格，不是 DataGrid。组件以原生 `<table>` 为核心，不实现单元格焦点模型、虚拟滚动、列拖拽或内置请求。

## 目标

- 使用原生 `<table>`、`<thead>`、`<tbody>`、`<th>`、`<td>`。
- 通过泛型 `Table<T>` 提供类型安全的列与单元格渲染。
- 通过必填 `getRowKey` 获得稳定的 `string | number` 行标识，不使用数组索引作为隐式 key。
- 支持 `sm`、`md`、`lg` 三档密度。
- 支持 loading、error、empty 三类表体状态，并保留表头语义。
- 支持受控/非受控行选择、当前页全选、半选和禁选行。
- 支持纯受控三态排序事件，不在组件内部重排数据。
- 支持 `caption`、原生 table props、`className` 和指向 `<table>` 的 ref。
- 使用 Less、现有 token 和 CSS 变量，不新增依赖。
- 在窄容器中提供可聚焦的内部横向滚动区域，不把滚动 wrapper 变成公共 API。

## 非目标

- 不内置请求、缓存、筛选、分页状态或 URL 同步。
- 不实现虚拟滚动、固定列、列拖拽、列显隐或列宽拖动。
- 不实现复杂单元格编辑、树形数据、展开行或合并单元格 API。
- 不实现 `role="grid"`、方向键单元格导航、行 roving tabindex 或焦点陷阱。
- 不提供顶层 `disabled`。原生 table 没有禁用语义，Table 也无法可靠禁用自定义单元格中的业务控件。
- 不把内部 wrapper、状态网格或 DOM 层级暴露为公共契约。
- 不与具体业务数据结构绑定，也不复制完整 DataGrid / AntD Table API。

## 公共 API

```ts
type TableSize = "sm" | "md" | "lg";
type TableRowKey = string | number;
type TableColumnAlign = "start" | "center" | "end";
type TableSortDirection = "asc" | "desc";

interface TableSortState {
  columnId: string;
  direction: TableSortDirection;
}

interface TableColumn<T> {
  id: string;
  header: React.ReactNode;
  cell: (row: T, rowIndex: number) => React.ReactNode;
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

type TableRowSelection<T> = TableRowSelectionBase<T> &
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

interface TableProps<T> extends Omit<React.TableHTMLAttributes<HTMLTableElement>, "children"> {
  columns: readonly TableColumn<T>[];
  data: readonly T[];
  getRowKey: (row: T) => TableRowKey;
  caption?: React.ReactNode;
  size?: TableSize;
  loading?: boolean;
  loadingContent?: React.ReactNode;
  emptyContent?: React.ReactNode;
  errorContent?: React.ReactNode;
  rowSelection?: TableRowSelection<T>;
  sort?: TableSortState | null;
  onSortChange?: (sort: TableSortState | null) => void;
}
```

公共导出：

```ts
export { Table } from "@rush_ui/react";
export type {
  TableColumn,
  TableColumnAlign,
  TableProps,
  TableRowKey,
  TableRowSelection,
  TableSize,
  TableSortDirection,
  TableSortState
} from "@rush_ui/react";
```

## 列定义与行标识

- `columns` 是只读列数组。每列必须提供稳定且唯一的 `id`。
- `header` 是可见表头内容；`cell(row, rowIndex)` 渲染对应单元格。
- `cell` 直接接收完整泛型行对象，避免 `accessorKey` 把值类型退化成 `T[keyof T]` 联合类型。
- `align` 只控制文本对齐，不改变语义。
- `sortable` 表示该列支持排序。只有同时提供 `onSortChange` 时才渲染与表头内容相邻的独立排序按钮；只传 `sort` 仍可表达只读排序状态。
- `sortAriaLabel` 用于复杂表头或非文本表头。普通文本表头可以直接依赖按钮可见内容形成可访问名称。
- `getRowKey` 必填，返回 `string | number`。不公开使用 `React.Key`，避免不同 React 类型版本对 `bigint` 的差异。
- 行 key 必须在同一数据集合内唯一。数据重排后，选择状态仍按 key 保持，而不是按索引保持。

## 行选择

省略 `rowSelection` 时不渲染选择列；传入 `{}` 时进入默认空选的非受控模式。

- 受控模式：`value + onValueChange`。
- 非受控模式：`defaultValue + onValueChange`。
- `isRowDisabled` 禁止某一行被选择，使用原生 checkbox disabled 语义。
- `getRowAriaLabel` 为行 checkbox 提供业务化名称；默认名称为“选择第 N 行”或“取消选择第 N 行”。
- `getSelectAllAriaLabel` 为表头 checkbox 提供名称；默认名称为“选择本页全部行”或“取消选择本页全部行”。

全选只操作当前 `data` 中未被 `isRowDisabled` 禁用的行：

1. 当前可选行一个都未选时，表头 checkbox 未选中。
2. 当前可选行部分选中时，表头 checkbox 使用 `indeterminate` 和 `aria-checked="mixed"`。
3. 当前可选行全部选中时，表头 checkbox 选中。
4. 未全选或半选时点击表头 checkbox，补齐当前全部可选行。
5. 已全选时点击表头 checkbox，只移除当前可选行。
6. 当前页外 key、数据切换后暂时未知的 key，以及已经选中的禁选行 key 都必须保留。
7. `onValueChange` 只返回 key，不返回 `selectedRows`；跨页选择时当前 `data` 无法构造完整行对象。

`loading`、error 或 empty 状态下，Table 自身生成的表头选择 checkbox 清空半选/全选表现并使用原生 disabled，不能操作当前不可见的数据行。组件不提供顶层 `disabled`，因为自定义 `cell()` 可以包含任意业务控件，Table 无法承诺统一禁用它们。

## 受控排序

排序状态完全由 `sort` 控制。Table 只发送下一步排序意图：

1. 未排序列点击后发送 `{ columnId, direction: "asc" }`。
2. 当前升序列再次点击后发送 `{ columnId, direction: "desc" }`。
3. 当前降序列再次点击后发送 `null`。
4. 点击其他可排序列时从升序开始。

组件不得调用 `Array.prototype.sort()`、修改 `data` 顺序、发起请求或缓存结果。受控 `sort` 未更新时，组件视觉状态也不得自行变化。

可排序表头把 `header` 保留在 `<th>` 内，使用相邻的原生 `<button type="button">` 作为独立排序入口，避免复杂表头产生嵌套按钮或非法 DOM。当前排序列的 `<th scope="col">` 设置：

- `asc` → `aria-sort="ascending"`
- `desc` → `aria-sort="descending"`

非当前排序列不输出 `aria-sort`。`aria-sort` 放在 `<th>`，不放在内部按钮。

## 状态优先级

表体状态优先级固定为：

1. `loading`
2. 可渲染的 `errorContent`
3. `data.length === 0` 的 empty
4. data rows

所有状态都保留 `<thead>`，并在唯一的 `<tbody><tr><td colSpan>` 中渲染，避免非法 table DOM。

- `loadingContent` 未提供时渲染默认 Skeleton 表格占位和隐藏的 `role="status"` 文本。
- `emptyContent` 未提供时组合小尺寸 `Empty`，默认标题为“暂无数据”。
- `errorContent` 推荐传入 `Alert variant="error"`。Table 只承载插槽，不自动包裹 `role="alert"`，避免嵌套 live region。
- 插槽存在性按可渲染 ReactNode 判断，不使用简单 `Boolean()`；数字 `0` 和空字符串仍是合法插槽值。
- 状态单元格的 `colSpan` 等于数据列数加可选的选择列，最小为 `1`。

## DOM、ref 与扩展出口

DOM 结构保持原生表格：

```html
<div aria-label="成员列表横向滚动区域" class="rui-table-viewport" role="region" tabindex="0">
  <table class="rui-table">
    <caption>...</caption>
    <thead>...</thead>
    <tbody>...</tbody>
  </table>
</div>
```

- `ref` 指向 `<table>`。
- `className`、`style`、`id`、`aria-*`、`data-*` 和 table 原生事件都落到 `<table>`。
- 内部 viewport 只负责横向滚动并进入 Tab 顺序，不是公共 root，不接受独立 props，也不作为稳定选择器承诺。
- `caption` 渲染为真实 `<caption>`。
- 如果没有 `caption`、`aria-label` 或 `aria-labelledby`，Table 默认补充 `aria-label="数据表格"`。

## 键盘与焦点

- Table、行和单元格不进入 Tab 顺序；内部横向滚动 region 可聚焦，让没有其他交互控件的宽表格也能通过键盘滚动。
- Tab 先进入横向滚动 region，再按 DOM 顺序进入排序按钮、行选择 checkbox 和自定义单元格中的业务控件。
- Enter / Space 使用原生 button 行为激活排序。
- Space 使用原生 checkbox 行为切换选择。
- 禁选行与 loading 状态使用原生 disabled，不可聚焦、不可激活。
- 滚动 region 聚焦时，方向键使用浏览器原生横向滚动；不实现方向键单元格导航。
- 状态变化不主动移动焦点。筛选后为空、请求失败或数据刷新后的焦点策略由上层流程负责。

## 响应式与样式 token

Table 使用带名称、可聚焦的内部横向滚动 region 保证窄屏不撑破页面，纯键盘用户也可以在 region 聚焦时使用方向键滚动。组件不把列强制堆叠为卡片，也不隐藏数据列；业务可通过原生 `style={{ minWidth }}` 或外部样式为宽表格设定最小宽度。

建议私有变量：

```css
--rui-table-cell-padding-block
--rui-table-cell-padding-inline
--rui-table-font-size
--rui-table-header-bg
--rui-table-row-hover-bg
--rui-table-row-selected-bg
--rui-table-selection-width
```

映射原则：

- 表格背景使用 `--rui-color-surface`。
- 外框与分隔线使用 `--rui-color-border`。
- 表头使用低对比中性色层，不用大面积 accent。
- 选中行使用 `--rui-color-interaction-selected`，且 checkbox 状态提供非颜色表达。
- 排序按钮 focus 使用 `--rui-color-focus-ring`。
- 尺寸只改变字号、单元格 padding 和选择列宽，不改变语义。
- 动效限制在 160ms 左右的背景、颜色与焦点过渡，并尊重 `prefers-reduced-motion`。

## Stories

首版 Storybook 覆盖：

- 默认表格与泛型自定义单元格。
- `sm` / `md` / `lg` 三档密度，其中 `sm` 展示 dense 场景。
- loading、empty、error 插槽。
- 非受控与受控行选择、全选、半选、禁选行。
- 纯受控三态排序。
- 排序按钮、checkbox 和业务操作的键盘路径。
- 与 Pagination、Badge、DropdownMenu 组合的后台列表页。
- 390px 窄容器中的宽表格横向滚动。

## Tests

首版测试覆盖：

- 原生 table 语义、caption / aria 命名、thead / tbody / th / td 和 `scope="col"`。
- 泛型列、自定义 cell 与 data 顺序。
- ref、className、size 与原生属性透传。
- 受控/非受控选择、半选、全选、禁选行、页外 key 保留和 key 稳定性。
- 默认及自定义中文选择名称。
- 排序按钮、`aria-sort`、三态受控回调和不修改 data 顺序。
- Enter / Space 原生键盘激活。
- loading 的 `aria-busy`、status 与内建控件禁用。
- `loading > error > empty > data` 状态优先级。
- 状态行合法 DOM、正确 `colSpan`、Alert error 插槽与 Empty 插槽。
- axe 自动化无障碍检查和公共包导出。

## 与其他组件的边界

### Pagination

Pagination 负责页码导航，Table 不接收分页 props。列表页通过外部状态同时驱动 Table data 与 Pagination page。

### Empty / Skeleton / Spinner

Table 默认 empty 组合 Empty，默认 loading 使用 Skeleton。自定义 `loadingContent` 可以组合 Spinner；这些反馈组件不感知列、选择或排序状态。

### Alert

请求失败时通过 `errorContent` 组合 Alert。Alert 负责错误语义与操作，Table 只提供合法表体承载位置。

### Checkbox

Table 复用 Checkbox 的原生勾选、半选、disabled 和焦点语义，但选择 key 与全选规则由 Table 管理。

### Badge / DropdownMenu

Badge 和 DropdownMenu 通过 `cell()` 组合。Table 不识别状态类型，也不管理行操作菜单。

## 设计取舍

- 使用原生 table 而不是 grid，是为了让阅读与简单交互保持浏览器和辅助技术熟悉的语义。
- `cell(row)` 而不是 accessor 配置，换取更稳定的泛型推断与更小 API。
- `getRowKey` 必填，避免选择状态和 React key 随数据重排漂移。
- 选择支持双模式，排序只支持受控模式：选择是本地交互状态，排序通常会触发上层数据重排或请求。
- 不提供顶层 disabled，避免对自定义单元格做无法兑现的禁用承诺。
- error 使用插槽而不是字符串 prop，方便组合 Alert 的标题、说明和恢复动作。
- 内部横向滚动保留表格结构，在窄屏下不把数据关系拆成难以扫描的卡片。
