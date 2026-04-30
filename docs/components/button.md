# Button 按钮

`Button` 用于触发页面、表单、表格和工具栏里的操作。组件基于原生 `<button>` 渲染，默认 `type="button"`，避免在表单中意外提交。

## 导入

```tsx
import { Button } from "@rush-ui/react";
```

## 基础用法

```tsx
<Button>保存变更</Button>
<Button variant="outline">取消</Button>
<Button loading loadingText="保存中">
  保存
</Button>
```

## API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `variant` | `"solid" \| "outline" \| "ghost" \| "subtle"` | `"solid"` | 控制视觉层级，不改变按钮语义。 |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 控制高度、内边距、字号和图标尺寸。 |
| `loading` | `boolean` | `false` | 展示加载状态，并使用原生 `disabled` 阻止重复触发。 |
| `loadingText` | `string` | `undefined` | 加载时替换按钮文案。未传入时保留原始 `children`。 |
| `startIcon` | `ReactNode` | `undefined` | 在文案前展示图标，加载时会被 loading 指示器替代。 |
| `endIcon` | `ReactNode` | `undefined` | 在文案后展示图标，加载时隐藏。 |

组件同时继承 `React.ButtonHTMLAttributes<HTMLButtonElement>`，可以直接使用 `type`、`disabled`、`onClick`、`aria-*`、`data-*`、`name`、`value`、`form` 和 `autoFocus` 等原生属性。

## 可访问性

- 使用原生 `<button>`，默认支持 `Enter` 和 `Space` 键触发。
- `disabled` 和 `loading` 都会设置原生 `disabled`，保证鼠标、键盘和辅助技术语义一致。
- `loading={true}` 时会设置 `aria-busy="true"`，并通过可见文案或 `loadingText` 传达当前状态。
- 图标插槽默认作为装饰内容处理，按钮的可访问名称应来自清晰的文本 `children` 或 `loadingText`。
- 所有视觉变体都需要保持清晰的 `:focus-visible` 焦点样式。

## 设计边界

- `Button` 不支持纯图标按钮。只包含图标的操作应使用 `IconButton`。
- `Button` 不负责路由跳转、异步状态管理、分裂按钮或下拉菜单。
- 布局宽度由容器控制，组件不内置 `fullWidth`。
