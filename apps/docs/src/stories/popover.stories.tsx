import { Button, Checkbox, CheckboxGroup, Field, Popover, Select } from "@rush_ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta = {
  title: "组件/反馈/Popover",
  parameters: {
    docs: {
      description: {
        component: `Popover 在触发器附近承载轻量设置和补充信息。\n\n可访问性说明：触发器暴露展开状态与内容关联；Escape 和外部点击关闭，Escape 关闭后焦点返回触发器。交互内容必须提供 aria-label 或 aria-labelledby。`
      }
    }
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const FilterPanel: Story = {
  name: "筛选面板",
  render: () => (
    <Popover.Root>
      <Popover.Trigger>筛选成员</Popover.Trigger>
      <Popover.Content aria-label="成员筛选条件">
        <Field label="成员状态">
          <CheckboxGroup defaultValue={["active"]}>
            <Checkbox value="active">正常</Checkbox>
            <Checkbox value="invited">待加入</Checkbox>
            <Checkbox value="disabled">已停用</Checkbox>
          </CheckboxGroup>
        </Field>
      </Popover.Content>
    </Popover.Root>
  )
};

export const Placement: Story = {
  name: "对齐与方向",
  render: () => (
    <div style={{ display: "flex", gap: 16, paddingTop: 120 }}>
      <Popover.Root>
        <Popover.Trigger>顶部居中</Popover.Trigger>
        <Popover.Content align="center" aria-label="顶部提示" side="top">内容会在空间不足时自动翻转。</Popover.Content>
      </Popover.Root>
      <Popover.Root>
        <Popover.Trigger>底部末端</Popover.Trigger>
        <Popover.Content align="end" aria-label="底部提示">末端对齐内容。</Popover.Content>
      </Popover.Root>
    </div>
  )
};

export const WithSelect: Story = {
  name: "内嵌选择器",
  render: () => (
    <Popover.Root>
      <Popover.Trigger>筛选角色</Popover.Trigger>
      <Popover.Content aria-label="角色筛选条件">
        <div style={{ display: "grid", gap: 12, width: 280 }}>
          <Field label="成员角色">
            <Select
              options={[
                { label: "管理员", value: "admin" },
                { label: "编辑者", value: "editor" },
                { label: "只读成员", value: "viewer" }
              ]}
              placeholder="请选择角色"
            />
          </Field>
          <Button size="sm">应用筛选</Button>
        </div>
      </Popover.Content>
    </Popover.Root>
  )
};

function ControlledPopoverExample() {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>{open ? "收起筛选" : "展开筛选"}</Popover.Trigger>
      <Popover.Content aria-label="受控筛选面板">
        外部状态控制浮层是否挂载。
      </Popover.Content>
    </Popover.Root>
  );
}

export const Controlled: Story = {
  name: "受控状态",
  render: () => <ControlledPopoverExample />
};

export const DisabledTrigger: Story = {
  name: "禁用触发器",
  render: () => (
    <Popover.Root>
      <Popover.Trigger disabled>暂无筛选权限</Popover.Trigger>
      <Popover.Content aria-label="筛选面板">不会打开</Popover.Content>
    </Popover.Root>
  )
};
