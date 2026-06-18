# Input RFC

## 状态

- 草案

## 摘要

`Input` 是 `@rush_ui/react` 的基础单行文本输入组件，用于后台系统中的表单、筛选器、表格工具栏和搜索场景。它基于原生 `<input>` 渲染，保留浏览器默认输入行为，同时统一尺寸、错误态、只读态、禁用态、清空按钮、字数统计、图标插槽、前后缀和焦点样式。

本文档只定义 `Input` 的组件设计与接口约束，不包含任何代码实现。

## 目标

- 提供稳定、可复用的单行输入控件。
- 支持受控与非受控两种使用方式。
- 使用 `size` 表达控件密度。
- 支持 `invalid` 与 `errorText`，减少业务侧重复处理可访问性关联。
- 支持 `allowClear`，覆盖筛选和搜索输入中的清空需求。
- 支持 `showCount`，覆盖名称、编号等长度受限字段的字数反馈。
- 支持 `prefix` 与 `suffix` 装饰图标插槽。
- 支持轻量前后缀，覆盖金额、单位、域名、搜索提示等高频场景。
- 暴露指向底层 `HTMLInputElement` 的 `ref`。

## 非目标

- 多行文本输入由独立的 `Textarea` 组件承载。
- 首版不提供复杂表单项布局、标签、帮助文本和校验调度。
- 首版不提供密码可见性切换或组合选择器。
- 首版不提供多态 `as` 渲染能力。

## 建议 API

```ts
type InputSize = "sm" | "md" | "lg";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "prefix" | "size"> {
  size?: InputSize;
  invalid?: boolean;
  errorText?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  startAddon?: React.ReactNode;
  endAddon?: React.ReactNode;
  allowClear?: boolean;
  clearAriaLabel?: string;
  showCount?: boolean;
  onClear?: () => void;
  onValueChange?: (value: string) => void;
}
```

## Props 设计

### 保留原生 input props

组件应继承除原生 `children`、`prefix` 和 `size` 外的 `React.InputHTMLAttributes<HTMLInputElement>`，保留常见平台能力：

- `type`
- `name`
- `value`
- `defaultValue`
- `disabled`
- `readOnly`
- `required`
- `placeholder`
- `maxLength`
- `autoComplete`
- `autoFocus`
- `onChange`
- `aria-*`
- `data-*`

原生 `size` 与组件尺寸语义冲突，因此不暴露为公开属性。

### 自定义 props

- `size`
  控制高度、字号、间距和水平内边距，默认值为 `md`。

- `invalid`
  表示字段当前处于错误状态。为真时设置 `aria-invalid="true"`，并切换错误样式。

- `errorText`
  错误提示内容。与 `invalid` 或外部 `aria-invalid` 一起使用时渲染，并自动追加到 `aria-describedby`。

- `prefix`
  输入框内部前置装饰图标。用于搜索、用户、链接等轻量视觉提示，不承载必要语义。

- `suffix`
  输入框内部后置装饰图标。用于快捷键提示、状态图标等轻量视觉提示，不承载必要语义。

- `startAddon`
  前缀内容，适合金额符号、搜索图标、协议前缀等轻量内容。

- `endAddon`
  后缀内容，适合单位、域名、固定说明等轻量内容。

- `allowClear`
  有值且组件不是 `disabled` / `readOnly` 时显示清空按钮。点击后清空非受控输入的原生值，并触发 `onValueChange("")` 与 `onClear`。

- `clearAriaLabel`
  清空按钮的可访问名称，默认值为 `清空输入`。

- `showCount`
  展示当前字符数。传入 `maxLength` 时展示为 `当前数 / 上限`，并自动追加到 `aria-describedby`。

- `onClear`
  点击清空按钮后的回调。受控模式下，使用方仍需在 `onValueChange` 或 `onClear` 中更新 `value`。

- `onValueChange`
  输入值变化后的语义回调，参数为最新字符串值。需要原生事件时继续使用 `onChange`。

## 受控与非受控

- 受控模式使用 `value` + `onValueChange`。
- 非受控模式使用 `defaultValue`。
- `onChange` 保留为原生事件出口，方便表单库和特殊事件处理集成。
- 组件不把内部状态作为提交值的真实来源；非受控模式仅同步展示所需的当前文本。
- `allowClear` 在受控模式下只发出清空意图，最终显示值仍由外部 `value` 决定。

## 状态

- `disabled`
  使用原生 `disabled`，不可聚焦、不可编辑，并进入禁用视觉态。

- `readOnly`
  使用原生 `readOnly`，保留可聚焦能力，但不允许编辑。

- `invalid`
  使用 `aria-invalid` 与错误视觉态表达字段错误。如果提供 `errorText`，组件自动建立 `aria-describedby` 关联。

## ref 行为

组件必须使用 `React.forwardRef`。

- `ref` 指向底层 `HTMLInputElement`。
- 使用方可以依赖它进行聚焦、选区控制、表单集成或浮层联动。
- 状态变化不应改变 `ref` 指向。

## 可访问性要求

- 输入框必须渲染原生 `<input>`。
- 可访问名称应由 `label`、`aria-label` 或 `aria-labelledby` 提供。
- `invalid={true}` 时必须设置 `aria-invalid="true"`。
- 有错误提示时，错误提示必须通过 `aria-describedby` 与输入框关联。
- 有字数统计时，统计信息必须通过 `aria-describedby` 与输入框关联。
- 清空按钮必须使用原生 `<button type="button">`，并具备可访问名称。
- `disabled` 和 `readOnly` 必须使用原生属性。
- 键盘输入、方向键、复制粘贴、Tab 聚焦顺序和表单提交行为应交给浏览器原生处理。

## 使用边界

- `Input` 不内置 label；表单布局后续可由 `Field` 或业务表单组件承载。
- `prefix` 和 `suffix` 是装饰图标插槽，不用于交互控件。
- `startAddon` 和 `endAddon` 只用于轻量内容，不承载复杂交互。
- 需要按钮、菜单、选择器等复合交互时，应使用后续专门组件组合。
