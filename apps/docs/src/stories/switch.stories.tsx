import { Switch } from "@rush_ui/react";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "组件/表单/Switch",
  component: Switch,
  args: {
    children: "启用自动审批",
    defaultChecked: false,
    disabled: false,
    size: "md"
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] }
  },
  parameters: {
    docs: {
      description: {
        component: `Switch 用于立即生效的二元设置。\n\n可访问性说明：使用原生 checkbox 与 role=switch；支持 Tab 聚焦、Space 切换、表单提交和 reset。可见名称在开关状态变化时应保持不变。`
      }
    }
  }
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { name: "交互预览" };

export const Sizes: Story = {
  name: "尺寸",
  render: () => (
    <div style={{ alignItems: "center", display: "flex", gap: 20 }}>
      <Switch size="sm">小尺寸</Switch>
      <Switch defaultChecked>中尺寸</Switch>
      <Switch defaultChecked size="lg">大尺寸</Switch>
    </div>
  )
};

export const Settings: Story = {
  name: "设置场景",
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 480 }}>
      <Switch defaultChecked description="仅适用于风险评分低于 20 的申请。">自动通过低风险申请</Switch>
      <Switch description="角色与权限发生变化时通知管理员。">成员变更邮件通知</Switch>
      <Switch description="当前套餐暂不支持此能力。" disabled>强制双因素认证</Switch>
    </div>
  )
};

export const Invalid: Story = {
  name: "错误状态",
  render: () => (
    <Switch description="发布前必须完成此设置。" errorText="请先启用审计记录" invalid required>
      启用审计记录
    </Switch>
  )
};
