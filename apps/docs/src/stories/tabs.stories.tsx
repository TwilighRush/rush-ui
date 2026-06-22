import { Tabs } from "@rush_ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta = {
  title: "组件/导航/Tabs",
  parameters: {
    docs: {
      description: {
        component: `Tabs 在同一工作上下文中切换并列内容。\n\n可访问性说明：遵循 tablist/tab/tabpanel 语义；水平模式使用左右方向键，垂直模式使用上下方向键，并支持 Home、End 和禁用项跳过。`
      }
    }
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "默认",
  render: () => (
    <Tabs.Root defaultValue="members" style={{ maxWidth: 680 }}>
      <Tabs.List aria-label="工作区设置">
        <Tabs.Trigger value="members">成员</Tabs.Trigger>
        <Tabs.Trigger value="roles">角色</Tabs.Trigger>
        <Tabs.Trigger value="audit">审计日志</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="members">管理成员状态、部门和访问范围。</Tabs.Content>
      <Tabs.Content value="roles">配置角色权限与默认数据范围。</Tabs.Content>
      <Tabs.Content value="audit">查看关键配置和成员权限的变更记录。</Tabs.Content>
    </Tabs.Root>
  )
};

export const Vertical: Story = {
  name: "垂直排列",
  render: () => (
    <Tabs.Root defaultValue="profile" orientation="vertical" style={{ maxWidth: 680 }}>
      <Tabs.List aria-label="账户设置">
        <Tabs.Trigger value="profile">个人资料</Tabs.Trigger>
        <Tabs.Trigger value="security">登录安全</Tabs.Trigger>
        <Tabs.Trigger disabled value="billing">账单</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="profile">维护姓名、头像和所属部门。</Tabs.Content>
      <Tabs.Content value="security">管理密码、登录设备和双因素认证。</Tabs.Content>
      <Tabs.Content value="billing">账单信息。</Tabs.Content>
    </Tabs.Root>
  )
};

export const ManualActivation: Story = {
  name: "手动激活",
  render: () => (
    <Tabs.Root activationMode="manual" defaultValue="overview" style={{ maxWidth: 680 }}>
      <Tabs.List aria-label="项目视图">
        <Tabs.Trigger value="overview">概览</Tabs.Trigger>
        <Tabs.Trigger value="activity">动态</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">方向键只移动焦点，按 Enter 或 Space 后切换内容。</Tabs.Content>
      <Tabs.Content value="activity">最近项目动态。</Tabs.Content>
    </Tabs.Root>
  )
};

function ControlledTabsExample() {
  const [value, setValue] = useState("members");
  return (
    <Tabs.Root value={value} onValueChange={setValue} style={{ maxWidth: 680 }}>
      <Tabs.List aria-label="受控成员视图">
        <Tabs.Trigger value="members">成员</Tabs.Trigger>
        <Tabs.Trigger value="roles">角色</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="members">当前外部值：{value}</Tabs.Content>
      <Tabs.Content value="roles">当前外部值：{value}</Tabs.Content>
    </Tabs.Root>
  );
}

export const Controlled: Story = {
  name: "受控状态",
  render: () => <ControlledTabsExample />
};

export const ForceMounted: Story = {
  name: "保留面板状态",
  render: () => (
    <Tabs.Root defaultValue="draft" style={{ maxWidth: 680 }}>
      <Tabs.List aria-label="编辑状态">
        <Tabs.Trigger value="draft">草稿</Tabs.Trigger>
        <Tabs.Trigger value="preview">预览</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content forceMount value="draft"><input aria-label="草稿标题" defaultValue="季度方案" /></Tabs.Content>
      <Tabs.Content forceMount value="preview">切换后草稿输入状态仍保留。</Tabs.Content>
    </Tabs.Root>
  )
};
