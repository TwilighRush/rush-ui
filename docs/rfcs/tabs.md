# Tabs RFC

## 状态

- 评审通过
- 评审日期：2026-06-22

## 摘要

`Tabs` 在同一页面区域切换互斥内容面板，遵循 WAI-ARIA tabs 模式，并支持自动和手动激活。

## 目标

- 提供 Root、List、Trigger、Content 组合 API。
- 受控模式只要求 `value`，非受控模式只要求 `defaultValue`。
- 支持 horizontal / vertical 和 automatic / manual。
- 支持方向键、Home、End、Enter、Space 与禁用 Tab。
- 所有节点支持 `className` 和 `ref`。

## 非目标

- v1 不支持动态关闭、拖拽排序、懒加载协议和路由同步。
- v1 不自动选择第一个 Tab；初始值必须明确，避免 SSR 与客户端注册顺序不一致。

## 公共 API

```ts
interface TabsSharedRootProps extends React.HTMLAttributes<HTMLDivElement> {
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  activationMode?: "automatic" | "manual";
}

type TabsRootProps = TabsSharedRootProps & (
  | { value: string; defaultValue?: never }
  | { value?: never; defaultValue: string }
);

type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  forceMount?: boolean;
}
```

`Tabs` 导出 `{ Root, List, Trigger, Content }`。

## 键盘行为

- Horizontal：`ArrowLeft` / `ArrowRight` 循环移动焦点。
- Vertical：`ArrowUp` / `ArrowDown` 循环移动焦点。
- `Home` / `End`：聚焦首个 / 末个可用 Tab。
- automatic：方向键移动焦点时立即激活。
- manual：方向键只移动焦点，`Enter` / `Space` 才激活。
- 禁用 Trigger 不参与方向键和 Home / End。
- `Tab` 从激活 Tab 进入其面板或面板内第一个可聚焦内容，行为由页面 DOM 顺序决定。

## ARIA 与挂载

- List 使用 `role="tablist"` 和 `aria-orientation`。
- Trigger 使用 `role="tab"`、`aria-selected`、`aria-controls`；仅激活 Trigger 为 `tabIndex=0`。
- Content 使用 `role="tabpanel"` 和 `aria-labelledby`。
- 非激活 Content 默认不挂载；`forceMount` 时保留节点并设置 `hidden`。
- 面板自身仅在没有天然可聚焦首项时设置 `tabIndex=0`，v1 统一保留该回退。

## 状态边界

- `value` 与 Trigger 不匹配时不自动改写外部值，所有面板保持未激活。
- Trigger value 在同一个 Root 内必须唯一。
- 运行时增删 Tab 时，调用方负责把受控值更新为仍存在的 Trigger。

## Stories

- automatic horizontal。
- manual activation。
- vertical。
- 禁用 Tab。
- forceMount 状态保留。

## Tests

- 受控 / 非受控切换和类型测试。
- 两种方向、两种激活模式、Home / End。
- Enter / Space 手动激活。
- disabled、forceMount、ARIA 关联。
- Root/List/Trigger/Content 的 ref 与 className。
