# Radio 单选框

`Radio` / `RadioGroup` 用于后台系统中的互斥选项，例如默认策略、筛选条件、审批模式和配置分支。组件基于原生 `<input type="radio">` 渲染，保留浏览器默认选择、键盘和表单提交行为；`RadioGroup` 统一管理组内 `name`、选中值、禁用、错误、必填和方向键移动。

## 导入

```tsx
import { Field, Radio, RadioGroup } from "@rush_ui/react";
```

## 基础用法

```tsx
<RadioGroup defaultValue="email" name="notice">
  <Radio description="适合审批、账单和权限变更等高优先级事件。" value="email">
    邮件通知
  </Radio>
  <Radio value="sms">短信通知</Radio>
  <Radio disabled value="webhook">
    Webhook 暂不可用
  </Radio>
</RadioGroup>
```

## 受控用法

```tsx
const [value, setValue] = useState("manual");

<RadioGroup value={value} onValueChange={setValue}>
  <Radio value="manual">人工审批</Radio>
  <Radio value="auto">自动审批</Radio>
</RadioGroup>;
```

需要单个 radio 的原生事件对象时，可以继续在 `Radio` 上使用 `onChange`。

## 与 Field 组合

```tsx
<Field helpText="方向键会在可用选项之间移动焦点并更新选择。" label="默认通知方式" required>
  <RadioGroup defaultValue="email" name="defaultNotice">
    <Radio value="email">邮件通知</Radio>
    <Radio value="sms">短信通知</Radio>
  </RadioGroup>
</Field>

<Field errorText="请选择导出范围" label="导出范围" required>
  <RadioGroup name="exportScope">
    <Radio value="current">当前页</Radio>
    <Radio value="all">全部结果</Radio>
  </RadioGroup>
</Field>
```

`Field` 会把 label、helpText、required 和 errorText 关联到 `RadioGroup`，并由 `RadioGroup` 继续把必填和错误态传递给子 `Radio`。

## Radio API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 控制圆点尺寸、文字大小和可点击区域。放在 `RadioGroup` 内时默认继承组尺寸。 |
| `checked` | `boolean` | `undefined` | 单个 Radio 的受控选中状态。组内建议使用 `RadioGroup.value`。 |
| `defaultChecked` | `boolean` | `undefined` | 单个 Radio 的非受控初始选中状态。组内建议使用 `RadioGroup.defaultValue`。 |
| `value` | `string \| number \| readonly string[]` | `"on"` | 原生 radio 值。组内会转为字符串用于匹配 `RadioGroup.value`。 |
| `invalid` | `boolean` | `false` | 进入错误状态，并设置 `aria-invalid="true"`。放在错误组内时自动继承。 |
| `description` | `ReactNode` | `undefined` | 说明文本，会自动追加到 `aria-describedby`。 |
| `errorText` | `ReactNode` | `undefined` | 单个 Radio 的错误提示内容。组级错误建议放在 `RadioGroup.errorText` 或 `Field.errorText`。 |
| `onCheckedChange` | `(checked: boolean) => void` | `undefined` | 单个 Radio 选中状态变化后的语义回调。 |

`Radio` 同时继承除原生 `children`、`size` 和 `type` 外的 `React.InputHTMLAttributes<HTMLInputElement>`，可以直接使用 `name`、`disabled`、`required`、`autoFocus`、`onChange`、`aria-*` 和 `data-*` 等原生属性。

## RadioGroup API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string` | `undefined` | 受控选中值。 |
| `defaultValue` | `string` | `undefined` | 非受控初始选中值。 |
| `name` | `string` | 自动生成 | 组内 radio 共用的原生表单字段名。 |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 统一组内 Radio 尺寸。 |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | 视觉排列方向，并设置 `aria-orientation`。 |
| `disabled` | `boolean` | `false` | 禁用整个单选组。 |
| `invalid` | `boolean` | `false` | 进入错误状态，并传递给组内 Radio。 |
| `required` | `boolean` | `false` | 标记单选组必填，并传递给组内 Radio。 |
| `errorText` | `ReactNode` | `undefined` | 组级错误提示内容，会自动追加到 `aria-describedby`。 |
| `onValueChange` | `(value: string) => void` | `undefined` | 选中值变化后的语义回调。 |

`RadioGroup` 同时继承除 `defaultValue` 和 `onChange` 外的 `React.HTMLAttributes<HTMLDivElement>`，可以使用 `aria-label`、`aria-labelledby`、`className`、`style` 和 `data-*` 等根节点属性。

## 可访问性

- `Radio` 使用原生 `<input type="radio">`，保留 Tab 聚焦、Space 选择和表单提交能力。
- `RadioGroup` 使用 `role="radiogroup"`，并通过统一 `name` 保持原生互斥选择。
- 组内方向键、Home 和 End 会在可用选项之间移动焦点并更新选择；禁用项会被跳过，末尾会循环到开头。
- 可访问名称可由 `Radio` 的 `children`、`aria-label` 或 `aria-labelledby` 提供。
- `RadioGroup` 应通过 `aria-label`、`aria-labelledby` 或 `Field label` 获得可访问名称。
- `description`、`RadioGroup.errorText` 和 `Field.helpText` / `Field.errorText` 会自动追加到对应控件的 `aria-describedby`。
- `invalid={true}` 时会设置 `aria-invalid="true"`；`disabled` 使用原生禁用语义。
- 颜色不是唯一状态表达：选中、错误和禁用都通过圆点、边框、文本或语义属性共同表达。

## 设计边界

- `Radio` 只负责单个单选项，不负责互斥组状态和方向键顺序。
- `RadioGroup` 只负责同一组直接选项的选择行为，不提供复杂分组、分栏布局或条件展示。
- 组内选项应有稳定且唯一的 `value`；没有传入 `value` 时会落到原生默认值 `"on"`，不适合多个组内选项。
- 复杂解释文本不应塞进 label；可以使用 `description`，更长的说明应放在 `Field.helpText` 或表单区域说明中。
