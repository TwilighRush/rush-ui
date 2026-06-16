# Badge RFC

## 状态

- 草案

## 摘要

`Badge` 是 `@rush-ui/react` 的轻量状态标识组件，用于后台系统中的表格、详情页、流程节点、审批记录、筛选摘要和同步状态。它应提供稳定的状态视觉语言，同时保持 API 克制，不承担交互标签、通知角标或按钮职责。

本文档只定义 `Badge` 的组件设计与接口约束，不包含任何代码实现。

## 目标

- 提供统一的状态标识组件。
- 覆盖默认、成功、警告、错误、信息、处理中六种常见状态。
- 通过 `variant` 表达状态语义，通过 `size` 表达密度。
- 支持 `className` 作为样式扩展出口。
- 使用 CSS 变量和语义状态 token 实现主题能力。
- 保持非交互语义，避免引入额外键盘和焦点模型。
- 暴露指向根节点的 `ref`，方便测量、浮层定位或集成测试。

## 非目标

- 首版不提供可点击、可关闭或可选择能力。
- 首版不提供计数角标、头像角标或定位到目标元素的浮动徽标。
- 首版不提供图标插槽、前后缀插槽或自定义圆点开关。
- 首版不提供多态 `as` 渲染能力。

## 建议 API

```ts
type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "processing";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}
```

## Props 设计

### 保留原生 span props

组件应继承 `React.HTMLAttributes<HTMLSpanElement>`，保留常见平台能力：

- `id`
- `title`
- `role`
- `aria-*`
- `data-*`
- `className`
- `onClick`
- `onMouseEnter`

`Badge` 默认仍是非交互组件。即使允许事件透传，也不鼓励把它作为按钮使用；需要交互时应由调用方选择合适语义，或使用后续更合适的组件。

### 自定义 props

- `variant`
  作用：表达状态语义对应的视觉样式。
  默认值：`default`

- `size`
  作用：控制高度、字号、水平内边距、圆点尺寸和间距。
  默认值：`md`

## variant 方案

首版提供六种状态：

- `default`
  普通状态、未分类状态或中性筛选标识。

- `success`
  成功、已完成、已启用、已通过。

- `warning`
  待处理、待复核、风险提示、接近阈值。

- `error`
  失败、异常、驳回、不可用。

- `info`
  信息提示、已归档、系统说明或低风险状态。

- `processing`
  同步中、运行中、审批中、任务处理中。

约束：

- `variant` 表达状态语义，不表达按钮视觉层级。
- 所有状态必须有文本、背景、边框和圆点 token。
- 颜色不能成为唯一状态表达，使用方应传入可理解的 `children`。
- `processing` 可以有轻量动效，但必须尊重 `prefers-reduced-motion`。

## size 方案

首版提供：

- `sm`
  用于表格、筛选条件、密集列表。

- `md`
  默认尺寸，用于大多数状态展示。

- `lg`
  用于详情页摘要、流程节点或强调状态。

约束：

- `size` 应同时影响高度、字号、水平内边距、圆点尺寸和圆点间距。
- 组件应保持 `inline-flex` 行内布局，方便放入表格、段落和工具栏。
- 长文本应在容器宽度受限时截断，避免撑破布局。

## ref 行为

组件应使用 `React.forwardRef`。

- `ref` 指向根 `HTMLSpanElement`。
- `variant`、`size` 或文本变化不应改变 `ref` 指向。
- `ref` 可用于测量、浮层定位、滚动定位和测试。

## 可访问性要求

- 默认渲染非交互 `<span>`。
- 不默认设置 `role="status"`，避免静态列表中的状态被误当作 live region。
- 状态圆点应设置 `aria-hidden="true"`，避免辅助技术读出无意义装饰。
- 可访问名称默认来自文本内容。
- 状态变化需要主动播报时，由使用方显式传入 `role="status"`、`aria-live` 或 `aria-label`。
- `processing` 动效必须在 `prefers-reduced-motion: reduce` 下关闭。
- 组件不应拦截键盘事件，不应进入 Tab 顺序。

## 使用边界

- `Badge` 不替代 `Button`、`Tag`、`Chip`、`Alert` 或 `Notification`。
- 可交互的筛选项、可移除标签和可点击状态入口不属于首版范围。
- 组件不暴露内部圆点开关或图标插槽，避免 DOM 结构泄漏到公共 API。
- 需要完全自定义展示时，可以通过 `className` 覆盖样式或组合业务组件。
