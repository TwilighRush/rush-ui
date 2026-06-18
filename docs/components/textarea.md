# Textarea 文本域

`Textarea` 用于后台系统中的备注、说明、审批意见和长文本配置。组件基于原生 `<textarea>` 渲染，保留浏览器默认多行输入行为，并与 `Input` 保持一致的尺寸、错误态、字数统计、受控/非受控和焦点样式。

## 导入

```tsx
import { Textarea } from "@rush_ui/react";
```

## 基础用法

```tsx
<label htmlFor="remark">备注</label>
<Textarea id="remark" placeholder="请输入备注" />

<Textarea aria-label="审批意见" invalid errorText="请输入审批意见" />

<Textarea aria-label="客户备注" maxLength={120} showCount />

<Textarea aria-label="处理说明" autoSize={{ minRows: 2, maxRows: 6 }} />

<Textarea aria-label="快捷备注" suffix="⌘ Enter" />
```

## 受控用法

```tsx
const [value, setValue] = useState("");

<Textarea aria-label="备注" value={value} onValueChange={setValue} />;
```

需要原生事件对象时，可以继续使用 `onChange`。

## API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 控制字号、间距、最小高度和内边距。 |
| `invalid` | `boolean` | `false` | 进入错误状态，并设置 `aria-invalid="true"`。 |
| `errorText` | `ReactNode` | `undefined` | 错误提示内容。错误态下会自动关联到 `aria-describedby`。 |
| `suffix` | `ReactNode` | `undefined` | 文本域内部后置装饰内容，组件会作为装饰内容隐藏给辅助技术。 |
| `showCount` | `boolean` | `false` | 展示当前字符数；同时传入 `maxLength` 时展示为 `当前数 / 上限`。 |
| `autoSize` | `boolean \| { minRows?: number; maxRows?: number }` | `false` | 根据内容自动调整高度。传入 `maxRows` 后，超出高度保留内部滚动。 |
| `onValueChange` | `(value: string) => void` | `undefined` | 输入值变化后的语义回调。 |

组件同时继承除原生 `children` 和 `size` 外的 `React.TextareaHTMLAttributes<HTMLTextAreaElement>`，可以直接使用 `name`、`value`、`defaultValue`、`disabled`、`readOnly`、`required`、`placeholder`、`maxLength`、`autoComplete`、`autoFocus`、`rows`、`cols`、`onChange`、`aria-*` 和 `data-*` 等原生属性。

## 可访问性

- 使用原生 `<textarea>`，保留多行键盘输入、复制粘贴、Tab 聚焦和表单提交能力。
- 文本域的可访问名称应由外部 `<label>`、`aria-label` 或 `aria-labelledby` 提供。
- `invalid={true}` 时会设置 `aria-invalid="true"`。
- 同时传入 `errorText` 时，错误提示会自动追加到 `aria-describedby`。
- `showCount={true}` 时，字数统计会自动追加到 `aria-describedby`。
- `disabled` 使用原生禁用语义；`readOnly` 使用原生只读语义并保留可聚焦能力。
- `autoSize` 只调整视觉高度，不改变原生输入、选择和提交语义。
- `suffix` 适合快捷键提示、状态图标等纯装饰内容，不应承载必要语义。

## 设计边界

- `Textarea` 只负责多行文本输入控件，不负责 label、帮助文本、表单布局和校验调度。
- `Textarea` 与 `Input` 保持同族表单输入视觉，但不复制单行输入的清空按钮和前后缀 addon。
- `suffix` 是后置装饰位，不用于交互控件；需要按钮或菜单时应放在字段外部组合。
- `autoSize` 适合备注、说明和评论输入；需要固定编辑区域时继续使用原生 `rows` 或外部样式控制高度。
