# Rush UI

Rush UI 是一个基于 `pnpm workspace` 的 React 组件库 monorepo，面向后台与管理端场景，当前已经完成基础工程搭建，并落地了 `Button` 和 `IconButton` 两个基础操作组件。

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

### `@rush-ui/react`

主组件包，对外暴露 React 组件与相关类型。

当前已提供：

- `Button`
- `IconButton`
- `ButtonProps`
- `ButtonVariant`
- `ButtonSize`
- `IconButtonProps`
- `IconButtonVariant`
- `IconButtonSize`

组件内部类名工具仅供源码使用，不从 npm 入口导出。

### `@rush-ui/tokens`

设计 token 包，当前包含：

- 色板
- 圆角
- 间距
- 阴影

这部分主要作为样式系统和组件视觉实现的基础层。

### `@rush-ui/utils`

通用工具包，当前包含轻量工具函数：

- `cx`

用于基础 className 拼接等通用场景。

### `@rush-ui/docs`

文档站与组件预览应用，承担：

- 本地文档预览
- Storybook 宿主
- 组件集成展示

## 已实现内容

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

- Button 文档: [docs/components/button.md](/Users/shuang/Documents/frontend/proj/RushUI/docs/components/button.md)
- Button RFC: [docs/rfcs/button.md](/Users/shuang/Documents/frontend/proj/RushUI/docs/rfcs/button.md)

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

- IconButton 文档: [docs/components/icon-button.md](/Users/shuang/Documents/frontend/proj/RushUI/docs/components/icon-button.md)

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

## 开发约定

组件与仓库约定请优先参考：

- [AGENTS.md](/Users/shuang/Documents/frontend/proj/RushUI/AGENTS.md)
- [component-conventions.md](/Users/shuang/Documents/frontend/proj/RushUI/component-conventions.md)
- [Git 提交规范](/Users/shuang/Documents/frontend/proj/RushUI/docs/contributing/git-commit.md)

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

## 后续建议

下一阶段比较自然的推进方向：

1. 继续实现 `Input`、`Badge` 等后台高频基础组件。
2. 为 Storybook 补充更系统的文档导航和用例分组。
3. 随组件增长继续扩展语义化 token，并保持 CSS 变量层与组件样式同步。
