# Dialog

`Dialog` 用于必须先完成或确认的短流程，例如编辑成员、确认危险操作和补充关键配置。它采用 compound API：`Dialog.Root`、`Trigger`、`Content`、`Title`、`Description`、`Close`。

## 示例

```tsx
<Dialog.Root>
  <Dialog.Trigger>编辑成员</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>编辑成员</Dialog.Title>
    <Dialog.Description>保存后立即生效。</Dialog.Description>
    <Dialog.Close>取消</Dialog.Close>
  </Dialog.Content>
</Dialog.Root>
```

## 核心 API

| 组件 | 主要属性 | 说明 |
| --- | --- | --- |
| `Dialog.Root` | `open`、`defaultOpen`、`onOpenChange` | 支持受控和非受控打开状态。 |
| `Dialog.Trigger` | `ButtonProps` | 打开对话框并记录焦点恢复位置，默认使用 outline Button。 |
| `Dialog.Content` | `closeOnBackdropClick`、`initialFocusRef`、`className` | 对话框主体，固定通过 Portal 渲染到所属文档的 body。 |
| `Dialog.Title` | 标题元素属性 | 提供对话框可访问名称。 |
| `Dialog.Description` | 段落元素属性 | 提供补充说明。 |
| `Dialog.Close` | `ButtonProps` | 关闭并恢复原焦点，默认使用 ghost Button。 |

## 可访问性

- `Content` 使用 `role="dialog"` 与 `aria-modal="true"`。
- 打开后焦点优先进入 `initialFocusRef`，再回退到第一个可聚焦元素或 Content。
- Tab 与 Shift+Tab 保持在对话框内；脚本把焦点移到外部时也会被拉回。
- Escape、关闭按钮和默认背景点击会关闭并恢复打开前焦点。
- 打开期间背景为 inert 且页面滚动锁定；必须通过 `Title`、`aria-label` 或 `aria-labelledby` 提供名称。

## 边界

- v1 不公开 Portal 容器，也不支持嵌套模态。
- Popover、DropdownMenu 和 Select 可以在 Dialog 内通过 Portal 正常工作。
- 异步提交状态由业务层受控管理，Dialog 不内置确认状态机。
