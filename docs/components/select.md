# Select 选择器

`Select` 用于后台系统里的单选选择，例如筛选条件、默认负责人、审批模式和配置分支。v1 聚焦单选，不包含多选、远程搜索和虚拟滚动。

## 导入

```tsx
import { Field, Select } from "@rush_ui/react";
```

## 基础用法

```tsx
const statusOptions = [
  { label: "待处理", textValue: "pending", value: "pending" },
  { label: "处理中", textValue: "processing", value: "processing" },
  { label: "已完成", textValue: "done", value: "done" }
];

<Select aria-label="项目状态" options={statusOptions} placeholder="请选择状态" />;
```

## 受控用法

```tsx
const [value, setValue] = useState("pending");

<Select value={value} onValueChange={setValue} options={statusOptions} />;
```

非受控模式使用 `defaultValue`：

```tsx
<Select defaultValue="processing" name="status" options={statusOptions} />;
```

传入 `name` 时会渲染隐藏输入，用于基础表单提交。

## 与 Field 组合

```tsx
<Field helpText="支持方向键、Enter、Escape、Home、End 和首字母定位。" label="项目状态" required>
  <Select name="status" options={statusOptions} placeholder="请选择状态" />
</Field>

<Field errorText="请选择客户范围" label="客户范围" required>
  <Select
    name="scope"
    options={[
      { label: "我的客户", textValue: "owner", value: "owner" },
      { label: "团队客户", textValue: "team", value: "team" }
    ]}
    placeholder="请选择范围"
  />
</Field>
```

`Field` 会把 label、helpText、required 和 errorText 关联到 `Select`，由 `Select` 设置 `aria-*` 并渲染错误文本。

## API

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options` | `readonly SelectOption[]` | 必填 | 可选项列表。 |
| `value` | `string` | `undefined` | 受控选中值。 |
| `defaultValue` | `string` | `undefined` | 非受控初始选中值。 |
| `name` | `string` | `undefined` | 表单字段名。传入后会渲染隐藏输入。 |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 控制触发器高度、字号和间距。 |
| `placeholder` | `ReactNode` | `"请选择"` | 未选择时显示的占位内容。 |
| `emptyText` | `ReactNode` | `"暂无可选项"` | 选项为空时的空态内容。 |
| `disabled` | `boolean` | `false` | 禁用选择器。 |
| `invalid` | `boolean` | `false` | 进入错误状态，并设置 `aria-invalid="true"`。 |
| `required` | `boolean` | `false` | 设置 `aria-required="true"`，与 `Field` 组合时显示必填标记。 |
| `errorText` | `ReactNode` | `undefined` | 错误提示内容。错误态下会自动追加到 `aria-describedby`。 |
| `onValueChange` | `(value: string) => void` | `undefined` | 选中值变化后的语义回调。 |

`Select` 同时继承除 `children`、`defaultValue` 和 `onChange` 外的 `React.HTMLAttributes<HTMLDivElement>`，可以使用 `className`、`style`、`data-*` 等根节点属性。`ref` 指向主触发器 `HTMLButtonElement`。

### SelectOption

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string` | 必填 | 选项值，应在同一个 Select 内唯一。 |
| `label` | `ReactNode` | 必填 | 选项显示内容。 |
| `description` | `ReactNode` | `undefined` | 选项辅助说明。 |
| `disabled` | `boolean` | `false` | 禁用单个选项。 |
| `textValue` | `string` | `undefined` | typeahead 匹配文本。`label` 不是纯文本时建议提供。 |

## 键盘行为

- `Enter` / `Space`：打开弹层；弹层打开时选择当前活动选项。
- `ArrowDown` / `ArrowRight`：打开弹层或移动到下一个可用选项。
- `ArrowUp` / `ArrowLeft`：打开弹层或移动到上一个可用选项。
- `Home`：移动到第一个可用选项。
- `End`：移动到最后一个可用选项。
- `Escape`：关闭弹层并保留当前值。
- `Tab`：关闭弹层并按正常顺序离开控件。
- 输入可打印字符：按 `textValue` / `label` 做 typeahead 定位。

## 可访问性

- 触发器使用 `role="combobox"`，并设置 `aria-expanded`、`aria-haspopup="listbox"`、`aria-controls` 和 `aria-activedescendant`。
- 弹层使用 `role="listbox"`，选项使用 `role="option"` 和 `aria-selected`。
- `disabled` 使用原生 `button disabled`，不可聚焦也不可打开。
- `invalid={true}` 时设置 `aria-invalid="true"`；提供 `errorText` 时错误文本会追加到 `aria-describedby`。
- `required` 使用 `aria-required` 表达组控件必填语义；表单校验时机仍由业务层负责。
- 禁用选项设置 `aria-disabled`，不会被方向键、Home/End 或 typeahead 选中。
- 颜色不是唯一状态表达：选中项有背景与勾选标记，错误态有边框、焦点环和错误文本。

## 设计边界

- v1 只支持单选。
- v1 不支持多选、远程搜索、异步加载、虚拟滚动和分组选项。
- 复杂选项卡片、带副操作的下拉项和级联选择器应由后续独立组件设计。
- `options` 应保持稳定且 `value` 唯一；重复值会让选中态不可预测。
