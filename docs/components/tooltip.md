# Tooltip

`Tooltip` 用于给可聚焦控件提供短说明，适合图标按钮、截断文本、字段解释和紧凑操作说明。

## 导入

```tsx
import { Tooltip } from "@rush_ui/react";
```

## 基础用法

```tsx
import { IconButton, Tooltip } from "@rush_ui/react";

export function RefreshAction() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <IconButton aria-label="刷新列表" icon={<RefreshIcon />} />
      </Tooltip.Trigger>
      <Tooltip.Content>重新获取最新数据</Tooltip.Content>
    </Tooltip.Root>
  );
}
```

`Tooltip.Trigger` 会增强它的唯一子元素。子元素必须能接收 `ref` 和事件处理器，例如 Rush UI 的 `Button`、`IconButton`，或原生 `button`、`a`、`input`。

## 字段解释

字段解释适合放在 label 旁边，说明填写规则，但不应替代表单帮助文本或错误提示。

```tsx
import { Field, IconButton, Input, Tooltip } from "@rush_ui/react";

export function DisplayNameField() {
  return (
    <Field
      helpText="展示名称会用于成员列表和审批记录。"
      label={
        <span style={{ alignItems: "center", display: "inline-flex", gap: 8 }}>
          展示名称
          <Tooltip.Root>
            <Tooltip.Trigger>
              <IconButton aria-label="查看展示名称说明" icon={<QuestionIcon />} size="sm" variant="ghost" />
            </Tooltip.Trigger>
            <Tooltip.Content align="start">建议使用真实姓名或团队内统一昵称。</Tooltip.Content>
          </Tooltip.Root>
        </span>
      }
    >
      <Input placeholder="请输入展示名称" />
    </Field>
  );
}
```

## 方向与延迟

默认方向是 `top`，默认对齐是 `center`。当首选方向空间不足时会自动翻转。

```tsx
<Tooltip.Root openDelay={300} closeDelay={80}>
  <Tooltip.Trigger>
    <button type="button">查看规则</button>
  </Tooltip.Trigger>
  <Tooltip.Content side="right" align="start" sideOffset={10}>
    修改后会立即影响成员登录权限。
  </Tooltip.Content>
</Tooltip.Root>
```

## 受控用法

```tsx
const [open, setOpen] = useState(false);

<Tooltip.Root open={open} onOpenChange={setOpen}>
  <Tooltip.Trigger>
    <button type="button">显示说明</button>
  </Tooltip.Trigger>
  <Tooltip.Content>外部状态控制 Tooltip 是否显示。</Tooltip.Content>
</Tooltip.Root>;
```

受控模式下，`Tooltip` 只通过 `onOpenChange` 发出打开/关闭意图，是否真正渲染由外部 `open` 决定。

## 禁用 Tooltip

```tsx
<Tooltip.Root disabled>
  <Tooltip.Trigger>
    <button type="button">暂无说明</button>
  </Tooltip.Trigger>
  <Tooltip.Content>这段内容不会显示。</Tooltip.Content>
</Tooltip.Root>
```

需要注意：原生 `disabled` 控件无法获得焦点，也不会触发鼠标事件。如果需要给禁用控件解释原因，应把 Tooltip 绑定在外层可聚焦说明按钮或相邻帮助入口上。

## API

### Tooltip.Root

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | 受控打开状态。 |
| `defaultOpen` | `boolean` | `false` | 非受控初始打开状态。 |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | 打开状态变化回调。 |
| `openDelay` | `number` | `500` | 鼠标 hover 打开的延迟，单位毫秒；键盘 focus 始终立即打开。 |
| `closeDelay` | `number` | `120` | 鼠标离开或失焦后的关闭延迟，单位毫秒。 |
| `disabled` | `boolean` | `false` | 禁用 Tooltip 行为，不渲染说明内容。 |

### Tooltip.Trigger

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `children` | `ReactElement` | 必填 | 唯一子元素，必须是可聚焦并能接收 `ref` 的元素或组件。 |
| `className` | `string` | `undefined` | 追加到触发元素上的类名。 |

### Tooltip.Content

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` | 首选显示方向。 |
| `align` | `"start" \| "center" \| "end"` | `"center"` | 与触发元素的对齐方式。 |
| `sideOffset` | `number` | `8` | 与触发元素的距离，单位像素。 |
| `className` | `string` | `undefined` | 内容节点类名。 |

`Tooltip.Content` 同时继承 `React.HTMLAttributes<HTMLDivElement>`，可以使用 `style`、`data-*`、`aria-*` 和普通 DOM 事件。

## 可访问性

- `Trigger` 必须包裹一个可聚焦元素，例如 `button`、`IconButton`、链接或表单控件。
- 打开时，触发元素通过 `aria-describedby` 关联 `role="tooltip"` 的内容。
- 鼠标 hover 会在 `openDelay` 后打开；键盘 focus 会立即打开，避免键盘用户等待说明出现。
- 鼠标离开触发器或内容后，会在 `closeDelay` 后关闭。
- Escape 会关闭 Tooltip。
- Tooltip 不接管焦点，不应包含按钮、输入框、链接等可交互内容；需要交互内容时使用 `Popover`。

## 定位边界

- 支持 `top | right | bottom | left` 与 `start | center | end`。
- 首选方向空间不足时会向反方向翻转，scroll、resize 和内容尺寸变化会更新位置。
- v1 不提供箭头、自定义 Portal 容器、富内容布局或命令式全局 tooltip。

## 设计边界

- Tooltip 只表达短说明，不放表单、菜单、按钮或链接。
- Tooltip 不替代可见标签。图标按钮仍必须通过 `aria-label` 或 `aria-labelledby` 提供稳定名称。
- 长段解释、可点击内容、筛选面板和快捷设置应使用 `Popover`。
- 阻断式确认和危险操作说明应使用 `Dialog` 或后续专门的 `AlertDialog`。
