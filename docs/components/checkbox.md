# Checkbox 复选框

`Checkbox` / `CheckboxGroup` 用于后台系统中的确认项、多选筛选、批量选择和权限配置。组件基于原生 `<input type="checkbox">` 渲染，保留浏览器默认勾选、键盘和表单提交行为，并统一尺寸、半选、说明文本、组级错误态、禁用态和焦点样式。

## 导入

```tsx
import { Checkbox, CheckboxGroup, Field } from "@rush-ui/react";
```

## 基础用法

```tsx
<Checkbox defaultChecked>接收审批通知</Checkbox>

<Checkbox description="开启后成员可以查看当前工作区内所有客户资料。">
  授予客户资料访问权限
</Checkbox>

<Checkbox indeterminate>本页部分记录已选</Checkbox>

<Checkbox invalid errorText="请确认后再提交">
  我已确认影响范围
</Checkbox>

<CheckboxGroup defaultValue={["email"]} name="channels">
  <Checkbox value="email">邮件通知</Checkbox>
  <Checkbox value="sms">短信通知</Checkbox>
  <Checkbox disabled value="webhook">
    Webhook 暂不可用
  </Checkbox>
</CheckboxGroup>
```

## 受控用法

```tsx
const [checked, setChecked] = useState(false);

<Checkbox checked={checked} onCheckedChange={setChecked}>
  允许成员导出报表
</Checkbox>;
```

需要原生事件对象时，可以继续使用 `onChange`。

## 复选组

```tsx
const [value, setValue] = useState(["read"]);

<CheckboxGroup value={value} onValueChange={setValue}>
  <Checkbox description="允许查看客户资料、跟进记录和基础统计。" value="read">
    查看
  </Checkbox>
  <Checkbox value="export">导出</Checkbox>
  <Checkbox value="archive">归档</Checkbox>
</CheckboxGroup>;
```

`CheckboxGroup` 会统一组内 `name`、`size`、`disabled` 和 `invalid`，并通过字符串数组管理选中项。

## 与 Field 组合

```tsx
<Field helpText="用于控制成员在客户资料中的操作范围。" label="权限范围" required>
  <CheckboxGroup defaultValue={["read"]} name="permission">
    <Checkbox value="read">查看</Checkbox>
    <Checkbox value="export">导出</Checkbox>
    <Checkbox value="archive">归档</Checkbox>
  </CheckboxGroup>
</Field>

<Field errorText="请至少选择一个通知渠道" label="通知渠道" required>
  <CheckboxGroup name="channels">
    <Checkbox value="email">邮件通知</Checkbox>
    <Checkbox value="sms">短信通知</Checkbox>
  </CheckboxGroup>
</Field>
```

`Field` 会把 label、helpText、required 和 errorText 关联到 `CheckboxGroup`。`CheckboxGroup.required` 是组级必填语义，不会强制每个子复选框都设置原生 `required`。

## Checkbox API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 控制勾选框尺寸、文字大小和可点击区域。 |
| `checked` | `boolean` | `undefined` | 受控勾选状态，继承自原生 checkbox。 |
| `defaultChecked` | `boolean` | `undefined` | 非受控初始勾选状态，继承自原生 checkbox。 |
| `indeterminate` | `boolean` | `false` | 半选状态，会同步到底层 `input.indeterminate` 并设置 `aria-checked="mixed"`。 |
| `invalid` | `boolean` | `false` | 进入错误状态，并设置 `aria-invalid="true"`。 |
| `description` | `ReactNode` | `undefined` | 说明文本，会自动追加到 `aria-describedby`。 |
| `errorText` | `ReactNode` | `undefined` | 错误提示内容。错误态下会自动追加到 `aria-describedby`。 |
| `onCheckedChange` | `(checked: boolean) => void` | `undefined` | 勾选状态变化后的语义回调。 |

组件同时继承除原生 `children`、`size` 和 `type` 外的 `React.InputHTMLAttributes<HTMLInputElement>`，可以直接使用 `name`、`value`、`checked`、`defaultChecked`、`disabled`、`required`、`autoFocus`、`onChange`、`aria-*` 和 `data-*` 等原生属性。

## CheckboxGroup API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string[]` | `undefined` | 受控选中值数组。 |
| `defaultValue` | `string[]` | `[]` | 非受控初始选中值数组。 |
| `name` | `string` | 自动生成 | 组内 checkbox 共用的原生表单字段名。 |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 统一组内 Checkbox 尺寸。 |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | 视觉排列方向。 |
| `disabled` | `boolean` | `false` | 禁用整个复选组。 |
| `invalid` | `boolean` | `false` | 进入错误状态，并传递给组内 Checkbox。 |
| `required` | `boolean` | `false` | 标记复选组必填，并通过隐藏描述向辅助技术暴露必填语义。 |
| `errorText` | `ReactNode` | `undefined` | 组级错误提示内容，会自动追加到 `aria-describedby`。 |
| `onValueChange` | `(value: string[]) => void` | `undefined` | 选中值数组变化后的语义回调。 |

`CheckboxGroup` 同时继承除 `defaultValue` 和 `onChange` 外的 `React.HTMLAttributes<HTMLDivElement>`，可以使用 `aria-label`、`aria-labelledby`、`className`、`style` 和 `data-*` 等根节点属性。

## 可访问性

- 使用原生 `<input type="checkbox">`，保留 Tab 聚焦、Space 切换和表单提交能力。
- `CheckboxGroup` 使用 `role="group"`，并通过统一 `name` 保持同组表单提交字段。
- 可访问名称优先由 `children` 渲染的 label 提供；无可见 label 时应使用 `aria-label` 或 `aria-labelledby`。
- `CheckboxGroup` 应通过 `aria-label`、`aria-labelledby` 或 `Field label` 获得可访问名称。
- `description` 和 `errorText` 会自动追加到 `aria-describedby`。
- `CheckboxGroup.errorText` 和 `Field.helpText` / `Field.errorText` 会自动追加到组根节点的 `aria-describedby`。
- `invalid={true}` 时会设置 `aria-invalid="true"`。
- `CheckboxGroup.required` 会追加屏幕阅读器可读的必填描述，避免把“至少选择一个”的语义误传成每个子项都必选。
- `indeterminate={true}` 时会同步 `input.indeterminate`，并设置 `aria-checked="mixed"`。
- `disabled` 使用原生禁用语义，不可聚焦也不可提交。
- 颜色不是唯一状态表达：选中、半选、错误和禁用都通过形状、边框、标记或语义属性共同表达。

## 设计边界

- `Checkbox` 只负责单个复选框；`CheckboxGroup` 只负责同组选项的值数组、布局和组级语义。
- 半选状态由调用方控制；用户点击后的最终状态应由业务逻辑更新 `checked` / `indeterminate`。
- 全选、反选、权限矩阵和层级选择仍应由业务层或后续专门组件编排。
- 组内选项应提供稳定且唯一的 `value`；没有传入 `value` 时会落到原生默认值 `"on"`，不适合多个组内选项。
- 复杂解释文本不应塞进 label；可以使用 `description`，长内容应放到表单区域说明中。
