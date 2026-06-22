# DropdownMenu

`DropdownMenu` 用于收纳与当前对象相关的紧凑操作，由 `Root`、`Trigger`、`Content`、`Item`、`Label` 和 `Separator` 组成。

## 核心 API

| 组件 | 主要属性 | 说明 |
| --- | --- | --- |
| `DropdownMenu.Root` | `open`、`defaultOpen`、`onOpenChange` | 控制菜单打开状态。 |
| `DropdownMenu.Trigger` | `ButtonProps` | 点击、Enter、Space 或上下方向键打开菜单。 |
| `DropdownMenu.Content` | `side`、`align`、`sideOffset`、`className` | 定位菜单并在空间不足时自动翻转。 |
| `DropdownMenu.Item` | `disabled`、`textValue`、`inset`、`onSelect`、`className` | 可选择菜单项。复杂文案应提供 `textValue`。 |
| `DropdownMenu.Label` | div 属性 | 菜单分组标签。 |
| `DropdownMenu.Separator` | div 属性 | 菜单分隔线。 |

## 可访问性

- 使用 menu button / menu / menuitem 语义；Content 默认由 Trigger 命名。
- 支持 ArrowUp、ArrowDown、Home、End、Escape、Tab 和 700ms 多字符 typeahead。
- 禁用项保留在菜单焦点与朗读顺序中，但设置 `aria-disabled` 且不能激活。
- 选择或 Escape 关闭后焦点返回 Trigger；Tab 关闭后按 Trigger 的页面顺序继续。
- Item 的 `onClick` 调用 `preventDefault()` 可以阻止 `onSelect` 和自动关闭。

## 边界

- v1 不支持子菜单、复选/单选菜单项和自定义 Portal 容器。
- DropdownMenu 只承载即时命令；导航链接、选择值和复杂表单应使用对应语义组件。
