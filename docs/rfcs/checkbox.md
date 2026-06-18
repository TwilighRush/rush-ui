# Checkbox RFC

## 状态

- 草案

## 摘要

`Checkbox` / `CheckboxGroup` 是 `@rush_ui/react` 的基础复选组件，用于后台系统中的确认项、多选筛选、批量选择和权限配置。它基于原生 `<input type="checkbox">` 渲染，保留浏览器默认勾选、键盘和表单行为，同时统一尺寸、半选、说明文本、组级错误态、禁用态和焦点样式。

本文档只定义 `Checkbox` 的组件设计与接口约束，不包含任何代码实现。

## 目标

- 提供稳定、可复用的单个复选框原语和复选组组合。
- 支持受控与非受控两种使用方式。
- 支持 `CheckboxGroup` 使用字符串数组管理组选中值。
- 支持 `indeterminate`，覆盖全选、部分选中和层级选择场景。
- 支持 `description` 与 `errorText`，减少业务侧重复处理可访问性关联。
- 支持与 `Field` 组合，让 label、说明、必填和错误语义稳定关联到复选组。
- 使用 `size` 表达控件密度。
- 暴露指向底层 `HTMLInputElement` 的 `ref`。

## 非目标

- 首版不内置全选、反选、树形选择或批量选择状态计算。
- 首版不提供卡片式复选项、按钮式复选项或权限矩阵布局。
- 首版不提供多态 `as` 渲染能力。

## 建议 API

```ts
type CheckboxSize = "sm" | "md" | "lg";
type CheckboxGroupOrientation = "horizontal" | "vertical";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "size" | "type"> {
  size?: CheckboxSize;
  invalid?: boolean;
  indeterminate?: boolean;
  description?: React.ReactNode;
  errorText?: React.ReactNode;
  children?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
}

interface CheckboxGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  value?: string[];
  defaultValue?: string[];
  name?: string;
  size?: CheckboxSize;
  orientation?: CheckboxGroupOrientation;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  errorText?: React.ReactNode;
  children?: React.ReactNode;
  onValueChange?: (value: string[]) => void;
}
```

## Props 设计

### 保留原生 checkbox props

组件应继承除原生 `children`、`size` 和 `type` 外的 `React.InputHTMLAttributes<HTMLInputElement>`，保留常见平台能力：

- `name`
- `value`
- `checked`
- `defaultChecked`
- `disabled`
- `required`
- `autoFocus`
- `onChange`
- `aria-*`
- `data-*`

原生 `type` 固定为 `checkbox`，不暴露为公开属性。原生 `size` 与组件尺寸语义冲突，因此也不暴露。

### 自定义 props

- `size`
  控制勾选框尺寸、文字大小和可点击区域，默认值为 `md`。

- `invalid`
  表示字段当前处于错误状态。为真时设置 `aria-invalid="true"`，并切换错误样式。

- `indeterminate`
  表示半选状态。组件必须同步到底层 `input.indeterminate`，并设置 `aria-checked="mixed"`。

- `description`
  说明文本。组件自动生成 id 并追加到 `aria-describedby`。

- `errorText`
  错误提示内容。与 `invalid` 或外部 `aria-invalid` 一起使用时渲染，并自动追加到 `aria-describedby`。

- `children`
  可见 label 内容。没有可见 label 时，使用方必须提供 `aria-label` 或 `aria-labelledby`。

- `onCheckedChange`
  勾选状态变化后的语义回调，参数为最新 `checked` 值。需要原生事件时继续使用 `onChange`。

### CheckboxGroup props

- `value` / `defaultValue`
  复选组的受控值数组和非受控初始值数组。

- `name`
  组内 Checkbox 共用的原生字段名。未传时自动生成稳定 name。

- `size`
  统一传递给组内 Checkbox。

- `orientation`
  设置视觉排列方向。

- `disabled`
  禁用整个组，并传递给组内 Checkbox。

- `invalid`
  标记组级错误，并传递给组内 Checkbox。

- `required`
  标记组必填，并通过隐藏描述向辅助技术暴露必填语义。该语义不传给每个子 Checkbox，避免浏览器把每个选项都当作必填。

- `errorText`
  组级错误文本，由 `CheckboxGroup` 渲染并追加到根节点 `aria-describedby`。

- `onValueChange`
  语义回调，在选中值数组变化后触发。

## 受控与非受控

- 单项受控模式使用 `checked` + `onCheckedChange`。
- 单项非受控模式使用 `defaultChecked`。
- 组受控模式使用 `value` + `onValueChange`。
- 组非受控模式使用 `defaultValue`。
- `onChange` 保留为原生事件出口，方便表单库和特殊事件处理集成。
- `indeterminate` 独立于 `checked`，由调用方显式控制。
- 组件不把内部状态作为提交值的真实来源；表单提交仍依赖原生 input。

## 状态

- `unchecked`
  默认未选状态，显示清晰边框和可点击区域。

- `checked`
  使用深色填充与勾选标记表达选中状态。

- `indeterminate`
  使用深色填充与横杠标记表达部分选中状态。

- `disabled`
  使用原生 `disabled`，不可聚焦、不可切换，并进入禁用视觉态。

- `invalid`
  使用 `aria-invalid` 与错误视觉态表达字段错误。如果提供 `errorText`，组件自动建立 `aria-describedby` 关联。

- `group invalid`
  复选组根节点和组内选项都会进入错误语义和视觉态。错误文本由组根节点渲染，避免每个子项重复播报。

## ref 行为

组件必须使用 `React.forwardRef`。

- `ref` 指向底层 `HTMLInputElement`。
- 使用方可以依赖它进行聚焦、表单集成、半选状态检查或批量选择联动。
- 状态变化不应改变 `ref` 指向。

`CheckboxGroup` 也必须使用 `React.forwardRef`。

- `ref` 指向根节点 `HTMLDivElement`。
- 子 Checkbox 自身 `ref` 继续由使用方直接传给 `Checkbox`。

## 可访问性要求

- 复选框必须渲染原生 `<input type="checkbox">`。
- 复选组必须使用 `role="group"`。
- 复选组必须支持外部传入 `aria-label` / `aria-labelledby`，并能与 `Field` 自动关联。
- 可访问名称应由可见 label、`aria-label` 或 `aria-labelledby` 提供。
- 键盘交互交给浏览器原生处理：Tab 聚焦，Space 切换。
- `indeterminate={true}` 时必须同步 `input.indeterminate`，并设置 `aria-checked="mixed"`。
- 有说明文本或错误提示时，必须通过 `aria-describedby` 与输入框关联。
- 组级错误文本和说明文本必须通过 `aria-describedby` 与组根节点关联。
- `invalid={true}` 时必须设置 `aria-invalid="true"`。
- `CheckboxGroup.required` 必须使用组级描述表达必填语义，不得误用为每个子项的原生 `required`。
- `disabled` 必须使用原生属性。

## 使用边界

- `Checkbox` 是单个复选框原语；`CheckboxGroup` 只负责同组选项的值数组、布局和组级语义。
- 全选、半选和批量选择的业务状态应由调用方计算。
- 组内选项应提供唯一 `value`。
- 多个复选框的组标题、帮助文本和错误聚合可由 `Field` 承载。
