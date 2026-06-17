import { Field, Select } from "@rush-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";
import { useState } from "react";

const storyRowStyles = {
  alignItems: "flex-start",
  display: "flex",
  flexWrap: "wrap",
  gap: "16px"
} satisfies CSSProperties;

const storyStackStyles = {
  display: "grid",
  gap: "12px",
  maxWidth: "420px"
} satisfies CSSProperties;

const statusOptions = [
  { label: "待处理", textValue: "pending", value: "pending" },
  { label: "处理中", textValue: "processing", value: "processing" },
  { label: "已完成", textValue: "done", value: "done" }
];

const ownerOptions = [
  {
    description: "只显示当前登录成员负责的记录。",
    label: "我的客户",
    textValue: "owner",
    value: "owner"
  },
  {
    description: "显示所在团队有权限访问的记录。",
    label: "团队客户",
    textValue: "team",
    value: "team"
  },
  {
    description: "需要管理员权限。",
    disabled: true,
    label: "全部客户",
    textValue: "all",
    value: "all"
  }
];

const componentDescription = `
Select 用于后台系统里的单选选择，例如筛选条件、默认负责人、审批模式和配置分支。v1 聚焦单选，不包含多选、远程搜索和虚拟滚动。

可访问性说明：
- 触发器使用 role="combobox"，弹层使用 role="listbox"，选项使用 role="option"。
- 受控模式使用 value + onValueChange，非受控模式使用 defaultValue。
- 支持 Arrow、Enter、Escape、Home、End 和 typeahead；禁用选项不会被键盘选中。
- 与 Field 组合时，label、helpText、required 和 errorText 会自动关联到 combobox。
- name 会渲染隐藏输入，保留基础表单提交能力。
`;

function ControlledSelectStory() {
  const [value, setValue] = useState("owner");

  return (
    <div style={storyStackStyles}>
      <Select aria-label="客户范围" onValueChange={setValue} options={ownerOptions} value={value} />
      <p style={{ margin: 0 }}>当前范围：{value}</p>
    </div>
  );
}

const meta = {
  title: "组件/表单/Select",
  component: Select,
  args: {
    "aria-label": "项目状态",
    options: statusOptions,
    placeholder: "请选择状态",
    size: "md",
    disabled: false,
    invalid: false,
    required: false
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"]
    }
  },
  parameters: {
    docs: {
      description: {
        component: componentDescription
      }
    }
  }
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "交互预览"
};

export const Sizes: Story = {
  name: "尺寸",
  render: () => (
    <div style={storyRowStyles}>
      <Select aria-label="小尺寸状态" defaultValue="pending" options={statusOptions} size="sm" />
      <Select aria-label="中尺寸状态" defaultValue="processing" options={statusOptions} size="md" />
      <Select aria-label="大尺寸状态" defaultValue="done" options={statusOptions} size="lg" />
    </div>
  )
};

export const Controlled: Story = {
  name: "受控选择",
  render: () => <ControlledSelectStory />
};

export const States: Story = {
  name: "状态",
  render: () => (
    <div style={storyStackStyles}>
      <Select aria-label="默认状态" options={statusOptions} placeholder="请选择状态" />
      <Select aria-label="禁用状态" defaultValue="processing" disabled options={statusOptions} />
      <Select aria-label="错误状态" errorText="请选择项目状态" invalid options={statusOptions} placeholder="请选择状态" />
      <Select aria-label="空状态" emptyText="暂无状态" options={[]} placeholder="请选择状态" />
    </div>
  )
};

export const WithDescriptions: Story = {
  name: "选项说明",
  render: () => <Select aria-label="客户范围" defaultValue="owner" options={ownerOptions} />
};

export const WithField: Story = {
  name: "组合 Field",
  render: () => (
    <form style={storyStackStyles}>
      <Field helpText="可通过键盘输入英文首字母快速定位选项，例如 p、d。" label="项目状态" required>
        <Select name="status" options={statusOptions} placeholder="请选择状态" />
      </Field>
      <Field errorText="请选择客户范围" label="客户范围" required>
        <Select name="scope" options={ownerOptions} placeholder="请选择范围" />
      </Field>
    </form>
  )
};

export const Keyboard: Story = {
  name: "键盘交互",
  render: () => (
    <div style={storyStackStyles}>
      <Select
        aria-label="审批模式"
        options={[
          { label: "人工审批", textValue: "manual", value: "manual" },
          { label: "自动通过低风险项", textValue: "auto", value: "auto" },
          { label: "仅记录不拦截", textValue: "record", value: "record" }
        ]}
        placeholder="请选择审批模式"
      />
    </div>
  )
};
