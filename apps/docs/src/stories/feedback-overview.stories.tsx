import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";

const pageStyles = {
  color: "var(--rui-color-ink)",
  display: "grid",
  gap: "16px",
  margin: "0 auto",
  maxWidth: "720px",
  padding: "40px 24px"
} satisfies CSSProperties;

const panelStyles = {
  background: "var(--rui-color-surface)",
  border: "1px solid var(--rui-color-border)",
  borderRadius: "8px",
  padding: "20px"
} satisfies CSSProperties;

const meta = {
  title: "组件/反馈",
  parameters: {
    docs: {
      description: {
        component: "反馈类组件用于向用户说明操作结果、系统状态或需要关注的风险。"
      }
    }
  }
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  name: "概览",
  render: () => (
    <main style={pageStyles}>
      <header>
        <p style={{ color: "var(--rui-color-accent)", fontWeight: 700, margin: "0 0 8px" }}>反馈</p>
        <h1 style={{ fontSize: "2rem", lineHeight: 1.2, margin: 0 }}>反馈类组件</h1>
      </header>
      <section style={panelStyles}>
        <p style={{ color: "var(--rui-color-ink-muted)", lineHeight: 1.7, margin: 0 }}>
          当前已包含区域内提示 Alert、短说明 Tooltip，以及承担聚焦流程和上下文内容的 Dialog、Popover。后续可将 Toast、Loading
          等提示与响应状态组件归入这里。
        </p>
      </section>
    </main>
  )
};
