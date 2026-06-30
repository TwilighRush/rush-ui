# Empty 空状态

`Empty` 用于展示区域内没有可用内容的状态，例如表格无数据、搜索无结果、首次创建、配置缺失和局部列表为空。组件基于非交互 `<div>` 渲染，不接管焦点，也不内置业务动作。

## 导入

```tsx
import { Button, Empty } from "@rush_ui/react";
```

## 基础用法

```tsx
<Empty description="调整筛选条件或创建第一条记录后，这里会展示对应数据。" title="暂无数据" />
```

## 带操作

```tsx
<Empty
  actions={
    <>
      <Button variant="outline">清空筛选</Button>
      <Button>新建成员</Button>
    </>
  }
  description="没有成员匹配当前关键词和状态筛选，可以清空条件后重新查看全部成员。"
  title="未找到匹配结果"
/>
```

`actions` 只负责布局承载，按钮、链接、loading 和跳转逻辑仍由传入组件自己负责。

## 尺寸

```tsx
<Empty size="sm" title="暂无成员" />
<Empty size="md" title="暂无数据" />
<Empty size="lg" title="还没有项目" />
```

- `sm` 适合表格内部、弹层内列表和紧凑卡片。
- `md` 是默认尺寸，适合页面内容区、普通列表和标准卡片。
- `lg` 适合整页初始态或需要更强引导的空白区域。

## 图标

默认图标是装饰内容，不参与可访问名称。

```tsx
<Empty icon={<span>0</span>} title="字段映射未配置" />
<Empty icon={null} size="sm" title="暂无审批记录" />
```

如果自定义图标表达必要含义，应在 `title` 或 `description` 中提供等价文本。

## API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `ReactNode` | 必填 | 空状态标题，说明当前区域为空的核心原因。 |
| `description` | `ReactNode` | `undefined` | 说明文本，适合补充原因或下一步建议。 |
| `icon` | `ReactNode` | 默认装饰图标 | 图标或插图插槽。传入 `null` 可隐藏图标区域。 |
| `actions` | `ReactNode` | `undefined` | 操作区，通常放置按钮或链接。 |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 控制间距、图标尺寸、标题字号和说明宽度。 |
| `className` | `string` | `undefined` | 传递到根节点，作为样式扩展出口。 |

组件同时继承除原生 `title` 外的 `React.HTMLAttributes<HTMLDivElement>`，可以直接使用 `id`、`role`、`aria-*`、`data-*`、`style` 和事件属性等原生能力。原生 `title` 与组件标题插槽冲突，因此不作为根节点属性暴露。

## 可访问性

- 默认渲染非交互 `<div>`，不会进入键盘焦点顺序，也不接管键盘事件。
- 默认不设置 `role="status"` 或 `aria-live`，避免静态空态被误当作动态播报。
- 默认图标和自定义 `icon` 都作为装饰内容包裹在 `aria-hidden="true"` 容器中，空态含义必须由标题和说明文本表达。
- 当空态是异步加载后出现且需要播报时，可以由使用方传入 `role="status"`、`aria-live="polite"` 或更明确的 `aria-label`。
- `actions` 只负责布局，不替按钮或链接生成可访问名称；操作控件仍应使用清晰文本、`aria-label` 或 `aria-labelledby`。
- 如果空态替换了原本可交互区域，焦点管理应由上层流程处理；`Empty` 不会强制移动焦点。

## 设计边界

- `Empty` 表达“加载完成后没有内容”，不表达加载中；加载中应使用后续 `Spinner` 或 `Skeleton`。
- `Empty` 不负责接口错误、权限错误或危险提示；这类状态优先使用 `Alert`，必要时组合恢复操作。
- `Empty` 不知道表格列、分页、筛选条件或请求状态；后续 `Table` 可以通过空态插槽组合它。
- 首版不提供多套视觉 `variant`，搜索无结果、首次创建和配置缺失应通过文案、图标和操作区表达差异。
