import { Checkbox, CheckboxGroup, Field } from "@rush_ui/react";
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

const componentDescription = `
Checkbox / CheckboxGroup 用于后台系统中的开关式确认、多选筛选、批量选择和权限配置。组件渲染原生 input[type="checkbox"]，并提供 Rush UI 的尺寸、错误、半选、说明文本、组级状态和焦点样式。

可访问性说明：
- 勾选行为沿用原生 checkbox，保留 Tab 聚焦、Space 切换和表单提交能力。
- 受控模式使用 checked + onCheckedChange，非受控模式使用 defaultChecked。
- CheckboxGroup 受控模式使用 value + onValueChange，非受控模式使用 defaultValue。
- indeterminate 会同步到底层 input.indeterminate，并设置 aria-checked="mixed"。
- description 和 errorText 会自动关联到 aria-describedby。
- CheckboxGroup 使用 role="group"，统一 name、disabled、invalid 和尺寸；required 使用组级 aria-required。
- 与 Field 组合时，label、helpText、required 和 errorText 会自动关联到 group。
`;

function ControlledCheckboxStory() {
  const [checked, setChecked] = useState(true);

  return (
    <div style={storyStackStyles}>
      <Checkbox checked={checked} onCheckedChange={setChecked}>
        允许成员导出报表
      </Checkbox>
      <p style={{ margin: 0 }}>当前状态：{checked ? "已允许" : "未允许"}</p>
    </div>
  );
}

function ControlledCheckboxGroupStory() {
  const [value, setValue] = useState(["read"]);

  return (
    <div style={storyStackStyles}>
      <CheckboxGroup aria-label="权限范围" onValueChange={setValue} value={value}>
        <Checkbox description="允许查看客户资料、跟进记录和基础统计。" value="read">
          查看
        </Checkbox>
        <Checkbox value="export">导出</Checkbox>
        <Checkbox value="archive">归档</Checkbox>
      </CheckboxGroup>
      <p style={{ margin: 0 }}>当前权限：{value.length > 0 ? value.join("、") : "未选择"}</p>
    </div>
  );
}

const meta = {
  title: "组件/表单/Checkbox",
  component: Checkbox,
  args: {
    children: "接收审批通知",
    description: "用于审批、退款和权限变更等高优先级事件。",
    size: "md",
    disabled: false,
    invalid: false,
    indeterminate: false
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
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "交互预览"
};

export const Sizes: Story = {
  name: "尺寸",
  render: () => (
    <div style={storyRowStyles}>
      <Checkbox size="sm">小尺寸选项</Checkbox>
      <Checkbox defaultChecked size="md">
        中尺寸选项
      </Checkbox>
      <Checkbox size="lg">大尺寸选项</Checkbox>
    </div>
  )
};

export const Controlled: Story = {
  name: "受控勾选",
  render: () => <ControlledCheckboxStory />
};

export const ControlledGroup: Story = {
  name: "受控复选组",
  render: () => <ControlledCheckboxGroupStory />
};

export const States: Story = {
  name: "状态",
  render: () => (
    <div style={storyStackStyles}>
      <Checkbox defaultChecked>已选选项</Checkbox>
      <Checkbox indeterminate>本页部分记录已选</Checkbox>
      <Checkbox disabled>禁用选项</Checkbox>
      <Checkbox disabled defaultChecked>
        禁用且已选
      </Checkbox>
      <Checkbox errorText="请确认后再提交" invalid>
        必须确认
      </Checkbox>
    </div>
  )
};

export const WithDescription: Story = {
  name: "说明文本",
  render: () => (
    <div style={storyStackStyles}>
      <Checkbox defaultChecked description="开启后，成员可以查看当前工作区内所有客户资料。">
        授予客户资料访问权限
      </Checkbox>
      <Checkbox description="关闭后，系统仍会保留历史通知记录。">接收风险事件通知</Checkbox>
    </div>
  )
};

export const Group: Story = {
  name: "复选组",
  render: () => (
    <CheckboxGroup aria-label="通知渠道" defaultValue={["email"]} name="channels">
      <Checkbox description="适合审批、账单和权限变更等高优先级事件。" value="email">
        邮件通知
      </Checkbox>
      <Checkbox value="sms">短信通知</Checkbox>
      <Checkbox disabled value="webhook">
        Webhook 暂不可用
      </Checkbox>
    </CheckboxGroup>
  )
};

export const HorizontalGroup: Story = {
  name: "水平复选组",
  render: () => (
    <CheckboxGroup aria-label="客户状态" defaultValue={["active"]} orientation="horizontal">
      <Checkbox value="active">启用</Checkbox>
      <Checkbox value="paused">停用</Checkbox>
      <Checkbox value="archived">已归档</Checkbox>
    </CheckboxGroup>
  )
};

export const WithField: Story = {
  name: "组合 Field",
  render: () => (
    <form style={storyStackStyles}>
      <Field helpText="用于控制成员在客户资料中的操作范围。" label="权限范围" required>
        <CheckboxGroup defaultValue={["read"]} name="permission">
          <Checkbox value="read">查看</Checkbox>
          <Checkbox value="export">导出</Checkbox>
          <Checkbox value="archive">归档</Checkbox>
        </CheckboxGroup>
      </Field>
      <Field errorText="请至少选择一个通知渠道" label="通知渠道" required>
        <CheckboxGroup name="channels">
          <Checkbox value="email">邮件通知</Checkbox>
          <Checkbox value="sms">短信通知</Checkbox>
        </CheckboxGroup>
      </Field>
    </form>
  )
};

export const InFormContext: Story = {
  name: "表单场景",
  render: () => (
    <form style={storyStackStyles}>
      <CheckboxGroup defaultValue={["email"]} name="notify">
        <Checkbox value="email">邮件通知</Checkbox>
        <Checkbox value="sms">短信通知</Checkbox>
      </CheckboxGroup>
      <Checkbox description="提交前必须确认配置会立即影响所有成员。" errorText="请确认变更范围" invalid name="confirmed" required>
        我已确认变更范围
      </Checkbox>
    </form>
  )
};
