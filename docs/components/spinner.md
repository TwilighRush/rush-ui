# Spinner 加载指示

`Spinner` 用于表达短暂、明确的加载状态，例如局部刷新、表格请求、弹层内提交等待和后台任务同步。组件默认带有可访问加载语义，适合在按钮外的区域内使用。

## 导入

```tsx
import { Spinner } from "@rush_ui/react";
```

## 基础用法

```tsx
<Spinner />
```

未传入说明文本时，组件默认使用 `role="status"` 和 `aria-label="加载中"`。

## 带说明文本

```tsx
<Spinner label="正在同步成员权限" />
```

`label` 会作为可见文本渲染，适合说明具体加载对象。长文本会自然换行，但建议保持短句。

## 尺寸

```tsx
<Spinner aria-label="加载紧凑内容" size="sm" />
<Spinner aria-label="加载默认内容" size="md" />
<Spinner aria-label="加载重点内容" size="lg" />
```

- `sm` 适合工具栏、表格单元格和紧凑区域。
- `md` 是默认尺寸，适合常规局部加载。
- `lg` 适合弹层内容区或需要更明确等待提示的区域。

## 局部加载

```tsx
<section aria-busy="true" aria-label="成员列表">
  <Spinner label="刷新中" size="sm" />
</section>
```

`Spinner` 说明加载状态，`aria-busy` 由加载区域负责。

## 装饰模式

```tsx
<Spinner aria-hidden size="sm" />
```

当 Spinner 只是按钮或其他控件里的装饰图标时，传入 `aria-hidden`。此时组件不会输出默认 `role="status"` 和 `aria-label`，等价语义应由父级控件提供。

## API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 控制指示器尺寸、描边和文本字号。 |
| `label` | `ReactNode` | `undefined` | 可见加载说明文本。 |
| `className` | `string` | `undefined` | 传递到根节点，作为样式扩展出口。 |

组件同时继承 `React.HTMLAttributes<HTMLSpanElement>`，可以使用 `id`、`role`、`aria-*`、`data-*`、`style` 和事件属性等原生能力。

## 可访问性

- 默认渲染 `<span role="status">`。
- 未提供 `label` 或 `aria-label` 时，默认使用 `aria-label="加载中"`。
- `label` 是可见文本，适合让视觉用户和辅助技术用户获得一致说明。
- 装饰场景传入 `aria-hidden={true}`，组件会移除默认 status 语义。
- 组件不接管焦点，也不注册键盘事件。
- 动画会在 `prefers-reduced-motion: reduce` 下停止。

## 设计边界

- 结构化内容加载优先使用 `Skeleton`；短暂等待或无固定内容结构时使用 `Spinner`。
- 加载完成但没有内容时使用 `Empty`。
- 常规按钮提交等待优先使用 `Button` 的 `loading` 和 `loadingText`。
- `Spinner` 不表示确定性进度，后续应由 `Progress` 承担。
