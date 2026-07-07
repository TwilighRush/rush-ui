# Skeleton 骨架屏

`Skeleton` 用于内容结构已知但真实数据尚未返回的占位状态，例如表格行、详情字段、头像资料、卡片内容和局部列表。它默认只是视觉占位，不承担加载播报。

## 导入

```tsx
import { Skeleton } from "@rush_ui/react";
```

## 基础用法

```tsx
<Skeleton height={96} />
```

默认 `variant="block"`，适合内容块、卡片区域和列表容器占位。

## 文本占位

```tsx
<Skeleton variant="text" width="60%" />
<Skeleton lines={3} variant="text" />
```

`lines` 用于多行文本占位，最后一行会更短，模拟真实段落节奏。

## 圆形占位

```tsx
<Skeleton variant="circle" />
```

`circle` 适合头像、图标或圆形状态点占位。可以通过 `width` 和 `height` 调整尺寸。

## 关闭动画

```tsx
<Skeleton animated={false} lines={3} variant="text" />
```

当页面已经有其他明确加载反馈，或需要减少视觉干扰时，可以关闭动画。组件样式同时尊重 `prefers-reduced-motion`。

## 与加载区域组合

```tsx
<section aria-busy="true" aria-label="成员详情加载中">
  <Skeleton variant="circle" />
  <Skeleton lines={3} variant="text" />
</section>
```

`Skeleton` 默认 `aria-hidden="true"`，加载状态由上层区域通过 `aria-busy`、`Spinner` 或 `role="status"` 文本表达。

## API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `"text" \| "block" \| "circle"` | `"block"` | 控制占位形状。 |
| `width` | `CSSProperties["width"]` | `undefined` | 设置根节点宽度。 |
| `height` | `CSSProperties["height"]` | `undefined` | 设置根节点高度。 |
| `lines` | `number` | `1` | `variant="text"` 时的文本行数。 |
| `animated` | `boolean` | `true` | 是否启用 shimmer 动画。 |
| `className` | `string` | `undefined` | 传递到根节点，作为样式扩展出口。 |

组件同时继承 `React.HTMLAttributes<HTMLDivElement>`，可以使用 `id`、`role`、`aria-*`、`data-*`、`style` 和事件属性等原生能力。显式传入的 `width` / `height` 会覆盖 `style` 中同名属性。

## 可访问性

- 默认渲染 `<div aria-hidden="true">`，避免占位内容被辅助技术误读。
- 默认不设置 `role="status"` 或 `aria-live`。
- 加载区域应由上层设置 `aria-busy="true"`，必要时配合 `Spinner` 或可见状态文本。
- 组件不接管焦点，也不注册键盘事件。
- `prefers-reduced-motion: reduce` 下动画停止。

## 设计边界

- `Skeleton` 表示“正在加载且结构已知”，不表示加载完成后的空状态。
- 错误、权限不足或危险提示优先使用 `Alert`。
- 表格、详情页和列表的复杂骨架组合先通过 Stories 和 recipe 沉淀，不在组件首版中内置模板。
