# Field RFC

## 状态

- 草案

## 摘要

`Field` 是 `@rush-ui/react` 的基础表单项组件，用于把 label、说明文本、必填标记、错误态和 Rush 输入控件组合成稳定结构。它优先服务 `Input` 与 `Textarea`，让基础输入组件继续专注输入行为，避免每个业务表单重复处理 id、`htmlFor` 和 `aria-describedby`。

本文档只定义 `Field` 的组件设计与接口约束，不包含任何代码实现。

## 目标

- 提供稳定、可复用的表单项外壳。
- 自动建立 label 与子输入控件的关联。
- 自动把说明文本追加到子输入控件的 `aria-describedby`。
- 将 `required`、`invalid` 和 `errorText` 传递给 Rush 输入控件。
- 与 `Input`、`Textarea` 形成表单输入组合。
- 支持 `className` 作为逃生口。
- 暴露指向根节点 `HTMLDivElement` 的 `ref`。

## 非目标

- 首版不提供表单状态管理、校验调度或提交能力。
- 首版不提供 Field Group、Form Provider、栅格布局或 label 宽度管理。
- 首版不提供横向布局 API，避免过早固化表单页面结构。
- 首版不接管子输入的值、事件、禁用、只读和键盘行为。
- 首版不面向任意复杂交互子组件，只保证与 Rush 输入控件组合稳定。

## 建议 API

```ts
interface FieldControlProps {
  "aria-describedby"?: string;
  errorText?: React.ReactNode;
  id?: string;
  invalid?: boolean;
  required?: boolean;
}

interface FieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label?: React.ReactNode;
  helpText?: React.ReactNode;
  errorText?: React.ReactNode;
  invalid?: boolean;
  required?: boolean;
  requiredMark?: React.ReactNode;
  optionalText?: React.ReactNode;
  controlId?: string;
  children: React.ReactElement<FieldControlProps>;
}
```

## Props 设计

- `label`
  表单项标签。渲染为原生 `<label>`，并通过 `htmlFor` 关联到子输入控件。

- `helpText`
  说明文本。自动追加到子输入控件的 `aria-describedby`。

- `errorText`
  错误提示内容。传递给子输入控件，由 `Input` / `Textarea` 渲染错误文本和错误语义。

- `invalid`
  手动进入错误状态。会传递给子输入控件。

- `required`
  表示必填。渲染视觉必填标记，并在子输入控件没有显式设置 `required` 时传递原生必填语义。

- `requiredMark`
  自定义必填标记内容，默认值为 `*`。

- `optionalText`
  非必填字段的辅助标识，例如 `选填`。字段为必填时不渲染。

- `controlId`
  子输入控件 id。未传入时优先沿用子控件已有 `id`，否则自动生成。

- `children`
  Rush 输入控件。首版主要面向 `Input` 和 `Textarea`。

## 组合规则

- `controlId` 优先级高于子控件已有 `id`。
- 未提供 `controlId` 且子控件已有 `id` 时，沿用子控件 `id`。
- 未提供任何 id 时，Field 自动生成 id。
- Field 会合并子控件已有 `aria-describedby` 与 `helpText` id，不覆盖既有关联。
- Field 不自己渲染 `errorText`，而是传递给 `Input` / `Textarea`，让错误文本与字数统计继续在输入组件 meta 区域内协同。

## ref 行为

组件必须使用 `React.forwardRef`。

- `ref` 指向根节点 `HTMLDivElement`。
- 子输入控件自身 `ref` 继续由使用方直接传给 `Input` 或 `Textarea`。

## 可访问性要求

- 标签必须使用原生 `<label>`。
- `label` 与输入控件必须通过 `htmlFor` / `id` 建立关联。
- `helpText` 必须通过 `aria-describedby` 与输入控件关联。
- 合并 `aria-describedby` 时不得覆盖使用方已有描述关系。
- `required` 语义来自子输入控件的原生 `required` 属性。
- 必填视觉标记不能作为唯一语义来源。
- 错误态由子输入控件负责设置 `aria-invalid` 和错误提示关联。

## 使用边界

- `Field` 不拥有输入值，不提供受控/非受控状态。
- `Field` 不处理验证时机；业务层或后续表单组件负责校验调度。
- `Field` 不替代 `Input` / `Textarea` 的 props；输入行为仍由子组件定义。
