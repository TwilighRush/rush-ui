# Tooltip RFC

## 状态

- 评审通过
- 评审日期：2026-06-25

## 摘要

`Tooltip` 是说明型非交互浮层，用于给可聚焦控件提供短文本补充。它解决图标按钮、紧凑工具栏、字段说明和截断文本的可访问说明问题，不承载复杂内容。

## 目标

- 支持受控 / 非受控打开状态。
- 提供 Root、Trigger、Content 组合 API。
- Trigger 支持增强单个可聚焦子元素，便于和 `IconButton`、`Button`、链接、输入控件组合。
- 鼠标 hover 延迟打开，键盘 focus 立即打开。
- 支持 Escape 关闭。
- 支持 top / right / bottom / left 与 start / center / end 对齐。
- 通过 Portal 渲染，避免被父级 overflow 裁剪。
- 支持 `className` 和 `ref`。

## 非目标

- v1 不支持交互内容、复杂排版、标题区、操作区。
- v1 不支持箭头、自定义 Portal 容器、嵌套 Tooltip 或命令式全局 tooltip。
- v1 不为 disabled 原生控件兜底；原生 disabled 控件不可聚焦，也不会触发鼠标/键盘事件。
- v1 不替代 Popover、DropdownMenu 或 Dialog。

## 公共 API

```ts
interface TooltipRootProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
  disabled?: boolean;
}

interface TooltipTriggerProps {
  children: React.ReactElement;
  className?: string;
}

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}
```

`Tooltip` 导出 `{ Root, Trigger, Content }`。

## 行为

- `pointerenter` 后等待 `openDelay` 打开，默认 500ms。
- `focus` 立即打开，避免键盘用户等待。
- `pointerleave` / `blur` 后等待 `closeDelay` 关闭，默认 120ms。
- 鼠标从 Trigger 移动到 Content 时不会立即关闭。
- Escape 关闭当前 Tooltip。
- 受控模式下只触发 `onOpenChange`，是否渲染由外部 `open` 决定。

## ARIA 与语义

- Content 使用 `role="tooltip"`。
- Trigger 在打开时通过 `aria-describedby` 指向 Content。
- Tooltip 不移动焦点，不设置 `aria-haspopup` / `aria-expanded`，避免把说明型内容误表达为可交互弹层。
- Tooltip 内容不应包含可聚焦元素；需要表单、按钮、链接或菜单时使用 `Popover` / `DropdownMenu` / `Dialog`。

## 定位

- 使用 fixed 定位并限制在视口安全边距内。
- scroll / resize / ResizeObserver 更新通过 `requestAnimationFrame` 合并。
- 首选 side 空间不足且反方向空间更大时自动翻转。
- Tooltip 在普通页面使用 `--rui-z-tooltip`，嵌套在 Dialog / Popover 里时作为 branch 显示在父浮层之上。

## Stories

- 图标按钮说明。
- 字段解释。
- 四个方向和对齐。
- 受控状态。
- 禁用 Tooltip。
- 长文本换行。

## Tests

- focus 打开和 `aria-describedby` 关联。
- hover 延迟打开和关闭延迟。
- pointer 从 Trigger 移动到 Content 时保持打开。
- Escape 关闭。
- 受控状态。
- disabled 状态。
- Trigger / Content ref 与 className。
- 嵌套 Dialog 时的 z-index 分支。
