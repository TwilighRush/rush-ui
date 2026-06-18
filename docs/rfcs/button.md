# Button RFC

## 状态

- 草案

## 摘要

`Button` 是 `@rush_ui/react` 中的基础操作组件，用于承载后台和管理端场景里的大多数点击触发行为。它应当覆盖常见操作按钮需求，同时不把布局、加载反馈和可访问性细节转嫁给使用方。

本文档只定义 `Button` 的组件设计与接口约束，不包含任何代码实现。

## 目标

- 提供一个稳定、可复用的基础操作组件。
- 保持公开 API 简洁、可预测。
- 通过 `variant` 表达视觉层级，通过 `size` 表达密度与尺寸。
- 支持 `loading` 与图标插槽，降低业务侧重复布局成本。
- 保持语义化按钮行为，并提供稳定的 `ref` 约定。

## 非目标

- 首版不覆盖所有跳转类场景。
- 首版不提供分裂按钮、图标按钮、下拉按钮、切换按钮。
- 首版不提供多态 `as` 渲染能力。
- 首版不暴露内部 DOM 结构或复杂插槽系统。

## 组件职责

`Button` 负责：

- 基于原生 `button` 元素渲染语义化操作入口。
- 统一处理 `variant`、`size`、`disabled`、`loading` 的视觉状态。
- 为前置图标和后置图标预留稳定布局区域。
- 在加载中阻止重复触发。
- 暴露指向主可聚焦元素的 `ref`。
- 保证文本内容与可访问名称的基本一致性。

`Button` 不负责：

- 路由跳转抽象。
- 超出原生按钮范畴的复杂交互模型。
- 异步流程状态管理本身，组件只接收 `loading` 结果。
- 内建 tooltip、badge、menu 等复合能力。

## 建议 API

```ts
type ButtonVariant = "solid" | "outline" | "ghost" | "subtle";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}
```

## Props 设计

### 保留原生 button props

组件应继承 `React.ButtonHTMLAttributes<HTMLButtonElement>`，这样可以自然保留浏览器和表单体系里的标准能力，例如：

- `type`
- `disabled`
- `onClick`
- `aria-*`
- `data-*`
- `name`
- `value`
- `form`
- `autoFocus`

这样做的好处是：

- 保持语义与平台一致。
- 避免为了常见能力重复设计自定义属性。
- 降低学习成本和迁移成本。

### 自定义 props

- `variant`
  作用：控制视觉强调层级。
  默认值：`solid`

- `size`
  作用：控制高度、水平内边距、图标间距和文字尺寸。
  默认值：`md`

- `loading`
  作用：进入加载状态，展示反馈并阻止重复触发。
  默认值：`false`

- `loadingText`
  作用：在加载状态下替换或补充原有文案。
  默认值：`undefined`

- `startIcon`
  作用：在文字前渲染图标，用于增强识别而不要求业务方自己写布局。

- `endIcon`
  作用：在文字后渲染图标，适合方向性或补充性提示。

### 首版明确不纳入的 props

- `as`
  原因：会显著增加类型复杂度、`ref` 约定复杂度和可访问性歧义。

- `isLoading`
  原因：当前约定统一使用 `loading`，避免重复命名。

- `fullWidth`
  原因：布局问题优先交给容器层处理，首版不内置。

- `iconOnly`
  原因：纯图标按钮有独立的可访问性和尺寸规则，更适合未来单独设计 `IconButton`。

## variant 方案

首版建议沿用仓库现有约定：

- `solid`
  用于页面中的主操作。

- `outline`
  用于次级操作，但仍需要明确边界感。

- `ghost`
  用于低强调操作，适合工具栏、表格操作区、内联区域。

- `subtle`
  用于带轻背景的弱强调操作，视觉上比 `ghost` 更完整，但不与主 CTA 抢层级。

约束：

- `variant` 只影响视觉，不改变语义。
- 每个 `variant` 都必须定义 `disabled` 和 `loading` 状态表现。
- 视觉实现应基于 token 和 CSS 变量，而不是把样式语义写死在组件里。
- 首版不把 `danger`、`success` 之类的业务语义混入 `variant` 维度，未来如有需要应考虑增加独立的 `tone` 维度。

## size 方案

首版建议提供：

- `sm`
  用于表格、筛选器、紧凑工具栏等高密度场景。

- `md`
  默认尺寸，用于大多数表单和页面级操作。

- `lg`
  用于空状态、引导区、重点操作区等更高强调场景。

约束：

- `size` 应同时影响最小高度、左右内边距、字号、图标尺寸和图标间距。
- 即便是 `sm`，也应保证可点击区域足够可用。
- 常见情况下不应要求业务方自己调整图标尺寸以适配按钮。

## loading 方案

### 行为定义

- `loading={true}` 时，组件进入加载状态。
- 加载中组件应视为不可交互，避免重复提交或重复触发。
- 实现上应使用原生 `disabled` 属性，使浏览器行为与可访问性语义保持一致。
- 加载反馈应有稳定位置，避免布局跳动。

### 文案策略

建议优先级如下：

1. 如果传入 `loadingText`，优先展示 `loadingText`。
2. 否则保留原始 `children` 文案。

理由：

- `loadingText` 能更明确表达进度语义，如“保存中”“提交中”。
- 保留原文案有助于降低宽度变化和语义丢失风险。

### 图标与 loading 的关系

- 默认由加载指示器替换前置视觉区域。
- `startIcon` 在加载时默认不与 loading 指示器同时展示。
- `endIcon` 在加载时默认隐藏，减少噪音。

## 是否保留 startIcon / endIcon

结论：保留。

原因：

- `Button` 属于简单组件，`startIcon` / `endIcon` 很适合作为轻量插槽存在。
- 它们覆盖了绝大多数常见业务需求，不需要引入更重的复合组件模式。
- 可以让图标间距、对齐、loading 替换逻辑由组件统一处理。
- 与当前仓库约定保持一致。

边界：

- 这两个属性应作为便捷插槽，而不是开放任意复杂布局系统。
- 接收 `ReactNode` 即可，首版不增加额外的 slot class API。
- 不扩展出 `iconSpacing`、`iconOnly`、`iconPosition` 等更多视觉参数。

未来如果业务频繁出现徽标、数字角标、头像、多重前后缀等需求，再考虑升级为更强的 slot 或复合组件设计。

## ref 行为

组件应使用 `React.forwardRef`。

明确约定如下：

- `ref` 指向底层的 `HTMLButtonElement`。
- 使用方可以依赖它进行聚焦、测量、表单集成或浮层联动。
- 当 `loading`、`disabled`、`variant` 变化时，`ref` 指向的主元素不应变化。

不支持的行为：

- 不把 `ref` 指向内部包装节点。
- 不在首版通过切换元素类型破坏 `HTMLButtonElement` 约定。

## 可访问性要求

### 语义要求

- 必须渲染原生 `<button>`。
- 默认 `type` 应为 `button`，避免在表单中意外触发提交。
- 当 `disabled` 或 `loading` 为真时，应设置原生 `disabled` 属性。

### 可访问名称

- 默认以文本 `children` 作为主要可访问名称来源。
- 如果使用 `loadingText` 替换文案，替换后的名称仍应可理解。
- 纯图标按钮不属于本 RFC 范围，后续若设计 `IconButton`，需单独定义命名要求。

### 键盘交互

- 必须支持原生按钮默认的 `Space` 和 `Enter` 行为。
- 不应为了视觉效果覆盖或破坏浏览器默认键盘交互。

### 焦点表现

- 必须有清晰可见的 focus 样式。
- 所有 `variant` 下都必须能感知焦点。
- `disabled` 和 `loading` 状态下不应呈现误导性的焦点反馈。

### 加载与状态传达

- `loading` 状态必须对用户足够清晰。
- 原生 `disabled` 是基础语义。
- 是否追加额外 ARIA 信息，应以实现后是否存在读屏歧义为判断依据，避免过度 ARIA。

### 表单行为

- `Button` 必须正确支持 `type="button" | "submit" | "reset"`。
- 在表单提交场景中，`loading` 必须能阻止重复提交。

## Stories 清单

首版 Storybook 应至少包含：

- `Playground`
- `Variants/Solid`
- `Variants/Outline`
- `Variants/Ghost`
- `Variants/Subtle`
- `Sizes/Small`
- `Sizes/Medium`
- `Sizes/Large`
- `States/Disabled`
- `States/Loading default label`
- `States/Loading with loadingText`
- `Icons/Start icon`
- `Icons/End icon`
- `Icons/Both icons`
- `Forms/Submit button`
- `Accessibility/Focus visible`

补充要求：

- 每个 story 不只是展示，还应说明推荐使用场景。
- 至少有一个 story 放在较真实的后台页面上下文中验证效果。
- Controls 应能切换 `variant`、`size`、`disabled`、`loading`。

## Tests 清单

首版测试应至少覆盖：

- 渲染为原生 `button` 元素。
- `ref` 正确指向 `HTMLButtonElement`。
- 未传 `type` 时默认使用 `type="button"`。
- 传入 `type` 时保留使用方值。
- `children` 能成为可访问名称来源。
- 每个 `variant` 都能产出对应公共状态标记。
- 每个 `size` 都能产出对应公共状态标记。
- `startIcon` 能正确渲染。
- `endIcon` 能正确渲染。
- `disabled` 时不可交互。
- `loading` 时不可交互。
- `loading` 时带有原生 `disabled` 行为。
- `loading` 时能渲染加载反馈。
- `loadingText` 能正确替换或补充文案。
- `loading` 状态下可访问名称仍然合理。
- 能透传标准 `aria-*` 和 `data-*` 属性。
- 在表单中作为 `submit` 按钮可正常工作。
- 存在可用于样式验证的 focus 状态钩子或状态标记。

测试原则：

- 优先测试行为，不测试内部实现细节。
- 避免依赖脆弱的 DOM 结构快照。
- 如果样式状态通过 `data-*` 表达，应测试公共状态标记，而不是内部 class 细节。

## 未来兼容性风险

### 1. 多态渲染诉求

未来很可能有人希望支持 `as="a"` 或与路由组件组合。如果后续新增，会显著增加 `ref`、禁用语义、键盘行为的一致性成本。首版先限定为原生按钮更稳妥。

### 2. 颜色语义可能需要独立维度

未来可能需要 `danger`、`success`、品牌色等语义。如果现在把这些直接塞进 `variant`，后续会让 API 变得混乱。更合理的方向是保留未来增加 `tone` 的空间。

### 3. 纯图标按钮需求

如果业务侧开始大量把 `Button` 当作纯图标按钮使用，就会带来可访问名称和尺寸规范问题。届时更适合新增独立 `IconButton`，而不是继续扩展 `Button`。

### 4. loading 语义分歧

有些产品希望 loading 期间按钮完全禁用，有些则希望仍能保持可聚焦或维持表单上下文。首版采用原生禁用更安全，但后续可能会面临差异化诉求。

### 5. 图标插槽扩张压力

保留 `startIcon` / `endIcon` 是合理的，但如果未来要支持 badge、计数器、头像、多行内容等，更复杂的 slot 体系可能会挤压当前 API 的边界。

### 6. 尺寸体系锁定

一旦公开 `sm | md | lg`，后续新增 `xs` 或 `xl` 就需要更谨慎，否则不同产品线会出现尺寸语义不一致的问题。

### 7. 默认 type 预期差异

组件库里默认 `type="button"` 是更安全的选择，但部分使用方可能默认期待表单里的原生提交行为。这个选择必须在文档和 stories 中明确说明。

## 建议结论

建议通过一个保守的一期方案：

- 仅支持原生按钮语义
- `variant`: `solid | outline | ghost | subtle`
- `size`: `sm | md | lg`
- 支持 `loading` 和可选的 `loadingText`
- 保留 `startIcon` 与 `endIcon`
- 使用 `forwardRef<HTMLButtonElement>`

这个方案足够支撑组件库起步，同时给未来的 `IconButton`、`ButtonLink`、`tone` 等扩展保留空间。
