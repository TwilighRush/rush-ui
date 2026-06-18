# Textarea RFC

## 状态

- 草案

## 摘要

`Textarea` 是 `@rush_ui/react` 的基础多行文本输入组件，用于后台系统中的备注、说明、审批意见和长文本配置。它基于原生 `<textarea>` 渲染，保留浏览器默认多行输入行为，同时与 `Input` 形成一致的表单输入组合。

本文档只定义 `Textarea` 的组件设计与接口约束，不包含任何代码实现。

## 目标

- 提供稳定、可复用的多行输入控件。
- 支持受控与非受控两种使用方式。
- 使用 `size` 表达控件密度。
- 支持 `invalid` 与 `errorText`，减少业务侧重复处理可访问性关联。
- 支持 `showCount`，覆盖备注、说明和审批意见等长度受限字段的字数反馈。
- 支持自适应高度，覆盖从短备注到较长说明的自然输入场景。
- 支持轻量后置装饰内容，覆盖快捷键提示和状态提示。
- 暴露指向底层 `HTMLTextAreaElement` 的 `ref`。

## 非目标

- 首版不提供复杂表单项布局、标签、帮助文本和校验调度。
- 首版不提供清空按钮，避免在长文本输入中引入高风险误触操作。
- 首版不提供前后缀 addon，避免把单行输入的单位组合模式机械复制到多行文本域。
- 首版不提供富文本、Markdown 工具栏或评论提及能力。
- 首版不提供多态 `as` 渲染能力。

## 建议 API

```ts
type TextareaSize = "sm" | "md" | "lg";

interface TextareaAutoSizeOptions {
  minRows?: number;
  maxRows?: number;
}

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "children" | "size"> {
  size?: TextareaSize;
  invalid?: boolean;
  errorText?: React.ReactNode;
  suffix?: React.ReactNode;
  showCount?: boolean;
  autoSize?: boolean | TextareaAutoSizeOptions;
  onValueChange?: (value: string) => void;
}
```

## Props 设计

### 保留原生 textarea props

组件应继承除原生 `children` 和 `size` 外的 `React.TextareaHTMLAttributes<HTMLTextAreaElement>`，保留常见平台能力：

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
- `rows`
- `cols`
- `onChange`
- `aria-*`
- `data-*`

原生 `size` 与组件尺寸语义冲突，因此不暴露为公开属性。

### 自定义 props

- `size`
  控制字号、间距、最小高度和内边距，默认值为 `md`。

- `invalid`
  表示字段当前处于错误状态。为真时设置 `aria-invalid="true"`，并切换错误样式。

- `errorText`
  错误提示内容。与 `invalid` 或外部 `aria-invalid` 一起使用时渲染，并自动追加到 `aria-describedby`。

- `suffix`
  文本域内部后置装饰内容。用于快捷键提示、状态图标等轻量视觉提示，不承载必要语义。

- `showCount`
  展示当前字符数。传入 `maxLength` 时展示为 `当前数 / 上限`，并自动追加到 `aria-describedby`。

- `autoSize`
  根据内容自动调整高度。传入 `true` 时不限制最大行数；传入对象时可通过 `minRows` 和 `maxRows` 控制高度边界。

- `onValueChange`
  输入值变化后的语义回调，参数为最新字符串值。需要原生事件时继续使用 `onChange`。

## 受控与非受控

- 受控模式使用 `value` + `onValueChange`。
- 非受控模式使用 `defaultValue`。
- `onChange` 保留为原生事件出口，方便表单库和特殊事件处理集成。
- 组件不把内部状态作为提交值的真实来源；非受控模式仅同步展示、字数统计和自动高度所需的当前文本。

## 状态

- `disabled`
  使用原生 `disabled`，不可聚焦、不可编辑，并进入禁用视觉态。

- `readOnly`
  使用原生 `readOnly`，保留可聚焦能力，但不允许编辑。

- `invalid`
  使用 `aria-invalid` 与错误视觉态表达字段错误。如果提供 `errorText`，组件自动建立 `aria-describedby` 关联。

## ref 行为

组件必须使用 `React.forwardRef`。

- `ref` 指向底层 `HTMLTextAreaElement`。
- 使用方可以依赖它进行聚焦、选区控制、表单集成或浮层联动。
- 状态变化不应改变 `ref` 指向。

## 可访问性要求

- 文本域必须渲染原生 `<textarea>`。
- 可访问名称应由 `label`、`aria-label` 或 `aria-labelledby` 提供。
- `invalid={true}` 时必须设置 `aria-invalid="true"`。
- 有错误提示时，错误提示必须通过 `aria-describedby` 与文本域关联。
- 有字数统计时，统计信息必须通过 `aria-describedby` 与文本域关联。
- `disabled` 和 `readOnly` 必须使用原生属性。
- 键盘输入、方向键、复制粘贴、Tab 聚焦顺序和表单提交行为应交给浏览器原生处理。
- `suffix` 是装饰内容，必须对辅助技术隐藏。
- `autoSize` 不应改变文本域的可访问名称、描述和原生编辑行为。

## 使用边界

- `Textarea` 不内置 label；表单布局后续可由 `Field` 或业务表单组件承载。
- `suffix` 是装饰插槽，不用于交互控件。
- 需要按钮、菜单、提及、上传或富文本工具栏时，应使用后续专门组件组合。
