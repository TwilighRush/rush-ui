# 发布流程

Rush UI 使用 Changesets 管理版本，并通过 GitHub Actions 与 npm Trusted Publishing 自动发布公开包。

## 日常变更

影响公开 API、行为、样式或发布内容的提交必须包含 changeset：

```bash
pnpm changeset
```

提交合并到 `main` 后，`Release PR` 工作流会创建或更新版本 PR。合并版本 PR 后，CI 验证成功会触发 `Publish` 工作流，通过 npm OIDC 发布尚未发布的版本并推送 Git 标签。

## npm Trusted Publisher

以下两个 npm 包都需要配置相同的 GitHub Actions Trusted Publisher：

- `@rush_ui/react`
- `@rush_ui/tokens`

配置值：

| 字段 | 值 |
| --- | --- |
| Organization or user | `TwilighRush` |
| Repository | `rush-ui` |
| Workflow filename | `publish.yml` |
| Environment | 留空 |
| Allowed actions | `npm publish` |

工作流使用 GitHub-hosted runner、Node.js 24、npm 11.17.0 和 `id-token: write`，不需要长期 npm 发布 token。

Trusted Publishing 首次验证成功后，应撤销不再使用的 npm 写入 token，并在包设置中启用“Require two-factor authentication and disallow tokens”。

## 本地验证

发布相关变更至少执行：

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm storybook:build
npm pack --dry-run
```
