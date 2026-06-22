import { DropdownMenu } from "@rush_ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta = {
  title: "组件/导航/DropdownMenu",
  parameters: {
    docs: {
      description: {
        component: `DropdownMenu 收纳与当前对象相关的紧凑操作。\n\n可访问性说明：遵循 menu/menuitem 语义；支持上下方向键、Home、End、多字符定位和 Escape。禁用项保留在菜单焦点顺序中，但不能激活。`
      }
    }
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const RowActions: Story = {
  name: "记录操作",
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>更多操作</DropdownMenu.Trigger>
      <DropdownMenu.Content aria-label="成员操作">
        <DropdownMenu.Label>成员操作</DropdownMenu.Label>
        <DropdownMenu.Item>编辑成员</DropdownMenu.Item>
        <DropdownMenu.Item>重置密码</DropdownMenu.Item>
        <DropdownMenu.Item disabled>转移所有权</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>移除成员</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
};

function ControlledMenuExample() {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger>{open ? "关闭操作" : "打开操作"}</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item textValue="edit member">编辑成员</DropdownMenu.Item>
        <DropdownMenu.Item textValue="remove member">移除成员</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export const Controlled: Story = {
  name: "受控状态",
  render: () => <ControlledMenuExample />
};

export const Empty: Story = {
  name: "空菜单",
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>批量操作</DropdownMenu.Trigger>
      <DropdownMenu.Content><DropdownMenu.Label>暂无可用操作</DropdownMenu.Label></DropdownMenu.Content>
    </DropdownMenu.Root>
  )
};

export const OpenUpward: Story = {
  name: "顶部展开",
  render: () => (
    <div style={{ paddingTop: 180 }}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>导出</DropdownMenu.Trigger>
        <DropdownMenu.Content align="start" aria-label="导出格式" side="top">
          <DropdownMenu.Item>导出 CSV</DropdownMenu.Item>
          <DropdownMenu.Item>导出 XLSX</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
};
