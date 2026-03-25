import { Button } from "@rush-ui/react";
import type { CSSProperties } from "react";

const iconStyles = {
  display: "inline-flex",
  fontSize: "0.95em",
  lineHeight: 1
} satisfies CSSProperties;

const PlusIcon = () => <span style={iconStyles}>+</span>;
const ArrowIcon = () => <span style={iconStyles}>→</span>;

const meta = {
  title: "Components/Button",
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
  }
};

export default meta;

export const Playground = {};

export const Variants = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <Button variant="solid">主要操作</Button>
      <Button variant="outline">次要操作</Button>
      <Button variant="ghost">轻量操作</Button>
      <Button variant="subtle">弱强调操作</Button>
    </div>
  )
};

export const Sizes = {
  render: () => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <Button size="sm">小按钮</Button>
      <Button size="md">中按钮</Button>
      <Button size="lg">大按钮</Button>
    </div>
  )
};

export const LoadingStates = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <Button loading>保存</Button>
      <Button loading loadingText="提交中" variant="outline">
        提交
      </Button>
    </div>
  )
};

export const WithIcons = {
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

export const InFormContext = {
  render: () => (
    <form style={{ display: "flex", gap: "12px" }}>
      <Button type="button" variant="ghost">
        取消
      </Button>
      <Button type="submit">提交表单</Button>
    </form>
  )
};

export const FocusVisible = {
  render: () => (
    <div style={{ display: "flex", gap: "12px" }}>
      <Button autoFocus>默认聚焦</Button>
      <Button variant="outline">辅助操作</Button>
    </div>
  )
};
