# 交互组件 RFC 评审记录

## 状态

- 评审通过
- 评审日期：2026-06-22
- 范围：Dialog、Popover、DropdownMenu、Tabs、Switch

## 评审依据

- 仓库根目录 `AGENTS.md` 的组件、无障碍、测试和完成定义。
- 既有 Button、Field、Checkbox、Select 的公共 API 与视觉约定。
- WAI-ARIA APG：
  - [Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
  - [Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
  - [Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
  - [Switch Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)
- HTML 原生控件语义和当前 Rush UI 主题令牌体系。

## 评审结论

五个 RFC 均通过，可以进入重新实现阶段。通过不代表接受当前代码；当前未提交实现只作为问题样本，不作为兼容基线。

## 阻断问题

以下问题必须在重新实现中消除，否则不能发布：

1. Popover 打开后没有建立内容区焦点，Portal 会破坏自然 Tab 顺序。
2. Dialog 的自定义 `container` 可能使 inert 逻辑隐藏对话框自身或其祖先。
3. Tabs 在受控模式下仍要求 `defaultValue`，类型契约错误。
4. Switch 使用 button 加隐藏 input 模拟表单控件，增加表单重置、required 和键盘行为的同步成本。
5. DropdownMenu 的禁用项完全退出焦点模型，且 typeahead 仅匹配单字符。
6. 浮层定位在 scroll / resize 上同步读写布局，没有帧级合并。
7. 浮层阴影、遮罩和交互背景存在硬编码颜色，未完全由 CSS 变量承载。
8. 小尺寸控件的可点击区域不足，触屏操作不稳健。

## 横向决策

### 公共 API

- 继续采用 compound components，保持结构清晰且避免暴露内部 DOM 查询接口。
- Trigger 复用 Rush UI `Button` 的 props、ref 和视觉变体，不新增 `asChild`。
- v1 不公开 Portal `container`；自定义挂载点需要独立 RFC，必须同时解决 ownerDocument、inert 和层级栈。
- 所有公共 props 和 compound 子组件均导出类型。

### 焦点与 Portal

- Portal 统一挂载到触发器所属文档的 `body`。
- Dialog 负责初始焦点、焦点环、Escape 关闭和关闭后焦点恢复。
- Popover / DropdownMenu 打开后焦点进入内容；Tab 离开时按触发器所在文档顺序继续，而不是跳到 Portal 尾部。
- 浮层只监听自身打开期间的事件；定位更新通过 `requestAnimationFrame` 合并，并监听触发器和内容尺寸变化。

### 语义与表单

- Dialog 使用 `role="dialog"`、`aria-modal="true"`，且必须具有可访问名称。
- Popover 定义为非模态交互浮层，使用 `role="dialog"`，且必须具有可访问名称。
- DropdownMenu 使用 menu button / menu / menuitem 模式。
- Tabs 使用 tablist / tab / tabpanel 模式。
- Switch 使用原生 `input[type="checkbox"]` 加 `role="switch"`，让表单提交、重置、required 和 Space 键由浏览器负责。

### 样式与令牌

- 遮罩、浮层阴影、选中/悬停背景和开关拇指阴影必须由主题 CSS 变量提供。
- 视觉尺寸可以小于 44px，但交互命中区域不得小于 44px。
- 动画遵守 `prefers-reduced-motion`。

### 测试门槛

- 每个组件覆盖受控与非受控、禁用、键盘、ref、className 和核心 ARIA。
- 浮层覆盖 Escape、外部点击、焦点进入、焦点离开和恢复。
- Storybook 提供默认、受控、禁用、长内容/空态和组合流程。
- 发布前执行 lint、类型检查、Vitest、包构建、Storybook 构建和浏览器 smoke test。

## 非目标

- 不在本轮引入第三方无障碍 primitive 依赖。
- 不支持嵌套模态、子菜单、可编辑 Tabs、Popover 箭头和浮层碰撞翻转。
- 不承诺当前未发布实现的 API 兼容性。

## 通过的 RFC

- [Dialog RFC](./dialog.md)
- [Popover RFC](./popover.md)
- [DropdownMenu RFC](./dropdown-menu.md)
- [Tabs RFC](./tabs.md)
- [Switch RFC](./switch.md)
