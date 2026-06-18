# Field 表单项

`Field` 用于把 label、说明文本、必填标记、错误态和 Rush 输入控件组合成稳定的表单项。它适合与 `Input`、`Textarea`、`CheckboxGroup`、`RadioGroup`、`Select` 搭配使用，让基础输入组件继续专注输入行为，由 `Field` 负责表单项结构和可访问性关联。

## 导入

```tsx
import { Checkbox, CheckboxGroup, Field, Input, Radio, RadioGroup, Select, Textarea } from "@rush_ui/react";
```

## 基础用法

```tsx
<Field helpText="项目名称会显示在侧边栏和操作日志中。" label="项目名称" required>
  <Input allowClear maxLength={20} showCount />
</Field>

<Field label="内部备注" optionalText="选填">
  <Textarea autoSize={{ minRows: 2, maxRows: 6 }} maxLength={160} showCount />
</Field>

<Field errorText="审批意见不能为空" label="审批意见" required>
  <Textarea />
</Field>

<Field helpText="方向键会在可用选项之间移动焦点并更新选择。" label="默认通知方式" required>
  <RadioGroup defaultValue="email" name="defaultNotice">
    <Radio value="email">邮件通知</Radio>
    <Radio value="sms">短信通知</Radio>
  </RadioGroup>
</Field>

<Field helpText="用于控制成员在客户资料中的操作范围。" label="权限范围" required>
  <CheckboxGroup defaultValue={["read"]} name="permission">
    <Checkbox value="read">查看</Checkbox>
    <Checkbox value="export">导出</Checkbox>
  </CheckboxGroup>
</Field>

<Field helpText="支持方向键、Enter、Escape、Home、End 和首字母定位。" label="项目状态" required>
  <Select
    name="status"
    options={[
      { label: "待处理", textValue: "pending", value: "pending" },
      { label: "处理中", textValue: "processing", value: "processing" }
    ]}
    placeholder="请选择状态"
  />
</Field>
```

## API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `ReactNode` | `undefined` | 表单项标签，会通过 `htmlFor` 关联到子输入控件。 |
| `helpText` | `ReactNode` | `undefined` | 说明文本，会自动追加到子输入控件的 `aria-describedby`。 |
| `errorText` | `ReactNode` | `undefined` | 错误提示内容，会传递给子输入控件渲染错误态。 |
| `invalid` | `boolean` | `false` | 手动进入错误状态，会传递给子输入控件。 |
| `required` | `boolean` | `false` | 渲染必填标记，并在子控件未显式设置 `required` 时传递原生必填语义。 |
| `requiredMark` | `ReactNode` | `"*"` | 必填标记内容。 |
| `optionalText` | `ReactNode` | `undefined` | 非必填字段的辅助标识，例如 `选填`。 |
| `controlId` | `string` | `undefined` | 子输入控件 id。未传入时会优先沿用子控件已有 `id`，否则自动生成。 |
| `children` | `ReactElement<FieldControlProps>` | 必填 | Rush 输入控件，例如 `Input`、`Textarea`、`CheckboxGroup`、`RadioGroup`、`Select`。 |

组件同时继承 `React.HTMLAttributes<HTMLDivElement>`，可以使用 `className`、`style`、`data-*` 等根节点属性。

## 可访问性

- `label` 会渲染为原生 `<label>`，通过 `htmlFor` 指向子输入控件，并把标签文本 id 合并到子控件的 `aria-labelledby`，支持 `CheckboxGroup`、`RadioGroup`、`Select` 这类组控件。
- 未提供 `controlId` 且子输入没有 `id` 时，组件会自动生成稳定 id。
- `helpText` 会自动合并到子输入控件的 `aria-describedby`，不会覆盖已有描述关系。
- `required` 会传递给子输入控件；视觉必填标记使用 `aria-hidden`，必填语义来自原生 `required`。
- `errorText` 会传递给 `Input` / `Textarea` / `CheckboxGroup` / `RadioGroup` / `Select`，由输入组件设置 `aria-invalid`、渲染错误文本并关联 `aria-describedby`。
- `Field` 不改变子输入的键盘、禁用、只读、复制粘贴和表单提交语义。

## 设计边界

- `Field` 只负责表单项结构，不负责表单状态管理、校验触发、提交和布局栅格。
- `Field` 不重复渲染错误文本，而是把错误信息交给子控件，避免错误与字数统计、选项弹层或组控件状态分裂。
- `required` 默认不会覆盖子控件显式传入的 `required={false}`。
- 复杂表单布局、字段组和表单校验上下文应由后续独立组件或业务表单层承载。
