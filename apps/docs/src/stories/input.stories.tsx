import { Input } from "@rush_ui/react";
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
  maxWidth: "360px"
} satisfies CSSProperties;

const componentDescription = `
Input 用于表单、筛选器和表格工具区里的单行文本录入。组件渲染原生 input，并通过外层控件统一尺寸、错误态、清空按钮、字数统计、图标插槽、前后缀和焦点样式。

可访问性说明：
- 输入行为沿用原生 input，保留键盘输入、复制粘贴和表单提交能力。
- 受控模式使用 value + onValueChange，非受控模式使用 defaultValue。
- allowClear 会渲染可聚焦的清空按钮，并通过 aria-label 提供可访问名称。
- showCount 会把字数统计自动关联到 aria-describedby。
- invalid 状态会设置 aria-invalid；提供 errorText 时会自动关联 aria-describedby。
- disabled 使用原生 disabled；readOnly 使用原生 readOnly，并保留可聚焦语义。
`;

function ControlledInputStory() {
  const [value, setValue] = useState("运营后台");

  return (
    <div style={storyStackStyles}>
      <Input aria-label="项目名称" onValueChange={setValue} value={value} />
      <p style={{ margin: 0 }}>当前值：{value}</p>
    </div>
  );
}

const meta = {
  title: "组件/表单/Input",
  component: Input,
  args: {
    "aria-label": "项目名称",
    placeholder: "请输入项目名称",
    size: "md",
    allowClear: false,
    disabled: false,
    invalid: false,
    readOnly: false,
    showCount: false
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
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "交互预览"
};

export const Sizes: Story = {
  name: "尺寸",
  render: () => (
    <div style={storyRowStyles}>
      <Input aria-label="小尺寸" placeholder="小尺寸输入" size="sm" />
      <Input aria-label="中尺寸" placeholder="中尺寸输入" size="md" />
      <Input aria-label="大尺寸" placeholder="大尺寸输入" size="lg" />
    </div>
  )
};

export const Controlled: Story = {
  name: "受控输入",
  render: () => <ControlledInputStory />
};

export const States: Story = {
  name: "状态",
  render: () => (
    <div style={storyRowStyles}>
      <Input aria-label="禁用字段" disabled placeholder="不可编辑" />
      <Input aria-label="只读字段" readOnly value="系统生成编号" />
      <Input aria-label="错误字段" errorText="请输入有效邮箱" invalid placeholder="name@example.com" />
    </div>
  )
};

export const WithAddons: Story = {
  name: "前后缀与图标",
  render: () => (
    <div style={storyRowStyles}>
      <Input aria-label="金额" endAddon="CNY" placeholder="0.00" startAddon="¥" />
      <Input aria-label="站点域名" endAddon=".rushui.cn" placeholder="workspace" />
      <Input aria-label="搜索关键词" placeholder="搜索订单" prefix="⌕" suffix="⌘K" />
    </div>
  )
};

export const ClearableAndCount: Story = {
  name: "清空与字数统计",
  render: () => (
    <div style={storyStackStyles}>
      <Input allowClear aria-label="搜索关键词" defaultValue="订单" placeholder="搜索订单、客户或编号" prefix="⌕" />
      <Input allowClear aria-label="项目名称" defaultValue="客户运营后台" maxLength={20} showCount />
      <Input
        allowClear
        aria-label="错误项目名称"
        defaultValue="超过命名长度限制的项目名称"
        errorText="项目名称不能超过 12 个字"
        invalid
        maxLength={12}
        showCount
      />
    </div>
  )
};

export const InFormContext: Story = {
  name: "表单场景",
  render: () => (
    <form style={storyStackStyles}>
      <label htmlFor="story-input-name">项目名称</label>
      <Input defaultValue="客户运营后台" id="story-input-name" name="name" />
    </form>
  )
};
