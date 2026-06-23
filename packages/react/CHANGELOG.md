# @rush_ui/react

## 0.2.0

### Minor Changes

- b78367a: 新增 Alert 区域内提示组件，支持 default、success、warning、error、info 状态、标题、图标和操作区，并补充文档、Storybook 示例与测试。
- 4e21164: 新增经 RFC 评审的 Dialog、DropdownMenu、Popover、Switch 和 Tabs 组件，补齐共享 Portal、浮层定位、模态分支、焦点管理与受控状态能力，并增加浮层、遮罩和交互状态设计令牌。

### Patch Changes

- df42e3a: 补充 npm 包说明、仓库与公开发布元数据，并收紧类型声明产物，避免发布测试文件和 Vite 配置声明。
- 3a93f2d: 修复 Dialog 和 Popover 内嵌 Select、DropdownMenu 等 Portal 浮层的层级，使嵌套浮层显示在父级浮层之上并可正常交互。

## 0.1.2

### Patch Changes

- 687fcfe: 修正 npm 发布作用域为实际组织 `@rush_ui`，同步组件包、设计 token 包、工作区依赖、构建别名和使用文档中的包名。

## 0.1.1

### Patch Changes

- 6ac140e: 开放组件样式入口 `@rush_ui/react/styles.css`，补充样式包元数据，并避免 React JSX runtime 被重复打入组件产物。

## 0.1.0

### Minor Changes

- 2bb55b4: 新增 IconButton 组件，补齐图标按钮的类型、样式、测试、Storybook 用例和可访问性文档；同时收紧 React 包入口，只保留稳定的组件 API 导出。
- d9c6c8b: 新增 Field 表单项组件，补齐类型、样式、测试、Storybook 用例、组件文档和 RFC，并从 React 包入口导出；支持 label、helpText、required、optionalText、错误态传递和 aria-describedby 合并。
- 957430d: 新增 Radio / RadioGroup 单选组件，补齐类型、样式、测试、Storybook 用例、组件文档和 RFC，并从 React 包入口导出；支持受控/非受控、组内方向键移动、说明文本、错误态、Field 组合和原生表单语义。
- 39cd8d3: 新增 Input 输入框组件，补齐类型、样式、测试、Storybook 用例、组件文档和 RFC，并从 React 包入口导出；支持清空按钮、字数统计、prefix/suffix 图标插槽和前后缀内容。
- cf7beef: 新增 CheckboxGroup 复选组组件，并从 React 包入口导出；支持受控/非受控值数组、组级 disabled / invalid / required、横向或纵向排列、Field 组合、组级错误文本和原生 checkbox 表单语义。
- 35eeba4: 新增 Select 单选选择器，补齐类型、样式、测试、Storybook 用例、组件文档和 RFC，并从 React 包入口导出；支持受控/非受控、Field 组合、combobox/listbox 语义、键盘导航、typeahead、占位、空态、禁用态和错误态。
- a71f0ae: 新增 Checkbox 复选框组件，补齐类型、样式、测试、Storybook 用例、组件文档和 RFC，并从 React 包入口导出；支持受控/非受控、半选、说明文本、错误态和原生表单语义。
- cef12d9: 新增 Textarea 文本域组件，补齐类型、样式、测试、Storybook 用例、组件文档和 RFC，并从 React 包入口导出；支持错误态、字数统计、受控/非受控、自适应高度和后置装饰内容。

### Patch Changes

- e3a8c15: 新增 Badge 状态标识组件，支持 default、success、warning、error、info、processing 六种状态以及 sm、md、lg 三档尺寸。

  补充语义状态色 token，供 Badge 和后续状态类组件复用。

- fd73dbb: 修复 Textarea 默认拖拽只能纵向调整的问题，并避免非自适应高度模式下输入内容时重置用户手动拖拽后的高度。
- fa82065: 打磨 Button 和 IconButton 的交互状态与动效细节：补充 active 反馈、降低动作阴影强度、为 loading spinner 增加 reduced-motion 处理，并修正 Button label 的稳定样式类名。
