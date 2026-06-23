# Popover

`Popover` 在触发器附近承载轻量设置和补充信息，适合筛选条件、快捷配置和上下文说明。

## 核心 API

| 组件 | 主要属性 | 说明 |
| --- | --- | --- |
| `Popover.Root` | `open`、`defaultOpen`、`onOpenChange` | 支持受控和非受控状态。 |
| `Popover.Trigger` | `ButtonProps` | 切换浮层并暴露展开状态，默认使用 outline Button。 |
| `Popover.Content` | `side`、`align`、`sideOffset`、`initialFocusRef`、`className` | 通过 Portal 定位的非模态交互区域。 |

## 可访问性

- `Trigger` 通过 `aria-expanded` 和 `aria-controls` 关联内容。
- `Content` 使用非模态 dialog 语义，应提供 `aria-label` 或 `aria-labelledby`。
- 打开后焦点进入 `initialFocusRef`、第一个可聚焦后代或 Content。
- Escape 与外部点击关闭；Escape 关闭时焦点回到触发器。
- 从内容末尾按 Tab 时关闭并继续到 Trigger 后的页面元素，Shift+Tab 从首项返回 Trigger。
- Content 内可以组合 Select、DropdownMenu 等会通过 Portal 渲染的子级浮层；子级浮层会显示在 Popover 内容之上。
- 不锁定背景滚动，也不建立焦点环；需要阻断流程时应使用 `Dialog`。

## 定位边界

- 支持 `top | right | bottom | left` 与 `start | center | end`。
- 首选方向空间不足时会向反方向翻转，scroll、resize 和内容尺寸变化会更新位置。
- v1 不公开 Portal 容器、箭头或嵌套 Popover。
