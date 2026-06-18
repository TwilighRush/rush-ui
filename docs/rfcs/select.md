# Select RFC

## 状态

- 草案

## 摘要

`Select` 是 `@rush_ui/react` 的基础单选选择器，用于筛选条件、默认负责人、审批模式和配置分支。组件采用 WAI-ARIA combobox / listbox 模式，支持受控/非受控值、键盘导航、typeahead、空态、错误态、禁用态和 `Field` 组合。

本文档只定义组件设计与接口约束，不包含任何代码实现。

## 目标

- 提供稳定、可访问、可主题化的单选选择器。
- 支持受控和非受控：`value` / `defaultValue` / `onValueChange`。
- 支持与 `Field` 组合：label、helpText、errorText、required。
- 支持键盘：Arrow、Enter、Escape、Home、End、typeahead。
- 支持状态：disabled、invalid、placeholder、empty。
- 使用 combobox / listbox ARIA 模式表达弹层与选项关系。
- 支持 `name` 渲染隐藏输入，保留基础表单提交能力。
- `ref` 指向主触发器 `HTMLButtonElement`。

## 非目标

- v1 不支持多选。
- v1 不支持远程搜索、异步加载和输入过滤。
- v1 不支持虚拟滚动。
- v1 不支持选项分组、级联选择、复杂选项卡片或选项内副操作。
- v1 不提供表单校验调度；校验时机仍由业务层或后续 Form 组件负责。

## 建议 API

```ts
type SelectSize = "sm" | "md" | "lg";

interface SelectOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  textValue?: string;
}

interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  name?: string;
  size?: SelectSize;
  placeholder?: React.ReactNode;
  emptyText?: React.ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  errorText?: React.ReactNode;
  onValueChange?: (value: string) => void;
}
```

## Props 设计

- `options`
  选项列表。每个选项必须提供唯一 `value` 和显示用 `label`。

- `value` / `defaultValue`
  受控值和非受控初始值。值只使用字符串，避免数组、多选和复杂对象过早进入 v1。

- `name`
  表单字段名。传入后渲染隐藏输入，便于普通表单提交读取当前值。

- `size`
  与 Input / Textarea / Radio 保持一致的 `sm | md | lg` 尺寸。

- `placeholder`
  未选择时显示。默认中文为 `"请选择"`。

- `emptyText`
  没有选项时显示。默认中文为 `"暂无可选项"`。

- `disabled`
  禁用整个 Select。

- `invalid`
  错误态。设置 `aria-invalid` 并切换错误视觉状态。

- `required`
  必填语义。设置 `aria-required`，视觉必填标记由 `Field` 提供。

- `errorText`
  错误提示内容，由 Select 渲染并合并到 `aria-describedby`。

- `onValueChange`
  语义回调，只在选中值实际变化时触发。

## 键盘行为

- `Enter` / `Space`：关闭时打开弹层；打开时选择当前活动选项。
- `ArrowDown` / `ArrowRight`：关闭时打开弹层并定位到当前值或第一个可用项；打开时移动到下一个可用项。
- `ArrowUp` / `ArrowLeft`：关闭时打开弹层并定位到当前值或最后一个可用项；打开时移动到上一个可用项。
- `Home`：打开弹层并定位到第一个可用项。
- `End`：打开弹层并定位到最后一个可用项。
- `Escape`：关闭弹层，不改变当前值。
- `Tab`：关闭弹层，允许浏览器继续移动焦点。
- 可打印字符：按 `textValue` / 纯文本 `label` 做 typeahead 定位；重复同一字符时在同首字母选项间循环。
- 禁用选项不参与方向键、Home/End 和 typeahead。

## ARIA 模式

- 触发器使用 `button` + `role="combobox"`。
- 触发器设置：
  - `aria-expanded`
  - `aria-haspopup="listbox"`
  - `aria-controls`
  - `aria-activedescendant`
  - `aria-invalid`
  - `aria-required`
  - `aria-describedby`
  - `aria-labelledby` 或 `aria-label`
- 弹层使用 `role="listbox"`。
- 选项使用 `role="option"`、`aria-selected` 和必要时的 `aria-disabled`。
- 与 `Field` 组合时，Field 传入的 label id 合并到 `aria-labelledby`，help/error id 合并到 `aria-describedby`。

## 视觉与交互

- 触发器视觉与 Input 同族：Warm Surface 背景、小圆角、边框优先、焦点使用 copper focus ring。
- 弹层使用固定定位，降低被普通滚动/裁剪容器截断的概率。
- 选中项通过背景和勾选标记表达，不只依赖颜色。
- disabled 继承现有表单控件的透明度策略。
- 动画限制在 160ms 左右，并提供 reduced-motion 降级。

## 使用边界

- `value` 应与某个选项 `value` 对应；不对应时触发器显示 placeholder，隐藏输入仍保留外部传入值。
- `label` 为复杂节点时应提供 `textValue`，否则 typeahead 会退回匹配 `value`。
- 远程搜索、多选、虚拟滚动和复杂选项内容需要独立 RFC，不应塞进 v1。
