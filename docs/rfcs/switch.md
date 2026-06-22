# Switch RFC

## 状态

- 评审通过
- 评审日期：2026-06-22

## 摘要

`Switch` 表达立即生效的开 / 关设置。它使用原生 checkbox 作为交互与表单基础，并通过 `role="switch"` 暴露开关语义。

## 目标

- 原生支持受控 / 非受控、表单提交、required、reset 和 disabled。
- 支持可见 label、description、invalid 和 errorText。
- 支持 sm / md / lg 视觉尺寸，但所有尺寸维持至少 44px 命中区域。
- `ref` 指向主交互节点 `HTMLInputElement`。
- 支持 `className` 和主题变量。

## 非目标

- v1 不支持不确定态、加载态和三态切换。
- Switch 不用于提交一次性动作；需要确认的开关由业务层在 `onCheckedChange` 中受控处理。

## 公共 API

```ts
type SwitchSize = "sm" | "md" | "lg";

interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "size" | "type"> {
  children?: React.ReactNode;
  size?: SwitchSize;
  description?: React.ReactNode;
  invalid?: boolean;
  errorText?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
}
```

## 结构与 ref

- 根节点为 `label`，包含原生 input、视觉 track、label 和说明/错误文本。
- input 类型固定为 checkbox，并设置 `role="switch"`。
- `ref` 指向 input，不指向视觉 track 或根 label。
- 没有 `children` 时，调用方必须提供 `aria-label` 或 `aria-labelledby`。

## 状态与事件

- `checked` 存在时由 React 控制；否则使用原生 `defaultChecked`。
- 原生 `onChange` 保留，随后调用 `onCheckedChange(event.currentTarget.checked)`。
- `name`、`value`、`required`、`form` 和表单 reset 沿用原生 input 行为。
- disabled 时 input 不可聚焦、不提交，也不触发变更回调。
- `invalid` 设置 `aria-invalid` 并把 errorText id 合并进 `aria-describedby`。

## 键盘与语义

- `Tab` 聚焦 input。
- `Space` 使用浏览器原生 checkbox 行为切换。
- `Enter` 不作为强制切换键，避免覆盖浏览器与表单默认行为。
- 屏幕阅读器通过 `role="switch"` 和原生 checked 状态获得 `aria-checked` 等价信息。
- 可见 label 的文本不能随开关状态改变，否则会破坏控件名称稳定性。

## 视觉约束

- input 视觉隐藏但保留可聚焦性，焦点环显示在 track 上。
- checked 状态同时改变 track 和 thumb 位置，不只依赖颜色。
- disabled、invalid、hover、focus-visible 均由 CSS 变量表达。
- reduced motion 下取消 thumb 位移动画。

## Stories

- 三种尺寸。
- 受控和非受控。
- disabled on / off。
- description、required、invalid + errorText。
- 仅 aria-label 的紧凑用法。

## Tests

- 受控 / 非受控与 `onCheckedChange`。
- Tab + Space 键切换。
- disabled、required、表单提交和 reset。
- label、description、errorText 的 ARIA 关联。
- ref 指向 input、className、三种尺寸。
