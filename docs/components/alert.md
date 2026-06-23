# Alert 提示

`Alert` 用于在页面、表单或流程区域内展示非阻断反馈，例如同步结果、风险提示、配置说明和保存失败原因。组件基于非交互 `<div>` 渲染，不会接管焦点，也不替代 `Dialog` 或 Toast。

## 导入

```tsx
import { Alert } from "@rush_ui/react";
```

## 基础用法

```tsx
<Alert title="同步完成" variant="success">
  客户资料已更新，相关审批任务也已重新计算。
</Alert>

<Alert title="保存失败" variant="error">
  审批规则缺少必填条件，请补充风险等级后重试。
</Alert>
```

## 带操作

```tsx
<Alert
  actions={
    <>
      <Button size="sm" variant="outline">
        稍后处理
      </Button>
      <Button size="sm">查看详情</Button>
    </>
  }
  title="发现 12 条高风险记录"
  variant="warning"
>
  系统已暂停自动通过规则，建议先确认命中原因再继续批量审批。
</Alert>
```

## API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `"default" \| "success" \| "warning" \| "error" \| "info"` | `"info"` | 控制提示语义对应的视觉表现。 |
| `title` | `ReactNode` | `undefined` | 提示标题，适合承载简短结论。 |
| `icon` | `ReactNode` | 状态默认图标 | 提示图标。传入 `null` 可隐藏图标。 |
| `actions` | `ReactNode` | `undefined` | 右侧或下方操作区，通常放置按钮或链接。 |
| `className` | `string` | `undefined` | 传递到根节点，作为样式扩展出口。 |

组件同时继承除原生 `title` 外的 `React.HTMLAttributes<HTMLDivElement>`，可以直接使用 `id`、`role`、`aria-*`、`data-*` 和事件属性等原生能力。原生 `title` 与组件标题插槽冲突，因此不作为根节点属性暴露。

## 可访问性

- 默认 `variant="info"` 会渲染 `role="status"`，用于非紧急状态反馈。
- `variant="error"` 默认渲染 `role="alert"`，用于需要立即注意的错误反馈。
- 如果提示是静态说明或紧急程度不同，可以传入 `role="note"`、`role="status"`、`role="alert"`、`aria-live` 或 `aria-label` 覆盖语义。
- 默认图标和自定义 `icon` 都作为装饰内容包裹在 `aria-hidden="true"` 容器中，状态含义必须由标题和正文文本表达。
- `actions` 只负责布局，不替按钮或链接生成可访问名称；操作控件仍应使用清晰文本、`aria-label` 或 `aria-labelledby`。
- `Alert` 不接管焦点，也不新增键盘交互。需要阻断流程、焦点管理或关闭后焦点恢复时，应使用 `Dialog`。

## 设计边界

- `Alert` 表达区域内反馈，不负责全局通知队列、自动消失、关闭按钮或浮层定位。
- `variant` 是状态语义，不表达强调层级；不要把 `error` 当作普通高亮使用。
- `actions` 应保持少量操作，复杂决策流程应进入页面正文或 `Dialog`。
- 组件不内置关闭状态。可关闭、自动消失或跨页面通知应由后续 `Toast` / `Notification` 类组件承担。
