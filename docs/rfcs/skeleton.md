# Skeleton RFC

## 状态

- 草案

## 摘要

`Skeleton` 是 `@rush_ui/react` 的结构化加载占位组件，用于内容形状已知但真实数据尚未返回的阶段。它适合表格行、详情字段、头像资料、卡片内容和列表区域，帮助用户理解页面布局将如何出现，同时避免在大块内容区域只显示孤立 Spinner。

本文档只定义 `Skeleton` 的组件设计与接口约束，不包含任何代码实现。

## 目标

- 覆盖文本行、块状区域和圆形头像/图标占位。
- 支持多行文本占位。
- 支持 `width`、`height` 快速匹配具体布局。
- 默认作为视觉占位，避免占位内容被辅助技术误读。
- 支持关闭动画，并尊重 `prefers-reduced-motion`。
- 支持 `className`、原生 div props 和 `forwardRef<HTMLDivElement>`。
- 使用 Less 与 CSS 变量接入现有 token，不新增依赖。

## 非目标

- 首版不自动推断真实布局。
- 首版不内置请求、延迟显示或状态切换。
- 首版不提供复杂组合模板；表格、详情页等组合优先通过 Story 和 recipe 沉淀。
- 首版不表示错误、空状态或权限状态；这些应由 `Alert`、`Empty` 等组件负责。
- 首版不提供彩色骨架或品牌装饰动画。

## 公共 API

```ts
type SkeletonVariant = "text" | "block" | "circle";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
  lines?: number;
  animated?: boolean;
}
```

导出：

```ts
export { Skeleton } from "@rush_ui/react";
export type { SkeletonProps, SkeletonVariant } from "@rush_ui/react";
```

## Props 设计

- `variant`
  作用：控制占位形状。
  默认值：`block`。

- `width` / `height`
  作用：快速设置根节点尺寸，用于贴合真实内容结构。
  约束：作为 inline style 输出，显式 props 优先于 `style` 中同名属性。

- `lines`
  作用：在 `variant="text"` 时渲染多行文本占位。
  默认值：`1`。
  约束：小于 1 或非有限数字时按 1 处理。

- `animated`
  作用：控制 shimmer 动画。
  默认值：`true`。

- 原生 div props
  组件继承 `React.HTMLAttributes<HTMLDivElement>`，支持 `id`、`role`、`aria-*`、`data-*`、`className`、`style` 和事件属性。

## ARIA 与语义

- 默认根节点为 `<div aria-hidden="true">`，只作为视觉占位。
- `Skeleton` 不默认设置 `role="status"`、`aria-live` 或可访问名称。
- 真实加载状态应由上层区域表达，例如：
  - 容器设置 `aria-busy="true"`。
  - 需要播报时配合 `Spinner` 或独立 `role="status"` 文本。
- 如果调用方确实需要让占位被辅助技术感知，可以通过原生 props 覆盖 `aria-hidden`、`role` 和 `aria-label`，但这不应作为常规用法。

## 键盘与焦点

- `Skeleton` 本身不进入 Tab 顺序。
- `Skeleton` 不注册键盘事件。
- 加载期间是否保留、禁用或隐藏原交互控件，由上层流程负责。

## 样式 token

建议组件私有变量：

```css
--rui-skeleton-bg
--rui-skeleton-highlight
--rui-skeleton-block-height
--rui-skeleton-text-height
--rui-skeleton-line-gap
```

视觉约束：

- 默认颜色来自 surface 与 border 的低对比混合，避免占位状态抢过真实内容。
- `text` 使用 pill 圆角，`block` 使用小圆角，`circle` 使用完整圆形。
- shimmer 动画仅表达等待，不应过亮、过快或带明显品牌色。
- `prefers-reduced-motion: reduce` 下停止动画。

## Stories

首版 Storybook 应覆盖：

- 默认块状占位。
- 多行文本占位。
- 头像和详情资料组合。
- 表格行占位。
- `animated={false}`。
- 窄容器中多行占位。

## Tests

首版测试应覆盖：

- 默认 decorative block 状态和 `aria-hidden`。
- `text`、`block`、`circle` 形状标记。
- 多行文本占位渲染数量。
- `animated={false}` 关闭动画标记。
- `width` / `height` 样式输出。
- `className`、`aria-*`、`data-*` 和原生属性透传。
- `ref` 指向根 `HTMLDivElement`。

## 与其他组件的边界

### Spinner

`Spinner` 表达加载动作或等待状态，并默认可被辅助技术感知。`Skeleton` 表达结构化占位，默认不播报。结构清晰的内容区优先用 Skeleton，短暂或无固定结构的等待可用 Spinner。

### Empty

`Empty` 表达加载结束后没有内容；`Skeleton` 表达加载尚未结束但内容结构已知。

### Table

`Table` 默认 loading 状态会组合 `Skeleton`，也允许通过 `loadingContent` 替换占位内容。`Skeleton` 不知道列定义、排序、选择或分页状态。
