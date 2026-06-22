# Dialog RFC

## 状态

- 评审通过
- 评审日期：2026-06-22

## 摘要

`Dialog` 是阻断式任务容器，用于确认、编辑和需要用户明确结束的流程。组件遵循 WAI-ARIA modal dialog 模式，负责焦点进入、焦点环、背景不可交互、Escape 关闭和焦点恢复。

## 目标

- 支持受控和非受控打开状态。
- 提供 Root、Trigger、Content、Title、Description、Close 组合 API。
- Content 必须具有可访问名称，并自动关联 Title / Description。
- 支持初始焦点定向、键盘焦点环、遮罩关闭和焦点恢复。
- Trigger / Close 复用 Button props；所有节点支持 `className` 和 `ref`。
- 样式完全由主题变量驱动。

## 非目标

- v1 不支持嵌套模态。
- v1 不公开 Portal 容器、拖拽、缩放和非模态模式。
- v1 不提供确认业务语义或异步提交状态机。

## 公共 API

```ts
interface DialogRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type DialogTriggerProps = ButtonProps;
type DialogCloseProps = ButtonProps;

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  closeOnBackdropClick?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
```

`Dialog` 导出 `{ Root, Trigger, Content, Title, Description, Close }`。

## 状态契约

- `open` 存在时为受控模式；内部不回写受控值，只调用 `onOpenChange`。
- 非受控模式以 `defaultOpen` 初始化。
- Trigger 点击请求打开；Close、Escape 和允许的遮罩点击请求关闭。
- 外部受控关闭同样执行清理和焦点恢复。

## 焦点行为

- 打开后优先聚焦 `initialFocusRef` 指向且可聚焦的元素。
- 未提供有效初始目标时，聚焦 Content 内第一个可聚焦元素；仍不存在时聚焦 Content。
- `Tab` / `Shift+Tab` 在 Content 内循环。
- 焦点被脚本移到模态外时，组件将其拉回当前 Dialog。
- `Escape` 关闭并阻止事件继续关闭背景层。
- 关闭后恢复到打开前的焦点；若该节点已脱离文档，则回退到 Trigger。

## ARIA 与语义

- Content 使用 `role="dialog"` 和 `aria-modal="true"`。
- 默认使用 Title id 作为 `aria-labelledby`，Description 挂载时使用其 id 作为 `aria-describedby`。
- 调用方可用显式 `aria-label` / `aria-labelledby` 覆盖默认命名。
- 无 Title 且没有显式可访问名称属于无效用法，应由测试和 Storybook a11y 检查拦截。
- 背景内容在 Dialog 打开期间设置 inert；仅当背景真正不可交互时才设置 `aria-modal="true"`。

## Portal 与层级

- Content 统一 Portal 到 Trigger 所属 `document.body`。
- v1 不公开 `container`，避免把 Portal 目标变成未定义的公共结构契约。
- 页面滚动在打开期间锁定，并在所有 Dialog 关闭后恢复原值。

## 视觉约束

- 遮罩、表面、边框、阴影和焦点环均引用主题 CSS 变量。
- Content 提供合理的窄屏边距和最大高度；内容溢出时内部滚动。
- reduced motion 下移除位移和缩放动画。

## Stories

- 默认确认对话框。
- 受控打开状态。
- 表单内容与显式初始焦点。
- 长内容滚动。
- 禁用 Trigger / Close 加载态。

## Tests

- 受控 / 非受控打开关闭。
- Trigger、Close、Escape 和遮罩行为。
- 初始焦点、Tab 环、外部焦点拦截、关闭恢复。
- Title / Description ARIA 关联和显式名称覆盖。
- 背景 inert、滚动锁清理、ref、className。
