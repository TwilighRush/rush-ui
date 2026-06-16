# Badge 状态标识

`Badge` 用于展示记录、流程或对象的轻量状态，例如表格状态、审批进度、同步结果和筛选条件标识。组件基于非交互的 `<span>` 渲染，默认不改变页面焦点顺序。

## 导入

```tsx
import { Badge } from "@rush-ui/react";
```

## 基础用法

```tsx
<Badge>默认</Badge>
<Badge variant="success">成功</Badge>
<Badge variant="warning">警告</Badge>
<Badge variant="error">错误</Badge>
<Badge variant="info">信息</Badge>
<Badge variant="processing">处理中</Badge>
```

## 尺寸

```tsx
<Badge size="sm" variant="success">
  已完成
</Badge>
<Badge size="md" variant="info">
  已归档
</Badge>
<Badge size="lg" variant="warning">
  待复核
</Badge>
```

## API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `"default" \| "success" \| "warning" \| "error" \| "info" \| "processing"` | `"default"` | 控制状态语义对应的视觉表现。 |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 控制高度、字号、间距和状态圆点尺寸。 |
| `className` | `string` | `undefined` | 传递到根节点，作为样式扩展出口。 |

组件同时继承 `React.HTMLAttributes<HTMLSpanElement>`，可以直接使用 `id`、`title`、`role`、`aria-*`、`data-*` 和事件属性等原生能力。

## 可访问性

- 使用非交互 `<span>`，不会进入键盘焦点顺序，也不接管键盘事件。
- 状态圆点为装饰内容，组件会设置 `aria-hidden="true"`。
- 状态不能只依赖颜色表达，应提供清晰的可见文本，例如“已完成”“待复核”“同步中”。
- 默认不设置 `role="status"`，避免静态状态被误当作 live region。
- 当状态变化需要主动播报时，可以由使用方传入 `role="status"`、`aria-live` 或更明确的 `aria-label`。
- `processing` 的动效会在 `prefers-reduced-motion: reduce` 下关闭，保留静态状态圆点。

## 设计边界

- `Badge` 只表达轻量状态，不负责通知、计数角标、标签移除、筛选项删除或可点击操作。
- `variant` 是状态语义，不承担按钮式视觉层级。
- 组件不内置图标插槽、关闭按钮或复杂布局，避免把内部 DOM 结构变成公共 API。
- 如果需要可交互筛选标签，应后续单独设计 `Tag` 或 `Chip` 类组件。
