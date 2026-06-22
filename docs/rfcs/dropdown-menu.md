# DropdownMenu RFC

## 状态

- 评审通过
- 评审日期：2026-06-22

## 摘要

`DropdownMenu` 是 menu button 模式的操作菜单，用于承载一组即时命令。它不是导航栏、选择器或任意内容容器。

## 目标

- 支持受控 / 非受控打开状态。
- 提供 Root、Trigger、Content、Item、Label、Separator。
- 支持完整菜单键盘模型、typeahead、禁用项和焦点恢复。
- Trigger 复用 Button props；所有可交互节点转发 ref。
- 菜单自动以 Trigger 作为可访问名称来源。

## 非目标

- v1 不支持子菜单、复选菜单项、单选菜单项、分组 roving state 和自定义 Portal 容器。
- v1 不用于页面主导航；链接导航应使用语义化链接列表。
- Item 不承载输入框、按钮嵌套或复杂表单。

## 公共 API

```ts
interface DropdownMenuRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type DropdownMenuTriggerProps = ButtonProps;

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
  textValue?: string;
  onSelect?: () => void;
}
```

`DropdownMenu` 导出 `{ Root, Trigger, Content, Item, Label, Separator }`。

## Trigger 键盘行为

- `Enter` / `Space` / `ArrowDown`：打开并聚焦第一个可用 Item。
- `ArrowUp`：打开并聚焦最后一个可用 Item。
- 鼠标点击打开后同样聚焦第一个可用 Item。

## Menu 键盘行为

- `ArrowDown` / `ArrowUp`：在所有 Item 间循环移动焦点。
- `Home` / `End`：移动到第一个 / 最后一个 Item。
- `Enter` / `Space`：激活当前 Item。
- `Escape`：关闭并恢复焦点到 Trigger。
- `Tab`：关闭菜单，并按 Trigger 的页面顺序移动到前一个 / 后一个可聚焦元素。
- 可打印字符：在 700ms 缓冲区内按 `textValue` 做前缀匹配，并从当前项之后循环查找。
- 禁用项保留在方向键和朗读顺序中，但不能被激活；使用 `aria-disabled` 而不是原生 `disabled` 退出焦点模型。

## 选择行为

- Item 激活时先调用原生 `onClick`，再调用 `onSelect`，最后关闭菜单并恢复 Trigger 焦点。
- `onClick` 调用 `event.preventDefault()` 可阻止 `onSelect` 和自动关闭。
- Label 和 Separator 不进入焦点顺序。

## ARIA 与语义

- Trigger 设置 `aria-haspopup="menu"`、`aria-expanded`、`aria-controls`。
- Content 使用 `role="menu"` 和 `aria-labelledby={triggerId}`。
- Item 使用 `role="menuitem"`，禁用时设置 `aria-disabled="true"`。
- Label 使用 `aria-hidden="true"` 的展示语义；Separator 使用 `role="separator"`。

## Stories

- 默认操作菜单。
- 禁用项、分隔符和 inset label。
- 受控状态。
- 长菜单和窄视口。
- 空菜单。

## Tests

- Trigger 四种打开键与点击。
- Arrow、Home、End、Escape、Tab、Shift+Tab。
- 多字符 typeahead 和循环匹配。
- 禁用项可聚焦但不可激活。
- 选择回调、preventDefault、焦点恢复。
- ARIA、ref、className、定位清理。
