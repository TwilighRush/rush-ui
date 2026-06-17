# Checkbox 复选框

`Checkbox` 用于后台系统中的确认项、多选筛选、批量选择和权限配置。组件基于原生 `<input type="checkbox">` 渲染，保留浏览器默认勾选、键盘和表单提交行为，并统一尺寸、半选、说明文本、错误态、禁用态和焦点样式。

## 导入

```tsx
import { Checkbox } from "@rush-ui/react";
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
```

## 受控用法

```tsx
const [checked, setChecked] = useState(false);

<Checkbox checked={checked} onCheckedChange={setChecked}>
  允许成员导出报表
</Checkbox>;
```

需要原生事件对象时，可以继续使用 `onChange`。

## API

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

## 可访问性

- 使用原生 `<input type="checkbox">`，保留 Tab 聚焦、Space 切换和表单提交能力。
- 可访问名称优先由 `children` 渲染的 label 提供；无可见 label 时应使用 `aria-label` 或 `aria-labelledby`。
- `description` 和 `errorText` 会自动追加到 `aria-describedby`。
- `invalid={true}` 时会设置 `aria-invalid="true"`。
- `indeterminate={true}` 时会同步 `input.indeterminate`，并设置 `aria-checked="mixed"`。
- `disabled` 使用原生禁用语义，不可聚焦也不可提交。
- 颜色不是唯一状态表达：选中、半选、错误和禁用都通过形状、边框、标记或语义属性共同表达。

## 设计边界

- `Checkbox` 只负责单个复选框，不负责复选组、全选逻辑和批量选择状态计算。
- 半选状态由调用方控制；用户点击后的最终状态应由业务逻辑更新 `checked` / `indeterminate`。
- 复选组、筛选组和权限矩阵应由后续组合组件或业务层编排。
- 复杂解释文本不应塞进 label；可以使用 `description`，长内容应放到表单区域说明中。
