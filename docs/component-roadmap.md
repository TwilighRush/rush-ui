# Rush UI 组件路线规划

更新日期：2026-06-24

## 1. 规划结论

Rush UI 当前已经具备一套可靠的交互基础组件：按钮、输入、选择、弹层、Tabs、Dialog、DropdownMenu、Popover、Alert、Badge 等。它适合继续向“可直接组装后台页面”的方向推进，但还缺少后台产品最常用的列表页、筛选页、详情页和复杂表单能力。

后续组件建设建议按以下目标推进：

1. 先补齐后台页面闭环：表格、分页、空状态、加载态、全局提示、Tooltip、日期和数字输入。
2. 再增强业务编辑流：Drawer、Confirm、Upload、Combobox、多选选择、Steps。
3. 最后覆盖复杂企业场景：Tree、Cascader、Transfer、VirtualList、Timeline、Metric 等。

核心判断：Rush UI 不应先追求“大而全”。每个新增组件都要服务真实后台工作流，并保持公共 API 克制、类型稳定、无障碍可验证。

## 2. 当前组件盘点

| 能力层 | 已有组件 | 当前缺口 | 产品判断 |
| --- | --- | --- | --- |
| 操作入口 | Button、IconButton、DropdownMenu、Tooltip | Confirm、快捷操作组合 | 基础动作能力已成型，短说明已补齐，后续需要补足确认和全局反馈 |
| 表单录入 | Field、Input、Textarea、Checkbox、Radio、Switch、Select | NumberInput、DatePicker、DateRangePicker、Combobox、Upload | 后台筛选和编辑页仍缺核心录入控件 |
| 浮层 | Dialog、Popover、DropdownMenu、Tooltip | Drawer、Toast、AlertDialog | 弹层基础设施已具备，可优先复用现有 Portal、定位、焦点能力 |
| 反馈 | Alert、Badge | Toast、Spinner、Skeleton、Empty、Progress | 页面加载、异步提交、空数据场景还不完整 |
| 导航 | Tabs | Breadcrumb、Pagination、Steps、SideNav | 还不能完整支撑后台页面信息架构 |
| 数据展示 | Badge、Alert | Table、Descriptions、Tag、Timeline、Metric | 管理端核心是数据浏览，Table 是最高优先级缺口 |
| 布局模式 | Story 中有集成示例 | PageHeader、Toolbar、FilterBar、Layout recipes | 先以文档 recipe 沉淀，不急于全部导出为公共组件 |

## 3. 用户与场景

Rush UI 的核心用户是构建后台、管理端、仪表盘的前端工程师。他们最常见的任务不是展示单个按钮，而是快速搭建稳定的业务页面。

优先覆盖四类页面：

1. 列表检索页：筛选条件、批量操作、数据表格、分页、空状态、加载态、错误提示。
2. 新增/编辑页：表单分组、校验提示、日期数字录入、上传、提交反馈、离开确认。
3. 详情/审计页：状态标识、描述列表、时间线、标签、分区内容和操作菜单。
4. 设置/权限页：开关、单选多选、树形权限、穿梭选择、步骤式配置。

组件优先级应由这些页面反推，而不是按竞品组件目录逐项补齐。

## 4. 组件准入标准

新增公共组件进入 `@rush_ui/react` 前，应同时满足：

1. 至少能覆盖 3 个以上后台高频场景。
2. API 能保持稳定，不依赖临时 DOM 结构或一次性业务模型。
3. 有明确无障碍模式，可描述键盘行为、焦点管理和语义角色。
4. 可通过 Less 和 CSS 变量接入现有 token。
5. 不新增依赖，除非 RFC 明确说明收益、替代方案和体积影响。
6. 交付时包含 implementation、stories、tests、typed props、组件文档和无障碍说明。

不建议一开始进入公共 API 的内容：

1. 业务色彩很强的 Pro 组件，例如权限配置面板、审批流设计器。
2. 需要复杂第三方引擎才能可靠运行的组件，例如完整 Excel 式 DataGrid。
3. 只为文档演示服务的页面容器，例如营销式 hero、过度包装的 dashboard shell。

## 5. P0：后台页面闭环组件

P0 的目标是让 Rush UI 能独立组装一个标准后台列表页和编辑页。建议作为 `0.3` 阶段主线。

| 组件 | 主要场景 | MVP 范围 | 暂不做 |
| --- | --- | --- | --- |
| Table | 列表页、明细表、权限矩阵 | 语义 table、列定义、空状态插槽、加载态、行选择、受控排序事件、固定尺寸密度 | 虚拟滚动、列拖拽、复杂单元格编辑、内置请求 |
| Pagination | 列表分页、弹层内分页 | page、pageSize、total、onPageChange、快捷上一页/下一页、可访问标签 | 复杂跳页模板、服务端请求封装 |
| Empty | 表格空态、搜索无结果、配置缺失 | 标题、说明、图标/插图插槽、操作区 | 大型营销插画、多种强视觉变体 |
| Spinner / Loading | 按钮外的局部加载、页面区块加载 | 尺寸、label、`role="status"`、延迟显示建议 | 全屏 loading 管理器 |
| Skeleton | 首屏等待、表格/详情占位 | 文本行、块、圆形、组合 recipe | 自动识别真实布局 |
| Toast | 保存成功、提交失败、后台任务反馈 | success/error/info/warning、自动关闭、手动关闭、live region、队列策略 | 复杂通知中心、持久消息收纳 |
| Tooltip | 图标按钮说明、字段解释、截断文本提示 | Trigger/Content、延迟、方向、Escape 关闭、hover/focus 打开 | 富交互内容；这类应使用 Popover |
| NumberInput | 金额、数量、比例、阈值 | min/max/step、受控/非受控、键盘步进、格式化显示插槽 | 高精度金融计算、复杂单位换算 |
| DatePicker | 筛选日期、到期时间、报表日期 | 单日期选择、受控/非受控、键盘导航、formatter/parser props | 时区系统、农历、复杂日程 |
| DateRangePicker | 报表区间、日志区间、订单时间 | 开始/结束日期、快捷范围插槽、错误态 | 多区间选择、自然语言解析 |
| Breadcrumb | 详情页路径、配置层级 | 列表式语义导航、当前页标识、省略项插槽 | 自动路由绑定 |

### P0 推荐开发顺序

1. Tooltip（已完成）：复用现有浮层定位和关闭逻辑，快速补齐图标按钮可访问说明。
2. Spinner、Skeleton、Empty：先补异步和空数据基础反馈，支撑后续 Table stories。
3. Pagination：作为 Table 的配套组件，但保持可单独使用。
4. Table：先做语义表格和受控行为，不做 DataGrid。
5. Toast：补齐提交反馈和异步操作闭环。
6. NumberInput、DatePicker、DateRangePicker：补齐筛选和编辑页关键录入。
7. Breadcrumb：补齐详情页导航。

## 6. P1：业务编辑与复杂选择组件

P1 的目标是提升后台复杂编辑流效率。建议作为 `0.4` 到 `0.5` 阶段主线。

| 组件 | 主要场景 | MVP 范围 | 产品边界 |
| --- | --- | --- | --- |
| Drawer | 侧边编辑、详情预览、二级任务 | 受控/非受控、焦点锁定、滚动锁定、尺寸、标题/描述/关闭 | 不替代 Dialog；长流程仍应独立页面 |
| AlertDialog / ConfirmDialog | 删除、停用、危险操作确认 | 基于 Dialog 的专门确认语义、危险动作、取消/确认焦点策略 | 不做命令式全局 confirm 作为首版默认 |
| Combobox | 远程搜索用户、选择项目、选择标签 | 输入过滤、键盘导航、空状态、受控 value、异步 loading 插槽 | 不做无限滚动和复杂分组作为首版 |
| MultiSelect | 多标签筛选、角色选择 | 多选值、标签展示、清除、全选可选项 | 不与 CheckboxGroup 重叠成纯平铺多选 |
| Upload | 附件上传、头像、导入文件 | 文件选择、拖拽区、进度/错误/重试插槽、受控 fileList | 不内置具体上传服务 |
| Steps | 配置流程、审批节点、批量导入流程 | 当前步骤、状态、横向/纵向、可点击回退 | 不做流程引擎 |
| Descriptions | 详情页字段展示、审计记录摘要 | 标签/值布局、列数、空值策略、响应式 | 不做复杂表单回填 |
| Tag | 可关闭标签、筛选条件 chip、对象标签 | 颜色语义、closable、尺寸、icon | Badge 继续承担只读状态标识 |
| Progress | 上传、导入、异步任务 | line/circle 可二选一首发，label、状态 | 不做复杂图表 |

## 7. P2：企业复杂场景组件

P2 的目标是覆盖权限、组织、批量配置和大数据量选择。建议等 P0/P1 稳定后逐步推进。

| 组件 | 主要场景 | 建议前置条件 |
| --- | --- | --- |
| Tree | 权限树、组织架构、目录结构 | Checkbox、VirtualList、键盘树导航 RFC |
| TreeSelect | 部门/组织选择、权限范围选择 | Tree 与 Combobox 稳定后再组合 |
| Cascader | 地区、分类、层级配置 | Popover、Combobox、虚拟列表策略稳定 |
| Transfer | 角色授权、成员分配、字段选择 | Table/List、Checkbox、搜索和批量操作稳定 |
| VirtualList | 大量选项、树、表格行渲染 | 明确是否作为内部工具或公共组件 |
| Timeline | 审批记录、部署记录、操作日志 | Badge、Descriptions、时间格式策略 |
| Metric / Statistic | 仪表盘指标、运营看板 | token 和数字格式规范明确 |
| Calendar / TimePicker | 排班、运营日历、定时任务 | DatePicker 基础能力稳定 |
| Slider | 阈值、比例、范围配置 | NumberInput、表单文档成熟 |
| ColorPicker | 主题配置、标签色配置 | 只有当产品确实需要自定义颜色时再做 |

## 8. 暂缓或仅做 recipe 的能力

以下能力有价值，但不建议短期做成公共组件：

1. Form：当前已有 Field 和受控输入约定，建议先通过文档 recipe 展示表单组合。等校验、提交、错误聚合策略明确后，再考虑轻量 FormProvider。
2. PageHeader / Toolbar / FilterBar：先在 Storybook 和 docs 中沉淀后台页面模式。只有当多个业务项目重复使用同一模式时，再进入公共 API。
3. AppShell / SideNav：应用骨架容易绑定具体路由和权限模型，首期适合做示例，不适合过早承诺 API。
4. DataGrid：Rush UI 应先提供 Table，不要直接承诺完整数据网格能力。列冻结、列拖拽、虚拟滚动、单元格编辑应分阶段验证。
5. Notification Center：Toast 足够覆盖大部分非阻断反馈。消息中心属于产品级能力，不是首批组件库基础能力。

## 9. 里程碑建议

### 0.3：列表页可用

目标：用 Rush UI 能搭出一个完整成员管理或订单列表页。

范围：

- Tooltip
- Empty
- Spinner
- Skeleton
- Pagination
- Table
- Toast
- Breadcrumb

验收页面：

- 有筛选条件、表格、分页、批量操作、空状态、加载态、错误反馈。
- 键盘用户可以进入筛选、操作菜单、分页和表格行操作。
- Storybook 至少有 loading、empty、error、dense、keyboard 相关示例。

### 0.4：编辑流可用

目标：用 Rush UI 能完成新增、编辑、删除和危险操作确认。

范围：

- NumberInput
- DatePicker
- DateRangePicker
- Drawer
- AlertDialog / ConfirmDialog
- Upload

验收页面：

- 有新增/编辑表单、日期筛选、数字阈值、附件上传、删除确认。
- 错误提示、提交 loading、成功/失败 Toast 流程完整。

### 0.5：复杂选择可用

目标：覆盖用户、角色、部门、标签等后台常见选择任务。

范围：

- Combobox
- MultiSelect
- Steps
- Descriptions
- Tag
- Progress

验收页面：

- 支持远程搜索选择、多选标签、分步配置和详情展示。
- 异步加载、空结果、禁用项和键盘选择行为可测试。

### 0.6：企业配置可用

目标：覆盖权限、组织和批量配置场景。

范围：

- Tree
- TreeSelect
- Cascader
- Transfer
- VirtualList
- Timeline
- Metric / Statistic

验收页面：

- 支持权限分配、组织选择、批量成员移动和审计记录展示。
- 大数据量选择有性能策略，不把性能问题留给使用方。

## 10. 每个组件的交付清单

每个进入开发的组件都应按同一套流程交付：

1. RFC：说明使用场景、非目标、API 草案、无障碍模式、键盘交互、样式 token、替代方案。
2. Implementation：放在 `packages/react/src/<component>`，公共类型从组件入口导出。
3. Stories：覆盖默认、尺寸/变体、禁用、错误、加载、空状态、键盘和组合场景。
4. Tests：覆盖受控/非受控、键盘、焦点、disabled、loading、error、ARIA 语义。
5. Docs：放在 `docs/components/<component>.md`，包含能力边界、示例、无障碍说明。
6. Exports：更新 `packages/react/src/index.ts` 和包内 `index.ts`。
7. Changeset：公共 API、行为、样式输出或发布内容变化时必须添加。

## 11. 风险与取舍

1. Table 容易膨胀：首版应坚持“受控状态 + 语义表格 + 插槽”，不内置请求、查询缓存或复杂列配置。
2. DatePicker 容易引入依赖：首版优先使用原生 Date、Intl 和 formatter/parser props；如需日期库，必须在 RFC 中论证。
3. Form 容易绑定校验方案：先通过 Field 和文档 recipe 支撑，避免过早选择某个表单生态。
4. AppShell 容易变业务框架：现阶段更适合做 docs recipe，保持组件库边界。
5. 复杂选择组件依赖共享能力：Combobox、TreeSelect、Cascader 应复用同一套浮层、键盘导航、空状态和异步状态约定。

## 12. 推荐近期 Backlog

建议下一批 RFC 按以下顺序创建：

1. `docs/rfcs/empty.md`
2. `docs/rfcs/spinner.md`
3. `docs/rfcs/skeleton.md`
4. `docs/rfcs/pagination.md`
5. `docs/rfcs/table.md`
6. `docs/rfcs/toast.md`
7. `docs/rfcs/number-input.md`
8. `docs/rfcs/date-picker.md`
9. `docs/rfcs/drawer.md`

这组 backlog 可以最短路径补齐后台产品闭环，同时复用 Rush UI 已经完成的 Button、Field、Select、Popover、Dialog、DropdownMenu 和 Tabs 基础能力。
