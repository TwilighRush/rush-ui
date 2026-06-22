# Popover RFC

## 状态

- 评审通过
- 评审日期：2026-06-22

## 摘要

`Popover` 是由按钮打开的非模态交互浮层，用于轻量编辑、筛选和补充信息。它不是 Tooltip：内容可以获得焦点并包含表单控件。

## 目标

- 支持受控 / 非受控打开状态。
- 提供 Root、Trigger、Content 组合 API。
- 支持 top / right / bottom / left 与 start / center / end 对齐。
- 打开后把焦点送入内容，关闭后提供可预测的文档焦点顺序。
- 支持 Escape、外部点击、窗口变化和触发器尺寸变化。
- Trigger 复用 Button props；Content 支持 `className` 和 `ref`。

## 非目标

- v1 不支持模态 Popover、箭头、嵌套 Popover、碰撞翻转和自定义 Portal 容器。
- v1 不替代 Tooltip、Menu 或 Dialog。

## 公共 API

```ts
interface PopoverRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type PopoverTriggerProps = ButtonProps;

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}
```

`Popover` 导出 `{ Root, Trigger, Content }`。

## 焦点行为

- 打开后优先聚焦 `initialFocusRef`，否则聚焦第一个可聚焦后代，再回退到 Content。
- `Escape` 关闭并把焦点恢复到 Trigger。
- 从最后一个可聚焦项按 `Tab` 时关闭，并聚焦 Trigger 之后的下一个文档可聚焦元素。
- 从第一个可聚焦项按 `Shift+Tab` 时关闭并聚焦 Trigger。
- 焦点通过鼠标或脚本移到 Trigger / Content 外时关闭，不强制抢回焦点。
- Popover 不建立焦点环。

## ARIA 与语义

- Trigger 是 button，设置 `aria-haspopup="dialog"`、`aria-expanded` 和 `aria-controls`。
- Content 使用 `role="dialog"`，不设置 `aria-modal`。
- Content 必须通过 `aria-label` 或 `aria-labelledby` 获得可访问名称。
- 纯说明性、不可交互内容应使用 Tooltip 或普通页面内容，而不是 Popover。

## 定位

- 使用 fixed 定位并限制在视口安全边距内。
- scroll / resize / ResizeObserver 更新通过 `requestAnimationFrame` 合并。
- 首选 side 空间不足且反方向空间更大时自动翻转；调用方不应依赖内部坐标结构。

## Stories

- 四个 side 与三种 align。
- 受控状态。
- 表单内容和显式初始焦点。
- 长内容与窄视口。
- 禁用 Trigger。

## Tests

- 受控 / 非受控打开关闭。
- 初始焦点、Tab / Shift+Tab 顺序、Escape 恢复。
- 外部指针和外部焦点关闭。
- Trigger / Content ARIA、ref、className。
- 定位帧合并和 observer 清理。
