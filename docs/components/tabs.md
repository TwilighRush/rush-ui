# Tabs

`Tabs` 用于在同一工作上下文中切换并列内容，由 `Root`、`List`、`Trigger` 和 `Content` 组成。

## 核心 API

| 组件 | 主要属性 | 说明 |
| --- | --- | --- |
| `Tabs.Root` | `value` 或 `defaultValue`、`onValueChange`、`orientation`、`activationMode` | 受控模式只传 value，非受控模式只传 defaultValue。 |
| `Tabs.List` | div 属性 | 页签列表，应提供可访问名称。 |
| `Tabs.Trigger` | `value`、`disabled`、button 属性 | 页签触发器。 |
| `Tabs.Content` | `value`、`forceMount`、div 属性 | 与触发器关联的内容面板。 |

## 可访问性

- 遵循 WAI-ARIA `tablist`、`tab`、`tabpanel` 模式。
- 水平排列使用左右方向键，垂直排列使用上下方向键，并支持 Home、End。
- 自动模式在移动焦点时切换内容；手动模式需要 Enter 或 Space 激活。
- 禁用页签不参与键盘导航。

## 状态与挂载

- `value` 和 `defaultValue` 由联合类型约束，必须明确初始值，组件不会依赖子节点注册顺序猜测默认项。
- 非激活 Content 默认卸载；`forceMount` 保留 DOM 和内部状态，同时设置 `hidden`。
- Trigger value 在同一个 Root 内必须唯一；外部受控值失效时组件不会自动改写它。
