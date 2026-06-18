# Git 提交规范

本文档定义 Rush UI 仓库的 Git 提交信息、提交粒度和提交前检查要求。目标是让历史记录可读、可追踪，并能和 Changesets 发布流程稳定配合。

## 提交信息格式

提交信息使用 Conventional Commits 风格：

```text
<type>(<scope>): <subject>

<body>

<footer>
```

只有第一行是必填。`body` 和 `footer` 在需要说明背景、破坏性变更或关联 issue 时使用。

## 本地 hook

仓库提供 `.githooks/commit-msg`，用于在本地提交时校验提交信息。

首次克隆或 hooksPath 未配置时，执行：

```bash
pnpm setup-hooks
```

该命令会把当前仓库的 Git hooks 路径设置为 `.githooks`，并确保 `commit-msg` hook 可执行。

当前 hook 会检查：

- 提交首行必须符合 `<type>(<scope>): <subject>`。
- `type` 必须来自本文档列出的类型。
- `scope` 只能使用小写字母、数字和连字符。
- `subject` 必须包含中文。
- `subject` 不超过 72 个字符。

hook 只负责拦截明显不合规的提交信息；提交粒度、Changesets 和验证命令仍需要按本文档人工确认。

## type 类型

| 类型 | 使用场景 |
| --- | --- |
| `feat` | 新增组件、能力、公开 API 或用户可感知的功能。 |
| `fix` | 修复 bug、视觉缺陷、可访问性问题或错误行为。 |
| `docs` | 只修改文档、示例说明、注释类内容。 |
| `style` | 只调整格式、空白、样式书写方式，不改变行为。 |
| `refactor` | 重构实现，不新增功能也不修复用户可见 bug。 |
| `test` | 新增或调整测试。 |
| `build` | 修改构建、打包、依赖解析、发布配置。 |
| `ci` | 修改 CI、自动化检查或发布流水线。 |
| `chore` | 维护性改动，例如依赖升级、脚本调整、仓库 housekeeping。 |
| `perf` | 性能优化。 |
| `revert` | 回滚历史提交。 |

## scope 范围

`scope` 用于说明改动影响的包、应用或模块。推荐使用以下范围：

| scope | 含义 |
| --- | --- |
| `react` | `packages/react` 对外组件包。 |
| `tokens` | `packages/tokens` 设计 token 包。 |
| `utils` | `packages/utils` 工具包。 |
| `docs` | `apps/docs`、Storybook 或文档站。 |
| `button` | Button 组件。 |
| `icon-button` | IconButton 组件。 |
| `input` | Input 组件。 |
| `storybook` | Storybook 配置或 stories。 |
| `repo` | 根目录配置、workspace、lint、tsconfig 等仓库级改动。 |
| `release` | Changesets、版本号、发布流程。 |

如果一次提交同时影响多个范围，优先选择用户最关心或变更最核心的范围。范围不清晰时可以省略 `scope`。

## subject 主题

主题行要求：

- 使用中文，简洁描述“做了什么”。
- 使用祈使或动宾结构，例如“新增 IconButton 组件”“修复加载态 spinner 变形”。
- 不超过 72 个字符。
- 结尾不加句号。
- 避免空泛描述，例如“更新代码”“修改问题”“优化一下”。

推荐示例：

```text
feat(icon-button): 新增纯图标按钮组件
fix(button): 修复加载态 spinner 椭圆变形
docs(button): 补充可访问性说明
refactor(react): 收紧公开入口导出
test(button): 覆盖表单提交行为
build(repo): 调整 Vite 类型声明输出
```

不推荐示例：

```text
update
fix bug
修改按钮
wip
提交代码
```

## body 正文

当改动不容易从主题行看清时，使用正文说明背景和取舍。正文建议回答：

- 为什么需要这个改动。
- 改动了哪些关键行为或边界。
- 是否有兼容性风险。
- 验证了哪些命令或场景。

示例：

```text
fix(button): 修复加载态 spinner 椭圆变形

加载态之前使用了双层 span，外层没有继承固定尺寸，部分布局下旋转环会被压扁。
现在将 spinner 收敛为单个受控方形节点，并通过 aspect-ratio 和 box-sizing 保持圆形。

验证：pnpm --filter @rush_ui/react test
```

## footer 页脚

页脚用于记录破坏性变更、关联 issue 或迁移说明。

破坏性变更必须使用 `BREAKING CHANGE:`：

```text
feat(react): 移除内部工具的公开导出

BREAKING CHANGE: 不再从 @rush_ui/react 导出 createComponentClassName。
```

关联 issue 可以使用：

```text
Refs #12
Closes #18
```

## 提交粒度

一次提交应该表达一个完整意图。建议拆分：

- 组件实现和无关文档整理分开。
- 格式化和行为修改分开。
- 重构和 bug 修复分开。
- 依赖升级和业务改动分开。

可以合并：

- 同一个组件的实现、样式、测试、stories 和文档。
- 同一个 bug 的代码修复和对应回归测试。
- 同一个公开 API 改动和必要的 changeset。

## Changesets 要求

当改动影响公开 npm 包 API、用户可见行为或发布内容时，需要添加 changeset。

需要 changeset 的情况：

- 新增、删除或修改 `@rush_ui/react` 导出的组件、类型或 props。
- 改变组件默认行为、视觉状态、可访问性语义。
- 修改 `@rush_ui/tokens` 或 `@rush_ui/utils` 的公开导出。
- 修复会影响使用者的组件 bug。

通常不需要 changeset 的情况：

- 只修改 README、内部文档或开发说明。
- 只修改测试，不改变产物。
- 只调整 Storybook 展示但不改变组件包行为。
- 只修改内部未导出的实现，且不影响用户可见行为。

提交示例：

```text
feat(icon-button): 新增纯图标按钮组件

新增 IconButton 的实现、样式、测试、Storybook 用例和可访问性文档。
该组件通过 aria-label 或 aria-labelledby 提供可访问名称。

Changeset: .changeset/bright-icons-wait.md
```

## 提交前检查

提交前至少确认：

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

如果只改动某个包，可以先跑对应包的过滤命令，但合并前仍建议跑全量检查：

```bash
pnpm --filter @rush_ui/react test
pnpm --filter @rush_ui/react typecheck
pnpm --filter @rush_ui/react build
```

组件相关改动还需要确认：

- stories 能正常加载。
- 键盘交互符合组件文档。
- disabled、loading、error 等边界状态有测试或 story 覆盖。
- 新增公开 API 时已更新入口导出、文档和 changeset。

## 常见提交模板

新增组件：

```text
feat(<component>): 新增 <Component> 组件
```

修复组件问题：

```text
fix(<component>): 修复 <具体问题>
```

补测试：

```text
test(<component>): 覆盖 <行为或状态>
```

补文档：

```text
docs(<component>): 补充 <主题> 说明
```

仓库配置：

```text
chore(repo): 调整 <工具或配置> 设置
```

发布准备：

```text
chore(release): 添加 <包名> 的 changeset
```

## 回滚提交

回滚提交使用 `revert` 类型，并说明回滚原因：

```text
revert(button): 回滚加载态样式调整

该调整导致 outline 变体在深色背景下对比度不足，先回滚等待重新设计。
```
