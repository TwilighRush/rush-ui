# Pagination RFC

## 状态

- 草案

## 摘要

`Pagination` 是 `@rush_ui/react` 的页码导航组件，用于后台表格、列表、搜索结果和弹层内列表的分页切换。它提供受控/非受控页码、总条数计算、上一页/下一页、页码省略、加载和错误提示，并保持请求与数据状态由业务层管理；Table 只在页面层与它组合。

本文档只定义 `Pagination` 的组件设计与接口约束，不包含服务端请求、查询缓存或表格集成实现。

## 目标

- 支持 `page` / `defaultPage` 双模式。
- 使用 `total` 和 `pageSize` 计算总页数，支持总数说明。
- 支持页码省略，通过 `siblingCount` 和 `boundaryCount` 控制可见页码。
- 支持 `disabled`、`loading` 和 `errorText` 状态。
- 支持 `size` 控制密度。
- 支持 `className`、原生 `aria-*` / `data-*` 和指向根节点的 `ref`。
- 使用语义 `<nav>` 与原生 `<button>`，提供 `aria-current` 和键盘焦点移动。
- 不新增依赖，通过 Less 和 CSS 变量接入现有 token。

## 非目标

- v1 不内置 pageSize 切换器；需要时由外部组合 `Select`。
- v1 不内置跳页输入框、服务端请求封装、URL 同步或查询缓存。
- v1 不提供 Table 绑定 API；Table 与 `Pagination` 通过页面层状态组合。
- v1 不提供链接模式、路由导航或 SEO 分页。
- v1 不暴露内部 DOM 结构作为公共 API。

## 公共 API

```ts
type PaginationSize = "sm" | "md" | "lg";

interface PaginationTotalInfo {
  start: number;
  end: number;
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

type PaginationProps = PaginationBaseProps &
  (
    | { page: number; defaultPage?: never }
    | { page?: never; defaultPage?: number }
  );

interface PaginationBaseProps extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "onChange"> {
  total: number;
  pageSize?: number;
  siblingCount?: number;
  boundaryCount?: number;
  size?: PaginationSize;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: React.ReactNode;
  errorText?: React.ReactNode;
  showTotal?: boolean | ((info: PaginationTotalInfo) => React.ReactNode);
  previousAriaLabel?: string;
  nextAriaLabel?: string;
  getPageAriaLabel?: (page: number, selected: boolean) => string;
  onPageChange?: (page: number) => void;
}
```

`Pagination` 作为单组件导出：

```ts
export { Pagination } from "@rush_ui/react";
export type { PaginationProps, PaginationSize, PaginationTotalInfo } from "@rush_ui/react";
```

## 行为

- `pageSize` 最小按 `1` 处理，`total` 最小按 `0` 处理。
- `pageCount` 最小为 `1`，空数据仍显示第 1 页。
- 当前页超出范围时展示层夹取到可用范围；受控值不由组件自动改写。
- 点击当前页不触发 `onPageChange`。
- 点击上一页、下一页或其他页码时，触发 `onPageChange(nextPage)`；非受控模式同时更新内部页码。
- `loading` 和 `disabled` 会禁用所有分页按钮。
- `showTotal={true}` 默认展示 `第 start-end 条 / 共 total 条`。
- `showTotal` 为函数时，接收 `PaginationTotalInfo` 并返回自定义内容。

## ARIA 与语义

- 根节点使用 `<nav>`。
- 未传入 `aria-label` 或 `aria-labelledby` 时，默认使用 `aria-label="分页"`。
- 当前页按钮设置 `aria-current="page"`，并通过默认可访问名称说明“当前页”。
- 上一页、下一页和页码项使用原生 `<button type="button">`。
- 省略号不参与焦点顺序，并设置 `aria-hidden="true"`。
- `loading` 设置根节点 `aria-busy="true"`，并渲染 `role="status"`。
- `errorText` 渲染 `role="alert"`，并合并到根节点 `aria-describedby`。

## 键盘与焦点

- `Tab` 使用浏览器默认顺序进入可用按钮。
- `Enter` / `Space` 使用原生 button 行为激活目标页。
- `ArrowLeft` / `ArrowRight` 在可用按钮之间移动焦点，不直接改变页码。
- `Home` / `End` 移动到第一个或最后一个可用按钮。
- loading / disabled 状态下按钮不可聚焦，也不可激活。

## 样式 token

首版通过 Less 和 CSS 变量实现，不新增依赖。

建议组件私有变量：

```css
--rui-pagination-control-height
--rui-pagination-control-min-width
--rui-pagination-control-padding
--rui-pagination-font-size
--rui-pagination-gap
```

映射原则：

- 默认背景使用 `--rui-color-surface`。
- 默认边框使用 `--rui-color-border`，hover 使用 `--rui-color-border-hover`。
- 当前页使用 `--rui-color-ink` 和 `--rui-color-surface`。
- 焦点环使用 `--rui-color-focus-ring`。
- 间距使用现有 spacing token。
- 状态文本使用 status token，错误文本使用 `--rui-color-status-error-text`。

## Stories

首版 Storybook 应覆盖：

- 交互预览。
- 受控页码。
- 三种尺寸。
- loading、error、empty 状态。
- 密集列表。
- 自定义总数说明。
- 可访问性说明和键盘行为说明。

## Tests

首版测试应覆盖：

- 当前页语义和总数说明。
- 受控与非受控页码切换。
- 点击当前页不触发变化。
- 空数据和越界页码夹取。
- disabled、loading 和 error 状态。
- `aria-describedby` 合并。
- Arrow、Home、End 焦点移动。
- `className`、自定义可访问标签和 `ref`。

## 与其他组件的边界

### Table

Table 负责数据表格、列、行、排序、选择和空态组合。Pagination 只负责页码导航。两者通过外部状态组合，均不承载请求逻辑。

### Select

pageSize 切换器应由外部组合 `Select`。Pagination 不内置 pageSize 下拉，避免复制 Select 的键盘、弹层和错误状态能力。

### Empty / Alert / Skeleton

空结果用 `Empty`，请求错误用 `Alert` 或 `Pagination` 的 `errorText` 做局部提示，加载中的内容结构用 `Skeleton`。Pagination 只表达分页区域自身的 loading/error，不替代列表内容状态。

## 设计取舍

- 使用 `total + pageSize` 而不是 `pageCount`，是因为后台列表更常从接口返回总条数，并且总数说明依赖条目范围。
- 当前页按钮保持可聚焦，便于辅助技术确认当前位置。
- 方向键只移动焦点，不自动切换页码，避免键盘用户在浏览页码时触发数据请求。
- 不内置跳页输入框，是为了让 v1 保持可靠；大页量场景可以先通过更高 `siblingCount` 或外部表单组合解决。
