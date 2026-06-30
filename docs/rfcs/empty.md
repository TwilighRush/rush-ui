# Empty RFC

## 状态

- 草案

## 摘要

`Empty` 是 `@rush_ui/react` 的空状态组件，用于后台系统中的表格无数据、搜索无结果、配置缺失、列表初始态和权限范围为空等场景。它提供稳定的标题、说明、图标或插图插槽和操作区，帮助使用方表达当前区域为什么为空，以及用户下一步可以做什么。

本文档只定义 `Empty` 的组件设计与接口约束，不包含任何代码实现。

## 目标

- 覆盖表格空态、搜索无结果、配置缺失、首次创建和局部列表为空等后台高频场景。
- 提供标题、说明、图标或插图插槽、操作区。
- 支持 `size` 控制密度，适配表格、卡片、弹层和整页内容区。
- 支持 `className` 和原生 div props 作为扩展出口。
- 暴露指向根节点的 `ref`，便于测量、滚动定位和集成测试。
- 使用 CSS 变量接入现有 token，不新增依赖。
- 保持默认非交互语义，操作能力交给 `actions` 插槽中的 `Button`、链接或业务组件。

## 非目标

- 首版不提供大型营销插画、多套强视觉主题或复杂情绪化插画。
- 首版不内置“重新请求”“清空筛选”“创建资源”等业务动作逻辑。
- 首版不内置 loading、error、permission denied 或 async state 管理。
- 首版不提供表格、列表、分页或筛选容器能力。
- 首版不提供命令式空态服务或全局空态管理器。
- 首版不提供多态 `as` 渲染能力。

## 公共 API

```ts
type EmptySize = "sm" | "md" | "lg";

interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  size?: EmptySize;
}
```

`Empty` 作为单组件导出：

```ts
export { Empty } from "@rush_ui/react";
export type { EmptyProps, EmptySize } from "@rush_ui/react";
```

## Props 设计

### 保留原生 div props

组件应继承 `React.HTMLAttributes<HTMLDivElement>`，保留常见平台能力：

- `id`
- `role`
- `aria-*`
- `data-*`
- `className`
- `style`

默认根节点为非交互 `<div>`。组件不应把根节点放入 Tab 顺序，也不应拦截键盘事件。

### 自定义 props

- `title`
  作用：说明当前区域为空的核心原因。
  要求：必填，建议使用短句，例如“暂无成员”“未找到匹配结果”。

- `description`
  作用：补充解释空态原因或下一步建议。
  要求：可选，适合一到两句短说明，不应承载复杂文档。

- `icon`
  作用：替换默认装饰图标或插图。
  默认值：内部默认中性空态图标。
  约束：默认图标和自定义图标容器都应作为装饰处理，除非调用方显式传入可访问文本。传入 `null` 时隐藏图标区域。

- `actions`
  作用：放置主要操作，例如创建、重试、清空筛选或返回上级。
  约束：`actions` 只负责布局承载，不改变内部子元素语义；按钮、链接和 loading 状态由传入组件自己负责。

- `size`
  作用：控制整体间距、图标尺寸、标题字号和说明宽度。
  默认值：`md`

## size 方案

首版提供三种密度：

- `sm`
  用于表格内部、弹层内列表、紧凑卡片和下拉面板中的局部空态。

- `md`
  默认尺寸，用于页面内容区、普通列表和标准卡片。

- `lg`
  用于整页初始态、配置缺失页或需要更强引导的空白区域。

约束：

- `size` 不改变语义，只影响间距、字号和图标尺寸。
- `Empty` 应默认居中排列，但不强制占满父容器高度。
- 根节点宽度跟随父容器，文本区域需要有最大宽度，避免大屏上说明文字过长。
- `actions` 区域应支持单个按钮、按钮组和链接组合，并在窄宽度下自然换行。

## ARIA 与语义

- 默认根节点使用 `<div>`，不设置 `role="status"` 或 `aria-live`。
- `title` 应作为组件内部主要文本，并可用稳定类名或内部结构渲染为语义标题元素。
- 默认图标应设置 `aria-hidden="true"`，避免辅助技术读出无意义装饰。
- 自定义 `icon` 默认放在装饰容器中；如果图标本身表达必要信息，调用方应在 `title` 或 `description` 中提供等价文本。
- 当空态是异步加载后出现且需要播报时，调用方可以通过根节点原生 props 传入 `role="status"`、`aria-live="polite"` 或 `aria-labelledby`。
- `actions` 中的交互元素应保持自身语义，例如 `Button` 仍是按钮，链接仍是链接。

## 键盘与焦点

- `Empty` 本身不接管焦点，不进入 Tab 顺序。
- `Empty` 不注册全局键盘事件，也不拦截方向键、Enter 或 Escape。
- 键盘用户应能直接 Tab 到 `actions` 中的可交互元素。
- 如果空态替换了原本可交互区域，焦点管理由触发状态变化的上层流程负责；例如筛选后表格变空，不应由 `Empty` 强制移动焦点。
- 如果 `actions` 中包含多个按钮，应保持 DOM 顺序与视觉顺序一致。

## 样式 token

首版应通过 Less 和 CSS 变量实现，不新增依赖。

建议组件私有变量：

```css
--rui-empty-gap
--rui-empty-padding
--rui-empty-icon-size
--rui-empty-title-color
--rui-empty-title-font-size
--rui-empty-description-color
--rui-empty-description-font-size
--rui-empty-description-max-width
--rui-empty-actions-gap
```

建议映射到现有语义 token：

- 标题颜色使用 `--rui-color-ink`。
- 说明颜色使用 `--rui-color-ink-muted`。
- 图标颜色使用 `--rui-color-ink-subtle` 或中性边框/背景 token。
- 圆角使用现有 radius token。
- 间距使用现有 spacing 约定或组件内部固定阶梯。

约束：

- 默认视觉应安静、克制，适合后台内容区和表格区域。
- 图标不能成为理解空态的唯一信息来源。
- 长标题和长说明应换行，不应撑破父容器。
- `prefers-reduced-motion` 下不应依赖动效表达状态；首版默认不需要进入动效。

## Stories

首版 Storybook 应覆盖：

- 默认空态。
- 搜索无结果，包含“清空筛选”操作。
- 表格空态，小尺寸 `sm`。
- 初始创建态，包含主操作和次操作。
- 配置缺失态，自定义图标。
- 无图标空态，`icon={null}`。
- 长标题和长说明换行。
- 与 Table 首版 story 的组合空态；如果 Table 尚未实现，可先用语义 `table` 或 recipe 占位。

## Tests

首版测试应覆盖：

- 渲染必填 `title` 和可选 `description`。
- 默认图标存在且为装饰语义。
- `icon={null}` 时不渲染图标区域。
- 自定义 `icon`、`actions` 能正常渲染。
- `size` 生成稳定类名或 data 属性。
- `className` 合并到根节点。
- `ref` 指向根 `HTMLDivElement`。
- 原生 `aria-*`、`role`、`data-*` 能透传到根节点。
- `actions` 中按钮可获得焦点，不被组件拦截键盘事件。

## 与其他组件的边界

### Alert

`Alert` 用于表达提示、警告、错误或成功信息，通常说明某个事件或状态需要注意。`Empty` 用于表达一个区域没有可展示的数据或内容。搜索无结果可以用 `Empty`；接口失败或权限错误优先用 `Alert`，必要时在错误恢复流程中组合 `Empty` 的布局模式。

### Spinner

`Spinner` 表达加载中，适合异步请求尚未完成时使用。`Empty` 表达加载完成后没有内容。组件不应把 loading 状态内置到 `Empty`，避免空态和加载态混淆。

### Skeleton

`Skeleton` 表达首屏或局部内容的占位结构，适合数据形状已知但内容未返回的阶段。`Empty` 表达最终没有数据。Table、详情页或列表应在 loading 时显示 `Skeleton`，在完成且数据为空时显示 `Empty`。

### Table

`Table` 负责数据表格语义、列定义、行选择、排序和分页等行为。`Empty` 只负责空态内容展示。Table 首版可以通过 `empty` 或 `emptyState` 插槽组合 `Empty`，但 `Empty` 不应知道表格列、筛选条件、分页或请求状态。

## 设计取舍

- `title` 设为必填，是为了避免只出现图标或无意义空白区域。
- `actions` 使用 `ReactNode` 而不是命令式 props，保持组件不绑定业务动作。
- `icon` 支持 `null` 隐藏，是为了兼顾密集表格和弹层内的轻量空态。
- 首版只提供 `size`，不提供 `variant`，避免形成多套强视觉空态；搜索、创建、配置缺失等差异优先通过文案、图标和操作表达。
