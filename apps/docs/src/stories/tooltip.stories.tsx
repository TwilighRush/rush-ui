import { Button, Field, IconButton, Input, Tooltip } from "@rush_ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta = {
  title: "组件/反馈/Tooltip",
  parameters: {
    docs: {
      description: {
        component: `Tooltip 为可聚焦控件提供短说明。\n\n可访问性说明：打开时触发元素通过 aria-describedby 关联 role="tooltip" 内容；键盘 focus 会立即打开，Escape 可关闭。Tooltip 不承载交互内容，需要按钮、表单或链接时使用 Popover。`
      }
    }
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconAction: Story = {
  name: "图标按钮说明",
  render: () => (
    <div style={{ display: "flex", gap: 12, padding: 48 }}>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <IconButton aria-label="刷新列表" icon={<span>R</span>} size="lg" variant="outline" />
        </Tooltip.Trigger>
        <Tooltip.Content>重新获取最新成员数据</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <IconButton aria-label="导出数据" icon={<span>↓</span>} size="lg" variant="outline" />
        </Tooltip.Trigger>
        <Tooltip.Content>导出当前筛选结果</Tooltip.Content>
      </Tooltip.Root>
    </div>
  )
};

export const FieldHelp: Story = {
  name: "字段解释",
  render: () => (
    <div style={{ maxWidth: 360, padding: 48 }}>
      <Field
        helpText="展示名称会用于成员列表和审批记录。"
        label={
          <span style={{ alignItems: "center", display: "inline-flex", gap: 8 }}>
            展示名称
            <Tooltip.Root>
              <Tooltip.Trigger>
                <IconButton aria-label="查看展示名称说明" icon={<span>?</span>} size="sm" variant="ghost" />
              </Tooltip.Trigger>
              <Tooltip.Content align="start">建议使用真实姓名或团队内统一昵称。</Tooltip.Content>
            </Tooltip.Root>
          </span>
        }
      >
        <Input placeholder="请输入展示名称" />
      </Field>
    </div>
  )
};

export const Placement: Story = {
  name: "方向与对齐",
  render: () => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: 16, padding: 96 }}>
      <Tooltip.Root openDelay={0}>
        <Tooltip.Trigger>
          <Button variant="outline">顶部</Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="top">顶部居中显示</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root openDelay={0}>
        <Tooltip.Trigger>
          <Button variant="outline">右侧</Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="right">右侧显示</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root openDelay={0}>
        <Tooltip.Trigger>
          <Button variant="outline">底部末端</Button>
        </Tooltip.Trigger>
        <Tooltip.Content align="end" side="bottom">
          底部末端对齐
        </Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root openDelay={0}>
        <Tooltip.Trigger>
          <Button variant="outline">左侧</Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="left">左侧显示</Tooltip.Content>
      </Tooltip.Root>
    </div>
  )
};

function ControlledTooltipExample() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "start", padding: 48 }}>
      <Tooltip.Root onOpenChange={setOpen} open={open}>
        <Tooltip.Trigger>
          <Button variant="outline">{open ? "说明已显示" : "显示说明"}</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>外部状态控制 Tooltip 是否显示。</Tooltip.Content>
      </Tooltip.Root>
      <Button onClick={() => setOpen((value) => !value)} variant="subtle">
        {open ? "关闭说明" : "打开说明"}
      </Button>
    </div>
  );
}

export const Controlled: Story = {
  name: "受控状态",
  render: () => <ControlledTooltipExample />
};

export const DisabledTooltip: Story = {
  name: "禁用 Tooltip",
  render: () => (
    <div style={{ padding: 48 }}>
      <Tooltip.Root disabled>
        <Tooltip.Trigger>
          <Button variant="outline">不会显示说明</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>这段内容不会被打开。</Tooltip.Content>
      </Tooltip.Root>
    </div>
  )
};

export const LongContent: Story = {
  name: "长文本换行",
  render: () => (
    <div style={{ padding: 48 }}>
      <Tooltip.Root openDelay={0}>
        <Tooltip.Trigger>
          <Button variant="outline">查看规则</Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          成员状态会同步影响登录权限、通知范围和审批可见性，修改前请确认当前成员是否仍参与项目协作。
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  )
};
