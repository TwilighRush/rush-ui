import { IconButton } from "@rush-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";

const iconStyles = {
  display: "inline-flex",
  fontSize: "1em",
  fontWeight: 700,
  lineHeight: 1
} satisfies CSSProperties;

const AddIcon = () => <span style={iconStyles}>+</span>;
const RefreshIcon = () => <span style={iconStyles}>↻</span>;
const MoreIcon = () => <span style={iconStyles}>⋯</span>;
const CloseIcon = () => <span style={iconStyles}>×</span>;

const componentDescription = `
IconButton 用于只展示图标的操作入口。组件渲染原生 button，默认 type 为 button，并要求通过 aria-label 或 aria-labelledby 提供可访问名称。

可访问性说明：
- 原生支持 Enter 和 Space 键触发。
- icon 内容默认 aria-hidden，不参与按钮名称。
- disabled 与 loading 都会进入不可交互状态。
- loading 状态会设置 aria-busy，按钮原有可访问名称保持不变。
`;

const meta = {
  title: "组件/基础/IconButton",
  component: IconButton,
  args: {
    "aria-label": "刷新列表",
    icon: <RefreshIcon />,
    size: "md",
    variant: "ghost",
    disabled: false,
    loading: false
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["solid", "outline", "ghost", "subtle"]
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
  }
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "交互预览"
};

export const Variants: Story = {
  name: "视觉层级",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <IconButton aria-label="新建" icon={<AddIcon />} variant="solid" />
      <IconButton aria-label="刷新" icon={<RefreshIcon />} variant="outline" />
      <IconButton aria-label="更多操作" icon={<MoreIcon />} variant="ghost" />
      <IconButton aria-label="关闭" icon={<CloseIcon />} variant="subtle" />
    </div>
  )
};

export const Sizes: Story = {
  name: "尺寸",
  render: () => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <IconButton aria-label="小尺寸刷新" icon={<RefreshIcon />} size="sm" />
      <IconButton aria-label="中尺寸刷新" icon={<RefreshIcon />} size="md" />
      <IconButton aria-label="大尺寸刷新" icon={<RefreshIcon />} size="lg" />
    </div>
  )
};

export const LoadingStates: Story = {
  name: "加载状态",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <IconButton aria-label="刷新列表" icon={<RefreshIcon />} loading />
      <IconButton aria-label="提交设置" icon={<AddIcon />} loading variant="outline" />
    </div>
  )
};

export const DisabledStates: Story = {
  name: "禁用状态",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <IconButton aria-label="不可用的新建" disabled icon={<AddIcon />} variant="solid" />
      <IconButton aria-label="不可用的刷新" disabled icon={<RefreshIcon />} variant="outline" />
      <IconButton aria-label="不可用的更多操作" disabled icon={<MoreIcon />} />
    </div>
  )
};

export const LabelledBy: Story = {
  name: "外部命名",
  render: () => (
    <div style={{ alignItems: "center", display: "flex", gap: "12px" }}>
      <span id="toolbar-refresh-label">刷新当前列表</span>
      <IconButton aria-labelledby="toolbar-refresh-label" icon={<RefreshIcon />} variant="outline" />
    </div>
  )
};
