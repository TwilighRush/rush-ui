# Spinner RFC

## 状态

- 草案

## 摘要

`Spinner` 是 `@rush_ui/react` 的加载指示组件，用于表达短暂、明确、范围可描述的异步状态，例如局部刷新、表格请求、弹层内提交等待和后台任务同步。它提供三档尺寸、可见说明文本、默认可访问加载语义和装饰模式。

本文档只定义 `Spinner` 的组件设计与接口约束，不包含任何代码实现。

## 目标

- 覆盖按钮外的局部加载、页面区块加载、表格刷新和弹层内等待场景。
- 默认提供 `role="status"` 和合理可访问名称，避免无文本加载状态。
- 支持 `label` 展示可见说明文本。
- 支持 `size` 控制尺寸和文本密度。
- 支持 `className`、原生 span props 和 `forwardRef<HTMLSpanElement>`。
- 支持调用方通过 `aria-hidden` 将 Spinner 标记为装饰内容。
- 使用 Less 与 CSS 变量接入现有 token，不新增依赖。
- 尊重 `prefers-reduced-motion`。

## 非目标

- 首版不提供全屏 loading 管理器。
- 首版不内置异步请求、队列、超时或状态机。
- 首版不替代 `Button` 的 loading 状态；按钮内部 loading 仍由按钮自身负责。
- 首版不承载复杂进度信息；确定性进度后续应由 `Progress` 负责。
- 首版不提供多种视觉变体，避免加载状态成为装饰元素。

## 公共 API

```ts
type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  label?: React.ReactNode;
}
```

导出：

```ts
export { Spinner } from "@rush_ui/react";
export type { SpinnerProps, SpinnerSize } from "@rush_ui/react";
```

## Props 设计

- `size`
  作用：控制指示器尺寸、描边粗细和说明文字字号。
  默认值：`md`。

- `label`
  作用：展示可见加载说明，例如“正在同步成员权限”。
  约束：适合短文本，不应承载错误、成功或复杂任务详情。

- 原生 span props
  组件继承 `React.HTMLAttributes<HTMLSpanElement>`，支持 `id`、`role`、`aria-*`、`data-*`、`className`、`style` 和事件属性。

## ARIA 与语义

- 默认根节点使用 `<span role="status">`。
- 未传入 `label` 且未显式提供 `aria-label` 时，组件默认使用 `aria-label="加载中"`。
- 传入 `label` 时，文本作为可见说明渲染，不额外强制生成 `aria-label`。
- 当 Spinner 只是按钮、菜单项或其他控件中的装饰图标时，调用方可以传入 `aria-hidden={true}`；组件会移除默认 `role` 和 `aria-label`。
- Spinner 不应作为页面唯一加载语义时又被隐藏；如果隐藏，应由父级控件或区域提供等价语义。

## 键盘与焦点

- `Spinner` 本身不进入 Tab 顺序，不接管焦点。
- `Spinner` 不注册键盘事件。
- 加载期间是否禁用按钮、输入或其他交互控件，由对应控件或上层流程决定。

## 样式 token

建议组件私有变量：

```css
--rui-spinner-size
--rui-spinner-stroke-width
--rui-spinner-color
--rui-spinner-track-color
--rui-spinner-gap
--rui-spinner-label-color
--rui-spinner-label-font-size
```

视觉约束：

- 默认颜色使用 `--rui-color-ink`，保持后台界面中的高可见度。
- 轨道色使用边框 token 混合得到，避免过强装饰感。
- 动画只表达“仍在处理中”，不承担品牌装饰。
- `prefers-reduced-motion: reduce` 下停止旋转，保留静态加载标识。

## Stories

首版 Storybook 应覆盖：

- 默认 Spinner。
- `sm`、`md`、`lg` 三档尺寸。
- 带 `label` 的加载说明。
- 局部区域加载，与 `aria-busy` 容器组合。
- 装饰图标模式，使用 `aria-hidden`。
- 长 label 在窄容器中换行。

## Tests

首版测试应覆盖：

- 默认渲染 `role="status"` 和 `aria-label="加载中"`。
- 渲染可见 `label`。
- `size` 输出稳定状态标记。
- `aria-hidden` 装饰模式移除默认 status 语义。
- `className`、`aria-*`、`data-*` 和原生属性透传。
- `ref` 指向根 `HTMLSpanElement`。

## 与其他组件的边界

### Skeleton

`Skeleton` 表达“内容结构已知、数据尚未返回”的占位状态，默认不播报。`Spinner` 表达明确的加载动作或区域正在等待。表格、详情页等结构化等待优先使用 `Skeleton`；需要播报“正在加载”时可在上层容器配合 `Spinner` 或 `role="status"` 文本。

### Empty

`Empty` 表达加载完成后没有内容；`Spinner` 表达加载尚未完成。二者不应同时表示同一状态。

### Button

`Button` 已有 `loading` 和 `loadingText`。常规按钮加载应继续使用 Button API；`Spinner` 适合按钮外、区域内或复合布局中的加载说明。
