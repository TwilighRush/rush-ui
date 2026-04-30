import { Button } from "@rush-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";

const iconStyles = {
  display: "inline-flex",
  fontSize: "0.95em",
  lineHeight: 1
} satisfies CSSProperties;

const PlusIcon = () => <span style={iconStyles}>+</span>;
const ArrowIcon = () => <span style={iconStyles}>→</span>;

const componentDescription = `
Button 用于触发表单、表格、工具栏和页面级操作。组件渲染原生 button，默认 type 为 button，并在 loading 时使用原生 disabled 阻止重复触发。

可访问性说明：
- 原生支持 Enter 和 Space 键触发。
- disabled 与 loading 都会进入不可交互状态。
- loading 状态会设置 aria-busy，并优先展示 loadingText。
- startIcon 和 endIcon 作为装饰图标处理，按钮名称应来自文本内容。
`;

const meta = {
  title: "组件/Button",
  component: Button,
  args: {
    children: "保存变更",
    size: "md",
    variant: "solid",
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
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "交互预览"
};

export const Variants: Story = {
  name: "视觉层级",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <Button variant="solid">主要操作</Button>
      <Button variant="outline">次要操作</Button>
      <Button variant="ghost">轻量操作</Button>
      <Button variant="subtle">弱强调操作</Button>
    </div>
  )
};

export const Sizes: Story = {
  name: "尺寸",
  render: () => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <Button size="sm">小按钮</Button>
      <Button size="md">中按钮</Button>
      <Button size="lg">大按钮</Button>
    </div>
  )
};

export const LoadingStates: Story = {
  name: "加载状态",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <Button loading>保存</Button>
      <Button loading loadingText="提交中" variant="outline">
        提交
      </Button>
    </div>
  )
};

export const DisabledStates: Story = {
  name: "禁用状态",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <Button disabled>不可用操作</Button>
      <Button disabled variant="outline">
        不可用次要操作
      </Button>
      <Button disabled variant="ghost">
        不可用轻量操作
      </Button>
    </div>
  )
};

export const WithIcons: Story = {
  name: "图标插槽",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <Button startIcon={<PlusIcon />}>新建记录</Button>
      <Button endIcon={<ArrowIcon />} variant="outline">
        下一步
      </Button>
      <Button endIcon={<ArrowIcon />} startIcon={<PlusIcon />} variant="subtle">
        创建并继续
      </Button>
    </div>
  )
};

export const InFormContext: Story = {
  name: "表单场景",
  render: () => (
    <form style={{ display: "flex", gap: "12px" }}>
      <Button type="button" variant="ghost">
        取消
      </Button>
      <Button type="submit">提交表单</Button>
    </form>
  )
};

export const FocusVisible: Story = {
  name: "键盘焦点",
  render: () => (
    <div style={{ display: "flex", gap: "12px" }}>
      <Button autoFocus>默认聚焦</Button>
      <Button variant="outline">辅助操作</Button>
    </div>
  )
};
