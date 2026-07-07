import { Button, Spinner } from "@rush_ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";

const componentDescription = `
Spinner 用于表达短暂、明确的加载状态，例如按钮外的局部刷新、表格区域请求和后台任务同步。

可访问性说明：
- 默认渲染 role="status"，无 label 时提供 aria-label="加载中"。
- 传入 label 时会显示可见文本，适合需要说明加载对象或任务的场景。
- 如果 Spinner 只是按钮或其他控件里的装饰图标，可以传入 aria-hidden={true}，组件会移除默认 status 语义。
`;

const panelStyles = {
  background: "var(--rui-color-surface)",
  border: "1px solid var(--rui-color-border)",
  borderRadius: "8px",
  color: "var(--rui-color-ink)",
  display: "grid",
  gap: "16px",
  padding: "20px"
} satisfies CSSProperties;

const rowStyles = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: "16px"
} satisfies CSSProperties;

const meta = {
  title: "组件/反馈/Spinner",
  component: Spinner,
  args: {
    size: "md"
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
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "交互预览"
};

export const Sizes: Story = {
  name: "尺寸",
  render: () => (
    <div style={rowStyles}>
      <Spinner aria-label="加载小尺寸内容" size="sm" />
      <Spinner aria-label="加载默认内容" size="md" />
      <Spinner aria-label="加载大尺寸内容" size="lg" />
    </div>
  )
};

export const WithLabel: Story = {
  name: "带说明文本",
  render: () => (
    <div style={panelStyles}>
      <Spinner label="正在同步成员权限" />
      <Spinner label="正在生成报表，请稍候" size="lg" />
    </div>
  )
};

export const LocalLoading: Story = {
  name: "局部加载",
  render: () => (
    <section aria-busy="true" aria-label="成员列表" style={{ ...panelStyles, maxWidth: 520 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <div>
          <strong>成员列表</strong>
          <p style={{ color: "color-mix(in srgb, var(--rui-color-ink) 68%, transparent)", margin: "6px 0 0" }}>
            重新获取成员、角色和登录状态。
          </p>
        </div>
        <Spinner label="刷新中" size="sm" />
      </div>
    </section>
  )
};

export const Decorative: Story = {
  name: "装饰图标",
  render: () => (
    <Button disabled>
      <Spinner aria-hidden size="sm" />
      保存中
    </Button>
  )
};

export const LongLabel: Story = {
  name: "长文本换行",
  render: () => (
    <div style={{ ...panelStyles, maxWidth: 260 }}>
      <Spinner label="正在重新计算组织范围内所有成员的访问权限和同步状态" />
    </div>
  )
};
