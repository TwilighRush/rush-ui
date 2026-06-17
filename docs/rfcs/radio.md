# Radio RFC

## 状态

- 草案

## 摘要

`Radio` / `RadioGroup` 是 `@rush-ui/react` 的基础单选组件，用于互斥选项、筛选条件、默认策略和配置分支。单个 `Radio` 保持原生 radio 语义；`RadioGroup` 负责同组选项的值管理、统一 `name`、方向键移动、错误态和 `Field` 组合。

本文档只定义组件设计与接口约束，不包含任何代码实现。

## 目标

- 提供稳定、可访问、可主题化的单选框。
- 基于原生 `<input type="radio">`，保留表单提交语义。
- 支持 `Radio` 单独使用和 `RadioGroup` 组内使用。
- 支持受控和非受控单选组。
- 支持方向键、Home 和 End 在组内移动焦点并更新选择。
- 支持禁用、错误、必填、尺寸和说明文本。
- 支持与 `Field` 组合，让 label、说明、必填和错误语义稳定关联。
- 支持 `className` 作为逃生口。
- `Radio` ref 指向底层 `HTMLInputElement`；`RadioGroup` ref 指向根节点 `HTMLDivElement`。

## 非目标

- 首版不提供复杂选项卡片、图标选项、矩阵式单选或嵌套分组。
- 首版不提供表单状态管理、校验调度或提交能力。
- 首版不提供自定义选项渲染协议，避免泄漏内部 DOM 结构。
- 首版不接管业务层的异步加载、选项过滤和权限计算。

## 建议 API

```ts
type RadioSize = "sm" | "md" | "lg";
type RadioGroupOrientation = "horizontal" | "vertical";

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "size" | "type"> {
  size?: RadioSize;
  invalid?: boolean;
  description?: React.ReactNode;
  errorText?: React.ReactNode;
  children?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
}

interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  value?: string;
  defaultValue?: string;
  name?: string;
  size?: RadioSize;
  orientation?: RadioGroupOrientation;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  errorText?: React.ReactNode;
  children?: React.ReactNode;
  onValueChange?: (value: string) => void;
}
```

## Props 设计

### Radio

- `size`
  单个 Radio 尺寸。组内默认继承 `RadioGroup.size`。

- `checked` / `defaultChecked`
  单个 Radio 的原生受控和非受控选中状态。组内推荐改用 `RadioGroup.value` / `RadioGroup.defaultValue`。

- `value`
  原生 radio 值。组内用于匹配 `RadioGroup.value`，会转为字符串比较。

- `invalid`
  单项错误态。组级错误优先放在 `RadioGroup` 或 `Field`。

- `description`
  单项说明文本，自动追加到该 radio 的 `aria-describedby`。

- `errorText`
  单项错误文本，错误态下追加到该 radio 的 `aria-describedby`。

- `onCheckedChange`
  语义回调，用于单项状态变化。需要原生事件对象时继续使用 `onChange`。

### RadioGroup

- `value` / `defaultValue`
  单选组的受控值和非受控初始值。

- `name`
  组内 Radio 共用的原生字段名。未传时自动生成稳定 name。

- `size`
  统一传递给组内 Radio。

- `orientation`
  设置视觉排列方向和 `aria-orientation`。键盘方向键在水平和垂直排列下都可用。

- `disabled`
  禁用整个组，并传递给组内 Radio。

- `invalid`
  标记组级错误，并传递给组内 Radio。

- `required`
  标记必填，并传递给组内 Radio。视觉必填标记由 `Field` 负责。

- `errorText`
  组级错误文本，由 `RadioGroup` 渲染并追加到根节点 `aria-describedby`。

- `onValueChange`
  语义回调，在选中值变化后触发。

## 键盘行为

- Tab 进入当前可聚焦 radio，继续 Tab 离开单选组。
- Space 选择当前聚焦 radio。
- ArrowDown / ArrowRight 移动到下一个可用 radio，并更新选择。
- ArrowUp / ArrowLeft 移动到上一个可用 radio，并更新选择。
- Home 移动到第一个可用 radio，并更新选择。
- End 移动到最后一个可用 radio，并更新选择。
- 禁用项不参与 roving focus。
- 到达首尾时循环。

## Field 组合规则

- `Field` 会把 label id 合并到 `RadioGroup.aria-labelledby`。
- `Field.helpText` 会合并到 `RadioGroup.aria-describedby`。
- `Field.errorText` 会传递给 `RadioGroup.errorText`，由组渲染错误文本。
- `Field.required` 会传递给 `RadioGroup.required`，再传递给组内 Radio。

## ref 行为

组件必须使用 `React.forwardRef`。

- `Radio` ref 指向底层 `HTMLInputElement`。
- `RadioGroup` ref 指向根节点 `HTMLDivElement`。

## 可访问性要求

- 单项必须使用原生 `input[type="radio"]`。
- `RadioGroup` 必须使用 `role="radiogroup"`。
- `RadioGroup` 必须支持外部传入 `aria-label` / `aria-labelledby`，并能与 `Field` 自动关联。
- `description`、`errorText` 和外部 `aria-describedby` 必须合并，不得覆盖既有关联。
- 方向键行为必须跳过 disabled radio。
- 错误态必须设置 `aria-invalid`，不能只依赖颜色表达。

## 使用边界

- 组内选项应提供唯一 `value`。
- 单个 `Radio` 可独立使用，但互斥选项应优先使用 `RadioGroup`。
- 复杂选项卡片或带副操作的选择器应由后续独立组件设计，不应把内部 DOM 结构暴露到 `Radio` API。
