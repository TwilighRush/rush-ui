# Switch

`Switch` 用于切换立即生效的二元设置，例如允许登录、邮件通知和自动审批。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `checked` | `boolean` | - | 受控状态。 |
| `defaultChecked` | `boolean` | `false` | 非受控初始状态。 |
| `onCheckedChange` | `(checked: boolean) => void` | - | 状态变化回调。 |
| `size` | `sm \| md \| lg` | `md` | 尺寸。 |
| `disabled` | `boolean` | `false` | 禁用交互。 |
| `description` | `ReactNode` | - | 补充说明，并关联到 `aria-describedby`。 |
| `invalid` | `boolean` | `false` | 错误视觉与 `aria-invalid`。 |
| `errorText` | `ReactNode` | - | invalid 时显示并关联的错误信息。 |
| `name` | `string` | - | 提交表单时使用的字段名。 |
| `value` | `string` | `on` | 选中时提交的值。 |
| `children` | `ReactNode` | - | 可见且可点击的稳定名称。 |
| `className` | `string` | - | 根包装元素类名。 |

## 可访问性

- 使用原生 `input[type="checkbox"]` 与 `role="switch"`，`ref` 指向该 input。
- 支持 Tab 聚焦和 Space 切换；不覆盖 Enter 的浏览器/表单默认行为。
- 必须通过可见 label、`aria-label` 或 `aria-labelledby` 提供名称。
- `checked` / `defaultChecked`、name/value、required、form submit 和 reset 使用原生行为。
- 三种视觉尺寸都保留至少 44px 的交互命中高度。

## 边界

- label 文案不能随开关状态变化，否则可访问名称会不稳定。
- Switch 表示立即生效的状态；一次性动作或需要确认的变更应使用 Button / Dialog。
- v1 不支持不确定态、三态或内置加载态。
