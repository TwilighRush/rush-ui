# Rush UI

Rush UI 是一个基于 `pnpm workspace` 的 React 组件库 monorepo，面向后台与管理端场景，提供基础表单、导航、浮层与反馈组件。

仓库技术栈：

- React
- TypeScript
- Vite
- Storybook
- Vitest
- Changesets
- Less

## 项目结构

```text
apps/
  docs/           文档站与 Storybook 宿主

packages/
  react/          对外 React 组件包
  tokens/         设计 token
  utils/          通用工具函数

docs/
  rfcs/           组件 RFC 文档
```

## 各包职责

### `@rush_ui/react`

主组件包，对外暴露 React 组件与相关类型。

当前已提供：

- `Alert`
- `Badge`
- `Button`
- `Checkbox`
- `CheckboxGroup`
- `Dialog`
- `DropdownMenu`
- `Field`
- `IconButton`
- `Input`
- `Popover`
- `Radio`
- `RadioGroup`
- `Select`
- `Switch`
- `Tabs`
- `Textarea`
- `AlertProps`
- `AlertVariant`
- `BadgeProps`
- `BadgeVariant`
- `BadgeSize`
- `ButtonProps`
- `ButtonVariant`
- `ButtonSize`
- `CheckboxProps`
- `CheckboxGroupProps`
- `CheckboxGroupOrientation`
- `CheckboxSize`
- `DialogRootProps`
- `DialogTriggerProps`
- `DialogContentProps`
- `DialogTitleProps`
- `DialogDescriptionProps`
- `DialogCloseProps`
- `DropdownMenuRootProps`
- `DropdownMenuTriggerProps`
- `DropdownMenuContentProps`
- `DropdownMenuItemProps`
- `FieldProps`
- `FieldControlProps`
- `IconButtonProps`
- `IconButtonVariant`
- `IconButtonSize`
- `InputProps`
- `InputSize`
- `PopoverRootProps`
- `PopoverTriggerProps`
- `PopoverContentProps`
- `RadioProps`
- `RadioGroupProps`
- `RadioGroupOrientation`
- `RadioSize`
- `SelectProps`
- `SelectOption`
- `SelectSize`
- `SwitchProps`
- `SwitchSize`
- `TabsRootProps`
- `TabsListProps`
- `TabsTriggerProps`
- `TabsContentProps`
- `TabsOrientation`
- `TabsActivationMode`
- `TextareaProps`
- `TextareaSize`
- `TextareaAutoSizeOptions`

组件内部类名工具仅供源码使用，不从 npm 入口导出。

### `@rush_ui/tokens`

设计 token 包，当前包含：

- 色板
- 语义状态色
- 圆角
- 间距
- 阴影

这部分主要作为样式系统和组件视觉实现的基础层。

### `@rush_ui/utils`

通用工具包，当前包含轻量工具函数：

- `cx`

用于基础 className 拼接等通用场景。

### `@rush_ui/docs`

文档站与组件预览应用，承担：

- 本地文档预览
- Storybook 宿主
- 组件集成展示

## 已实现内容

### Alert

`Alert` 用于页面、表单和流程区域内的非阻断反馈，支持：

- `variant`: `default | success | warning | error | info`
- `title`
- `icon`
- `actions`
- `className`
- `forwardRef<HTMLDivElement>`
- `role="status"` / `role="alert"` 默认语义，可由使用方覆盖

相关文档：

- Alert 文档: [docs/components/alert.md](docs/components/alert.md)
- Alert RFC: [docs/rfcs/alert.md](docs/rfcs/alert.md)

### Badge

`Badge` 用于表格、详情页、筛选器和流程记录中的轻量状态标识，支持：

- `variant`: `default | success | warning | error | info | processing`
- `size`: `sm | md | lg`
- `className`
- `forwardRef<HTMLSpanElement>`

相关文档：

- Badge 文档: [docs/components/badge.md](docs/components/badge.md)
- Badge RFC: [docs/rfcs/badge.md](docs/rfcs/badge.md)

### Button

已根据 RFC 完成 `Button` 的首版实现，支持：

- `variant`: `solid | outline | ghost | subtle`
- `size`: `sm | md | lg`
- `disabled`
- `loading`
- `loadingText`
- `startIcon`
- `endIcon`
- `forwardRef<HTMLButtonElement>`

相关文档：

- Button 文档: [docs/components/button.md](docs/components/button.md)
- Button RFC: [docs/rfcs/button.md](docs/rfcs/button.md)

### Field

`Field` 用于把标签、说明文本、必填标记、错误态和 Rush 输入控件组合成表单项，支持：

- `label`
- `helpText`
- `errorText`
- `invalid`
- `required`
- `requiredMark`
- `optionalText`
- `controlId`
- `className`
- `forwardRef<HTMLDivElement>`

相关文档：

- Field 文档: [docs/components/field.md](docs/components/field.md)
- Field RFC: [docs/rfcs/field.md](docs/rfcs/field.md)

### Checkbox

`Checkbox` / `CheckboxGroup` 用于确认项、多选筛选、批量选择和权限配置，支持：

- `size`: `sm | md | lg`
- `checked` / `defaultChecked`
- `value` / `defaultValue`
- `orientation`: `vertical | horizontal`
- `disabled`
- `indeterminate`
- `invalid`
- `description`
- `errorText`
- `onCheckedChange`
- `onValueChange`
- `forwardRef<HTMLInputElement>`
- `CheckboxGroup` `forwardRef<HTMLDivElement>`

相关文档：

- Checkbox 文档: [docs/components/checkbox.md](docs/components/checkbox.md)
- Checkbox RFC: [docs/rfcs/checkbox.md](docs/rfcs/checkbox.md)

### Radio

`Radio` / `RadioGroup` 用于互斥选项、筛选条件、默认策略和配置分支，支持：

- `size`: `sm | md | lg`
- `value` / `defaultValue`
- `disabled`
- `invalid`
- `required`
- `description`
- `errorText`
- `orientation`: `vertical | horizontal`
- `onCheckedChange`
- `onValueChange`
- 方向键、Home 和 End 组内移动
- `Radio` `forwardRef<HTMLInputElement>`
- `RadioGroup` `forwardRef<HTMLDivElement>`

相关文档：

- Radio 文档: [docs/components/radio.md](docs/components/radio.md)
- Radio RFC: [docs/rfcs/radio.md](docs/rfcs/radio.md)

### Select

`Select` 用于筛选条件、默认负责人、审批模式和配置分支等单选选择场景，支持：

- `size`: `sm | md | lg`
- `value` / `defaultValue`
- `name`
- `disabled`
- `invalid`
- `required`
- `placeholder`
- `emptyText`
- `options`
- `onValueChange`
- Arrow、Enter、Escape、Home、End 和 typeahead
- `forwardRef<HTMLButtonElement>`

相关文档：

- Select 文档: [docs/components/select.md](docs/components/select.md)
- Select RFC: [docs/rfcs/select.md](docs/rfcs/select.md)

### Switch

`Switch` 用于立即生效的开关设置，使用原生 checkbox 作为交互和表单基础，支持：

- `size`: `sm | md | lg`
- `checked` / `defaultChecked`
- `disabled`
- `invalid`
- `description`
- `errorText`
- `onCheckedChange`
- `forwardRef<HTMLInputElement>`

相关文档：

- Switch 文档: [docs/components/switch.md](docs/components/switch.md)
- Switch RFC: [docs/rfcs/switch.md](docs/rfcs/switch.md)

### Tabs

`Tabs` 用于在同一页面区域切换互斥内容面板，支持：

- `value` / `defaultValue`
- `orientation`: `horizontal | vertical`
- `activationMode`: `automatic | manual`
- `forceMount`
- 禁用标签页跳过
- 方向键、Home 和 End 键盘导航
- `forwardRef` 到 Root、List、Trigger 和 Content

相关文档：

- Tabs 文档: [docs/components/tabs.md](docs/components/tabs.md)
- Tabs RFC: [docs/rfcs/tabs.md](docs/rfcs/tabs.md)

### DropdownMenu

`DropdownMenu` 用于收纳与当前对象相关的紧凑操作，支持：

- `open` / `defaultOpen`
- `onOpenChange`
- `side` / `align` / `sideOffset`
- `disabled`
- `textValue`
- `onSelect`
- 方向键、Home、End、Escape 和多字符定位
- `forwardRef` 到 Trigger、Content、Item、Label 和 Separator

相关文档：

- DropdownMenu 文档: [docs/components/dropdown-menu.md](docs/components/dropdown-menu.md)
- DropdownMenu RFC: [docs/rfcs/dropdown-menu.md](docs/rfcs/dropdown-menu.md)

### Popover

`Popover` 用于轻量筛选、快捷设置和补充信息，支持：

- `open` / `defaultOpen`
- `onOpenChange`
- `side` / `align` / `sideOffset`
- `initialFocusRef`
- Escape 和外部点击关闭
- `forwardRef` 到 Trigger 和 Content

相关文档：

- Popover 文档: [docs/components/popover.md](docs/components/popover.md)
- Popover RFC: [docs/rfcs/popover.md](docs/rfcs/popover.md)

### Dialog

`Dialog` 用于阻断式确认和短流程编辑，支持：

- `open` / `defaultOpen`
- `onOpenChange`
- `closeOnBackdropClick`
- `initialFocusRef`
- 背景 inert、页面滚动锁定、焦点环和关闭后焦点恢复
- `forwardRef` 到 Trigger、Content、Title、Description 和 Close

相关文档：

- Dialog 文档: [docs/components/dialog.md](docs/components/dialog.md)
- Dialog RFC: [docs/rfcs/dialog.md](docs/rfcs/dialog.md)

### IconButton

`IconButton` 用于纯图标操作，支持：

- `variant`: `solid | outline | ghost | subtle`
- `size`: `sm | md | lg`
- `disabled`
- `loading`
- `icon`
- `aria-label` 或 `aria-labelledby`
- `forwardRef<HTMLButtonElement>`

相关文档：

- IconButton 文档: [docs/components/icon-button.md](docs/components/icon-button.md)

### Input

`Input` 用于单行文本录入，支持：

- `size`: `sm | md | lg`
- `disabled`
- `readOnly`
- `invalid`
- `errorText`
- `prefix`
- `suffix`
- `startAddon`
- `endAddon`
- `allowClear`
- `showCount`
- `value` / `defaultValue`
- `onValueChange`
- `forwardRef<HTMLInputElement>`

相关文档：

- Input 文档: [docs/components/input.md](docs/components/input.md)
- Input RFC: [docs/rfcs/input.md](docs/rfcs/input.md)

### Textarea

`Textarea` 用于备注、说明、审批意见和长文本配置，支持：

- `size`: `sm | md | lg`
- `disabled`
- `readOnly`
- `invalid`
- `errorText`
- `suffix`
- `showCount`
- `autoSize`
- `value` / `defaultValue`
- `onValueChange`
- `forwardRef<HTMLTextAreaElement>`

相关文档：

- Textarea 文档: [docs/components/textarea.md](docs/components/textarea.md)
- Textarea RFC: [docs/rfcs/textarea.md](docs/rfcs/textarea.md)

## 安装与使用

安装 React 组件包：

```bash
pnpm add @rush_ui/react
```

在应用入口加载组件样式，再按需导入组件：

```tsx
import "@rush_ui/react/styles.css";
import { Button } from "@rush_ui/react";
```

## 开发命令

安装依赖：

```bash
pnpm install
```

启动 docs：

```bash
pnpm dev
```

启动 Storybook：

```bash
pnpm storybook
```

启用 Git 提交校验：

```bash
pnpm setup-hooks
```

执行检查：

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Changesets 相关：

```bash
pnpm changeset
pnpm version-packages
pnpm release
```

CI、版本 PR 与 Trusted Publishing 发布流程参见 [发布流程](https://github.com/TwilighRush/rush-ui/blob/main/docs/contributing/release.md)。

## 开发约定

组件与仓库约定请优先参考：

- [AGENTS.md](AGENTS.md)
- [component-conventions.md](component-conventions.md)
- [Git 提交规范](docs/contributing/git-commit.md)
- [发布流程](docs/contributing/release.md)

核心原则：

- 优先语义化 HTML
- 交互组件必须支持 `forwardRef`
- 样式优先使用 Less 与 token
- 测试覆盖行为而不是内部实现细节
- Storybook、tests、类型和导出必须同步维护

## 当前验证状态

当前仓库已经验证通过：

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- Storybook 可启动

## 当前阶段

`0.2` 阶段聚焦复杂交互基础和管理端页面闭环：公共组件共享 Portal、浮层定位、外部关闭和受控状态能力，并通过成员管理集成 Story 验证 loading、empty、error 和键盘流程。
