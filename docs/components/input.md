# Input 输入框

`Input` 用于后台系统中的表单、筛选器、表格工具栏和搜索场景。组件基于原生 `<input>` 渲染，保留浏览器默认输入行为，并统一尺寸、错误态、只读态、禁用态、清空按钮、字数统计、图标插槽、前后缀和焦点样式。

## 导入

```tsx
import { Input } from "@rush-ui/react";
```

## 基础用法

```tsx
<label htmlFor="project-name">项目名称</label>
<Input id="project-name" placeholder="请输入项目名称" />

<Input aria-label="金额" startAddon="¥" endAddon="CNY" placeholder="0.00" />

<Input aria-label="邮箱" invalid errorText="请输入有效邮箱" />

<Input allowClear aria-label="搜索关键词" prefix="⌕" placeholder="搜索订单" />

<Input aria-label="项目名称" maxLength={20} showCount />
```

## 受控用法

```tsx
const [value, setValue] = useState("");

<Input aria-label="搜索关键词" value={value} onValueChange={setValue} />;
```

需要原生事件对象时，可以继续使用 `onChange`。

## API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 控制高度、字号、间距和水平内边距。 |
| `invalid` | `boolean` | `false` | 进入错误状态，并设置 `aria-invalid="true"`。 |
| `errorText` | `ReactNode` | `undefined` | 错误提示内容。错误态下会自动关联到 `aria-describedby`。 |
| `prefix` | `ReactNode` | `undefined` | 输入框内部前置装饰图标，组件会作为装饰内容隐藏给辅助技术。 |
| `suffix` | `ReactNode` | `undefined` | 输入框内部后置装饰图标，组件会作为装饰内容隐藏给辅助技术。 |
| `startAddon` | `ReactNode` | `undefined` | 输入框前缀，适合金额符号、搜索提示或协议前缀。 |
| `endAddon` | `ReactNode` | `undefined` | 输入框后缀，适合单位、域名或固定说明。 |
| `allowClear` | `boolean` | `false` | 有值且非禁用、非只读时显示清空按钮。 |
| `clearAriaLabel` | `string` | `"清空输入"` | 清空按钮的可访问名称。 |
| `showCount` | `boolean` | `false` | 展示当前字符数；同时传入 `maxLength` 时展示为 `当前数 / 上限`。 |
| `onClear` | `() => void` | `undefined` | 点击清空按钮后的回调。 |
| `onValueChange` | `(value: string) => void` | `undefined` | 输入值变化后的语义回调。 |

组件同时继承除原生 `children`、`prefix` 和 `size` 外的 `React.InputHTMLAttributes<HTMLInputElement>`，可以直接使用 `type`、`name`、`value`、`defaultValue`、`disabled`、`readOnly`、`required`、`placeholder`、`maxLength`、`autoComplete`、`autoFocus`、`onChange`、`aria-*` 和 `data-*` 等原生属性。

## 可访问性

- 使用原生 `<input>`，保留键盘输入、复制粘贴、Tab 聚焦和表单提交能力。
- 输入框的可访问名称应由外部 `<label>`、`aria-label` 或 `aria-labelledby` 提供。
- `invalid={true}` 时会设置 `aria-invalid="true"`。
- 同时传入 `errorText` 时，错误提示会自动追加到 `aria-describedby`。
- `showCount={true}` 时，字数统计会自动追加到 `aria-describedby`。
- `allowClear={true}` 时，清空按钮使用原生 `<button type="button">`，并通过 `clearAriaLabel` 提供可访问名称。
- `disabled` 使用原生禁用语义；`readOnly` 使用原生只读语义并保留可聚焦能力。
- `prefix` 和 `suffix` 适合纯装饰图标，不应承载必要语义。
- 前后缀不会替代 label。涉及单位、金额或域名时，仍应保证字段本身有清晰名称。

## 设计边界

- `Input` 只负责单行输入控件，不负责 label、帮助文本、表单布局和校验调度。
- `allowClear` 只负责把值清空并触发 `onValueChange("")` / `onClear`；受控模式下仍需要调用方更新 `value`。
- 复杂输入组合、密码可见性切换和选择器能力不放进首版 API。
- 多行文本请使用独立的 `Textarea` 组件。
