import { Skeleton } from "@rush_ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";

const componentDescription = `
Skeleton 用于已知内容结构但数据尚未返回的占位状态，例如表格行、详情字段和头像资料。

可访问性说明：
- 默认 aria-hidden="true"，只作为视觉占位，不抢占焦点。
- 加载区域应由上层容器声明 aria-busy，必要时配合 Spinner 或 status 文本播报加载状态。
- animated={false} 可关闭闪动效果；组件样式同时尊重 prefers-reduced-motion。
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

const tableStyles = {
  borderCollapse: "collapse",
  width: "100%"
} satisfies CSSProperties;

const cellStyles = {
  borderBottom: "1px solid var(--rui-color-border)",
  padding: "12px",
  textAlign: "left"
} satisfies CSSProperties;

const meta = {
  title: "组件/反馈/Skeleton",
  component: Skeleton,
  args: {
    variant: "block"
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["text", "block", "circle"]
    }
  },
  parameters: {
    docs: {
      description: {
        component: componentDescription
      }
    }
  }
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "交互预览"
};

export const TextLines: Story = {
  name: "文本占位",
  render: () => (
    <div style={{ ...panelStyles, maxWidth: 520 }}>
      <Skeleton lines={4} variant="text" />
    </div>
  )
};

export const DetailPlaceholder: Story = {
  name: "详情占位",
  render: () => (
    <section aria-busy="true" aria-label="成员详情加载中" style={{ ...panelStyles, maxWidth: 560 }}>
      <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
        <Skeleton variant="circle" />
        <div style={{ display: "grid", flex: 1, gap: 8 }}>
          <Skeleton height={16} variant="text" width="36%" />
          <Skeleton height={14} variant="text" width="58%" />
        </div>
      </div>
      <Skeleton lines={3} variant="text" />
      <Skeleton height={96} />
    </section>
  )
};

export const TablePlaceholder: Story = {
  name: "表格占位",
  render: () => (
    <div aria-busy="true" aria-label="成员表格加载中" style={panelStyles}>
      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={cellStyles}>成员</th>
            <th style={cellStyles}>角色</th>
            <th style={cellStyles}>状态</th>
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2].map((row) => (
            <tr key={row}>
              <td style={cellStyles}><Skeleton height={16} variant="text" width="72%" /></td>
              <td style={cellStyles}><Skeleton height={16} variant="text" width="48%" /></td>
              <td style={cellStyles}><Skeleton height={24} width="4.5rem" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
};

export const WithoutAnimation: Story = {
  name: "关闭动画",
  render: () => (
    <div style={{ ...panelStyles, maxWidth: 420 }}>
      <Skeleton animated={false} lines={3} variant="text" />
      <Skeleton animated={false} height={80} />
    </div>
  )
};

export const NarrowContainer: Story = {
  name: "窄容器",
  render: () => (
    <div style={{ ...panelStyles, maxWidth: 220 }}>
      <Skeleton lines={5} variant="text" />
    </div>
  )
};
