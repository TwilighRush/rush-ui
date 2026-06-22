import { Button, Dialog, Field, Input, Select } from "@rush_ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { useRef, useState } from "react";

const meta = {
  title: "组件/反馈/Dialog",
  parameters: {
    docs: {
      description: {
        component: `Dialog 用于必须先完成或确认的短流程。\n\n可访问性说明：使用 aria-modal dialog 语义；打开后移动焦点并限制 Tab 范围，Escape 或关闭操作会恢复触发器焦点，背景打开期间锁定页面滚动。`
      }
    }
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const EditMember: Story = {
  name: "编辑成员",
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>编辑成员</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>编辑成员</Dialog.Title>
        <Dialog.Description>调整成员信息与工作区角色，保存后立即生效。</Dialog.Description>
        <div style={{ display: "grid", gap: 16, marginTop: 20 }}>
          <Field label="成员姓名" required>
            <Input defaultValue="林一" />
          </Field>
          <Field label="工作区角色" required>
            <Select
              defaultValue="editor"
              options={[
                { label: "管理员", value: "admin" },
                { label: "编辑者", value: "editor" },
                { label: "只读成员", value: "viewer" }
              ]}
            />
          </Field>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 24 }}>
          <Dialog.Close>取消</Dialog.Close>
          <Button>保存变更</Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
};

export const DestructiveConfirmation: Story = {
  name: "危险操作确认",
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>移除成员</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>移除成员？</Dialog.Title>
        <Dialog.Description>成员将失去当前工作区的访问权限，已创建的数据不会被删除。</Dialog.Description>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 24 }}>
          <Dialog.Close>取消</Dialog.Close>
          <Button>确认移除</Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
};

export const LockedBackdrop: Story = {
  name: "禁止点击背景关闭",
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>查看处理中任务</Dialog.Trigger>
      <Dialog.Content closeOnBackdropClick={false}>
        <Dialog.Title>正在同步权限</Dialog.Title>
        <Dialog.Description>此任务完成前不能通过点击背景关闭，请使用下方操作。</Dialog.Description>
        <div style={{ marginTop: 24 }}><Dialog.Close>返回</Dialog.Close></div>
      </Dialog.Content>
    </Dialog.Root>
  )
};

function ControlledDialogExample() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "start" }}>
      <span>当前状态：{open ? "已打开" : "已关闭"}</span>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>受控打开</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>受控 Dialog</Dialog.Title>
          <Dialog.Description>外部状态是打开与关闭的唯一数据源。</Dialog.Description>
          <div style={{ marginTop: 24 }}><Dialog.Close>完成</Dialog.Close></div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}

export const Controlled: Story = {
  name: "受控状态",
  render: () => <ControlledDialogExample />
};

function InitialFocusExample() {
  const focusRef = useRef<HTMLInputElement>(null);
  return (
    <Dialog.Root>
      <Dialog.Trigger>分配成员</Dialog.Trigger>
      <Dialog.Content initialFocusRef={focusRef}>
        <Dialog.Title>分配成员</Dialog.Title>
        <Dialog.Description>打开后焦点直接进入最需要输入的字段。</Dialog.Description>
        <div style={{ marginTop: 20 }}>
          <Field label="成员邮箱"><Input ref={focusRef} /></Field>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 24 }}>
          <Dialog.Close>取消</Dialog.Close><Button>发送邀请</Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export const InitialFocus: Story = {
  name: "指定初始焦点",
  render: () => <InitialFocusExample />
};

export const TriggerStates: Story = {
  name: "触发器边界状态",
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <Dialog.Root><Dialog.Trigger disabled>无权限打开</Dialog.Trigger></Dialog.Root>
      <Dialog.Root><Dialog.Trigger loading loadingText="准备中">准备数据</Dialog.Trigger></Dialog.Root>
    </div>
  )
};
