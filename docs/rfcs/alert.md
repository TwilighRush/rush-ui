# Alert RFC

## 状态

- 草案

## 摘要

`Alert` 是 `@rush_ui/react` 的区域内反馈组件，用于后台系统中的同步结果、风险提示、配置说明、保存失败原因和流程状态提示。它应提供比 `Badge` 更完整的文本承载能力，同时保持非阻断语义，不承担弹窗、Toast 或通知队列职责。

本文档只定义 `Alert` 的组件设计与接口约束，不包含任何代码实现。

## 目标

- 提供统一的区域内提示组件。
- 覆盖默认、成功、警告、错误、信息五种常见反馈状态。
- 通过 `variant` 表达状态语义。
- 支持标题、正文、图标和轻量操作区。
- 支持 `className` 作为样式扩展出口。
- 使用 CSS 变量和语义状态 token 实现主题能力。
- 保持非阻断布局，不接管焦点，不新增键盘模型。
- 暴露指向根节点的 `ref`，方便测量、滚动定位或集成测试。

## 非目标

- 首版不提供关闭按钮、自动消失、通知队列或堆叠定位。
- 首版不提供 `size`，避免过早扩展密度语义。
- 首版不提供 `as` 多态渲染。
- 首版不负责异步状态管理、表单校验调度或错误恢复逻辑。
- 首版不引入第三方图标依赖。

## 建议 API

```ts
type AlertVariant = "default" | "success" | "warning" | "error" | "info";

interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: AlertVariant;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}
```

## Props 设计

### 保留原生 div props

组件应继承除原生 `title` 外的 `React.HTMLAttributes<HTMLDivElement>`，保留常见平台能力：

- `id`
- `role`
- `aria-*`
- `data-*`
- `className`
- `onClick`
- `onMouseEnter`

`Alert` 默认仍是非交互容器。即使允许事件透传，也不鼓励把根节点作为按钮使用；需要交互时应在 `actions` 中放入语义正确的按钮或链接。

原生 `title` 与组件标题插槽命名冲突，因此不作为根节点属性暴露。

### 自定义 props

- `variant`
  作用：表达提示语义对应的视觉样式。
  默认值：`info`

- `title`
  作用：展示简短结论或状态名称。

- `icon`
  作用：替换默认装饰图标。传入 `null` 可隐藏图标。

- `actions`
  作用：展示少量恢复、跳转或确认操作。

## variant 方案

首版提供五种状态：

- `default`
  普通说明、规则提示或中性系统信息。

- `success`
  保存成功、同步完成、启用成功或流程完成。

- `warning`
  风险提示、配额接近阈值、需要人工确认或部分完成。

- `error`
  保存失败、校验失败、接口异常或不可继续。

- `info`
  低风险说明、系统提示、状态变化或补充上下文。

约束：

- `variant` 表达状态语义，不表达按钮视觉层级。
- 所有状态必须有文本、背景、边框和图标 token。
- 颜色不能成为唯一状态表达，使用方应提供可理解的 `title` 或 `children`。
- `Alert` 不包含处理中动效；运行中状态可以先使用 `info` 或业务文案表达。

## ref 行为

组件应使用 `React.forwardRef`。

- `ref` 指向根 `HTMLDivElement`。
- `variant`、`title`、`children` 或 `actions` 变化不应改变 `ref` 指向。
- `ref` 可用于测量、滚动定位和测试。

## 可访问性要求

- 默认渲染非交互 `<div>`。
- `variant="error"` 默认使用 `role="alert"`，其余状态默认使用 `role="status"`。
- 使用方可以通过原生 `role`、`aria-live` 或 `aria-label` 覆盖语义。
- 图标应设置 `aria-hidden="true"`，避免辅助技术读出装饰字符。
- 可访问名称和提示含义默认来自标题和正文文本。
- `Alert` 不应拦截键盘事件，不应进入 Tab 顺序。
- `actions` 内的交互控件需要自己提供可访问名称和键盘行为。

## 使用边界

- `Alert` 不替代 `Badge`、`Dialog`、`Popover`、`Toast` 或表单字段错误提示。
- 全局通知、自动关闭和堆叠位置不属于首版范围。
- 可关闭提示需要独立设计关闭语义、焦点顺序和受控状态，不应临时塞进首版 API。
- 需要完全自定义展示时，可以通过 `className` 覆盖样式或组合业务组件。
