# Pagination 分页

`Pagination` 用于表格、列表和搜索结果底部的页码导航。组件负责页码计算、当前页语义、上一页/下一页、总数说明、加载和错误提示，不内置数据请求或 pageSize 选择器。

## 导入

```tsx
import { Pagination } from "@rush_ui/react";
```

## 基础用法

```tsx
<Pagination defaultPage={3} showTotal total={128} />
```

`total` 是总条数，`pageSize` 默认是 `10`，组件会计算总页数并在必要时显示省略页码。

## 受控用法

```tsx
const [page, setPage] = useState(1);

<Pagination page={page} onPageChange={setPage} total={128} />;
```

非受控模式使用 `defaultPage`：

```tsx
<Pagination defaultPage={4} onPageChange={(nextPage) => console.log(nextPage)} total={128} />;
```

受控模式只传 `page`，非受控模式只传 `defaultPage`。

## 状态

```tsx
<Pagination loading loadingText="成员列表刷新中" showTotal total={128} />

<Pagination errorText="当前页加载失败，请重试或返回上一页。" showTotal total={128} />
```

- `loading` 会设置 `aria-busy` 并禁用所有分页按钮。
- `errorText` 会渲染 `role="alert"` 提示，并追加到根节点 `aria-describedby`。

## API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `total` | `number` | 必填 | 数据总条数。非有限值会按 `0` 处理。 |
| `page` | `number` | `undefined` | 受控当前页。 |
| `defaultPage` | `number` | `1` | 非受控初始页。 |
| `pageSize` | `number` | `10` | 每页条数，用于计算总页数和总数说明。 |
| `siblingCount` | `number` | `1` | 当前页两侧显示的页码数量。 |
| `boundaryCount` | `number` | `1` | 首尾边界页码数量。 |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 控制按钮高度、字号和间距。 |
| `disabled` | `boolean` | `false` | 禁用分页交互。 |
| `loading` | `boolean` | `false` | 加载状态，禁用按钮并设置 `aria-busy`。 |
| `loadingText` | `ReactNode` | `"分页数据加载中"` | 加载状态提示。 |
| `errorText` | `ReactNode` | `undefined` | 错误提示内容。 |
| `showTotal` | `boolean \| ((info: PaginationTotalInfo) => ReactNode)` | `false` | 是否展示总数说明，或自定义总数文案。 |
| `previousAriaLabel` | `string` | `"上一页"` | 上一页按钮可访问名称。 |
| `nextAriaLabel` | `string` | `"下一页"` | 下一页按钮可访问名称。 |
| `getPageAriaLabel` | `(page: number, selected: boolean) => string` | 内置中文标签 | 生成页码按钮可访问名称。 |
| `onPageChange` | `(page: number) => void` | `undefined` | 页码变化回调。当前页重复点击不会触发。 |

组件同时继承除 `children` 和 `onChange` 外的 `React.HTMLAttributes<HTMLElement>`，可以使用 `id`、`aria-*`、`data-*`、`className` 和 `style`。`ref` 指向根 `HTMLElement`，根节点渲染为 `<nav>`。

### PaginationTotalInfo

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `start` | `number` | 当前页起始条目序号；空数据为 `0`。 |
| `end` | `number` | 当前页结束条目序号；空数据为 `0`。 |
| `total` | `number` | 归一化后的总条数。 |
| `page` | `number` | 归一化后的当前页。 |
| `pageSize` | `number` | 归一化后的每页条数。 |
| `pageCount` | `number` | 总页数，最小为 `1`。 |

## 键盘行为

- `Tab`：按页面顺序进入可用分页按钮。
- `Enter` / `Space`：激活当前聚焦按钮，切换到目标页。
- `ArrowLeft` / `ArrowRight`：在可用分页按钮之间移动焦点，不直接切换页码。
- `Home` / `End`：移动到第一个或最后一个可用分页按钮。

## 可访问性

- 根节点是 `<nav>`，默认 `aria-label="分页"`；如果传入 `aria-labelledby`，不会再生成默认 `aria-label`。
- 当前页按钮设置 `aria-current="page"`，并保留可聚焦状态。
- 页码省略号是装饰内容，设置 `aria-hidden="true"`。
- 上一页、下一页和 loading / disabled 状态使用原生 `button disabled`。
- `loading` 状态使用 `role="status"` 提示，`errorText` 使用 `role="alert"` 提示。
- 颜色不是唯一状态表达：当前页同时有 `aria-current`、深色背景和文字对比；错误态有文本提示。

## 设计边界

- `Pagination` 不负责数据请求、缓存、排序、筛选或 Table 状态管理。
- v1 不内置 pageSize 切换器；需要时可在外部组合 `Select`。
- v1 不内置跳页输入框，避免扩大 API 和校验边界。
- 页码超出范围时会在展示层夹取到可用范围，但受控值仍由外部状态负责。
