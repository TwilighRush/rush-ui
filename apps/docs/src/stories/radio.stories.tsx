import { Field, Radio, RadioGroup } from "@rush-ui/react";
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
  maxWidth: "460px"
} satisfies CSSProperties;

const componentDescription = `
Radio / RadioGroup 用于后台系统中的互斥选项，例如默认策略、筛选条件、审批模式和配置分支。组件渲染原生 input[type="radio"]，并提供 Rush UI 的尺寸、说明文本、错误态、组内方向键和 Field 组合能力。

可访问性说明：
- 单个 Radio 沿用原生 radio，保留 Tab 聚焦、Space 选择和表单提交能力。
- RadioGroup 使用 role="radiogroup"，统一 name、required、disabled、invalid 和尺寸。
- RadioGroup 支持方向键、Home 和 End 在可用选项之间移动焦点并更新选择；禁用项会被跳过。
- 受控模式使用 value + onValueChange，非受控模式使用 defaultValue。
- 与 Field 组合时，label、helpText、required 和 errorText 会自动关联到 radiogroup。
`;

function ControlledRadioGroupStory() {
  const [value, setValue] = useState("manual");

  return (
    <div style={storyStackStyles}>
      <RadioGroup aria-label="处理方式" onValueChange={setValue} value={value}>
        <Radio description="所有高风险记录进入待办，由成员确认后继续。" value="manual">
          人工处理
        </Radio>
        <Radio description="低风险记录自动通过，高风险记录仍进入待办。" value="mixed">
          自动处理低风险项
        </Radio>
        <Radio value="auto">全部自动处理</Radio>
      </RadioGroup>
      <p style={{ margin: 0 }}>当前模式：{value}</p>
    </div>
  );
}

const meta = {
  title: "组件/表单/Radio",
  component: RadioGroup,
  args: {
    defaultValue: "member",
    disabled: false,
    invalid: false,
    orientation: "vertical",
    size: "md"
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["vertical", "horizontal"]
    },
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
  },
  render: (args) => (
    <RadioGroup {...args} aria-label="默认负责人">
      <Radio description="新线索会进入成员待处理队列。" value="member">
        分配给成员
      </Radio>
      <Radio description="主管统一复核后再分配。" value="manager">
        分配给主管
      </Radio>
      <Radio disabled value="system">
        系统自动分配
      </Radio>
    </RadioGroup>
  )
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "交互预览"
};

export const Sizes: Story = {
  name: "尺寸",
  render: () => (
    <div style={storyStackStyles}>
      <RadioGroup aria-label="小尺寸" defaultValue="sm" size="sm">
        <Radio value="sm">小尺寸选项</Radio>
        <Radio value="sm-extra">小尺寸附加选项</Radio>
      </RadioGroup>
      <RadioGroup aria-label="中尺寸" defaultValue="md" size="md">
        <Radio value="md">中尺寸选项</Radio>
        <Radio value="md-extra">中尺寸附加选项</Radio>
      </RadioGroup>
      <RadioGroup aria-label="大尺寸" defaultValue="lg" size="lg">
        <Radio value="lg">大尺寸选项</Radio>
        <Radio value="lg-extra">大尺寸附加选项</Radio>
      </RadioGroup>
    </div>
  )
};

export const Controlled: Story = {
  name: "受控单选组",
  render: () => <ControlledRadioGroupStory />
};

export const States: Story = {
  name: "状态",
  render: () => (
    <div style={storyStackStyles}>
      <RadioGroup aria-label="已选状态" defaultValue="enabled">
        <Radio value="enabled">已选选项</Radio>
        <Radio value="disabled">未选选项</Radio>
      </RadioGroup>
      <RadioGroup aria-label="禁用组" defaultValue="locked" disabled>
        <Radio value="locked">禁用且已选</Radio>
        <Radio value="editable">禁用选项</Radio>
      </RadioGroup>
      <RadioGroup aria-label="错误组" errorText="请选择默认审批模式" invalid>
        <Radio value="manual">人工审批</Radio>
        <Radio value="auto">自动审批</Radio>
      </RadioGroup>
    </div>
  )
};

export const Horizontal: Story = {
  name: "水平排列",
  render: () => (
    <RadioGroup aria-label="时间范围" defaultValue="today" orientation="horizontal">
      <Radio value="today">今天</Radio>
      <Radio value="week">本周</Radio>
      <Radio value="month">本月</Radio>
      <Radio value="custom">自定义</Radio>
    </RadioGroup>
  )
};

export const WithDescription: Story = {
  name: "说明文本",
  render: () => (
    <RadioGroup aria-label="通知策略" defaultValue="important">
      <Radio description="仅审批、退款和权限变更触发通知。" value="important">
        只通知高优先级事件
      </Radio>
      <Radio description="所有成员操作都会写入通知队列。" value="all">
        通知全部事件
      </Radio>
    </RadioGroup>
  )
};

export const WithField: Story = {
  name: "组合 Field",
  render: () => (
    <form style={storyStackStyles}>
      <Field helpText="方向键会在可用选项之间移动焦点并更新选择。" label="默认通知方式" required>
        <RadioGroup defaultValue="email" name="defaultNotice">
          <Radio description="适合审批、账单和权限变更等高优先级事件。" value="email">
            邮件通知
          </Radio>
          <Radio value="sms">短信通知</Radio>
          <Radio disabled value="webhook">
            Webhook 暂不可用
          </Radio>
        </RadioGroup>
      </Field>
      <Field errorText="请选择导出范围" label="导出范围" required>
        <RadioGroup name="exportScope">
          <Radio value="current">当前页</Radio>
          <Radio value="all">全部结果</Radio>
        </RadioGroup>
      </Field>
    </form>
  )
};

export const InFormContext: Story = {
  name: "表单场景",
  render: () => (
    <form style={storyStackStyles}>
      <RadioGroup defaultValue="active" name="status">
        <Radio value="active">仅启用客户</Radio>
        <Radio value="paused">仅停用客户</Radio>
        <Radio value="all">全部客户</Radio>
      </RadioGroup>
      <RadioGroup defaultValue="owner" name="scope" orientation="horizontal">
        <Radio value="owner">我的客户</Radio>
        <Radio value="team">团队客户</Radio>
      </RadioGroup>
      <div style={storyRowStyles}>
        <Radio defaultChecked name="single-confirm" value="confirmed">
          单个原生 Radio
        </Radio>
      </div>
    </form>
  )
};
