# IconButton 图标按钮

`IconButton` 用于只以图标呈现的操作入口，例如表格行操作、工具栏按钮、刷新、筛选、关闭和更多操作。组件基于原生 `<button>` 渲染，并强制通过 `aria-label` 或 `aria-labelledby` 提供可访问名称。

## 导入

```tsx
import { IconButton } from "@rush_ui/react";
```

## 基础用法

```tsx
<IconButton aria-label="刷新列表" icon={<RefreshIcon />} />
<IconButton aria-label="删除" icon={<TrashIcon />} variant="outline" />
```

## API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `icon` | `ReactNode` | 必填 | 图标内容。默认作为装饰内容处理，不参与可访问名称。 |
| `aria-label` | `string` | 与 `aria-labelledby` 二选一 | 图标按钮的可访问名称。 |
| `aria-labelledby` | `string` | 与 `aria-label` 二选一 | 指向外部文本节点，作为图标按钮的可访问名称。 |
| `variant` | `"solid" \| "outline" \| "ghost" \| "subtle"` | `"ghost"` | 控制视觉层级，不改变按钮语义。 |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 控制按钮正方形尺寸和图标尺寸。 |
| `loading` | `boolean` | `false` | 展示加载状态，并使用原生 `disabled` 阻止重复触发。 |

组件同时继承除 `children` 以外的 `React.ButtonHTMLAttributes<HTMLButtonElement>`，可以直接使用 `type`、`disabled`、`onClick`、`aria-*`、`data-*`、`name`、`value`、`form` 和 `autoFocus` 等原生属性。

## 可访问性

- 必须提供 `aria-label` 或 `aria-labelledby`，因为纯图标本身通常不能形成稳定的可访问名称。
- 使用原生 `<button>`，默认支持 `Enter` 和 `Space` 键触发。
- `disabled` 和 `loading` 都会设置原生 `disabled`。
- `loading={true}` 时会设置 `aria-busy="true"`，按钮原有可访问名称保持不变。
- 图标内容会被设置为 `aria-hidden="true"`，不要依赖图标字符或图形名称表达按钮含义。

## 使用边界

- 有可见文案的操作优先使用 `Button`。
- 图标按钮不承载复杂菜单状态；菜单触发器应在后续 `Menu` 或复合组件中定义。
