import { Badge } from "@rush-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

const componentDescription = `
Badge 用于展示对象、流程或记录的轻量状态，例如表格状态、审批进度、同步结果和筛选条件标识。组件渲染非交互 span，状态圆点作为装饰内容处理，必要语义应来自可见文本。

可访问性说明：
- 默认不设置 role="status"，避免静态状态被误当作 live region。
- 状态不能只依赖颜色表达，应提供清晰的文本内容。
- processing 仅提供轻量视觉动效，并在 reduced-motion 环境下降级为静态圆点。
- 需要向辅助技术主动播报状态变化时，可由使用方传入 role、aria-live 或 aria-label。
`;

const meta = {
  title: "组件/Badge",
  component: Badge,
  args: {
    children: "默认",
    size: "md",
    variant: "default"
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "success", "warning", "error", "info", "processing"]
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
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "交互预览"
};

export const Variants: Story = {
  name: "状态",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <Badge variant="default">默认</Badge>
      <Badge variant="success">成功</Badge>
      <Badge variant="warning">警告</Badge>
      <Badge variant="error">错误</Badge>
      <Badge variant="info">信息</Badge>
      <Badge variant="processing">处理中</Badge>
    </div>
  )
};

export const Sizes: Story = {
  name: "尺寸",
  render: () => (
    <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <Badge size="sm" variant="success">
        小尺寸
      </Badge>
      <Badge size="md" variant="info">
        中尺寸
      </Badge>
      <Badge size="lg" variant="warning">
        大尺寸
      </Badge>
    </div>
  )
};

export const InTableStatus: Story = {
  name: "表格状态",
  render: () => (
    <div style={{ display: "grid", gap: "10px", maxWidth: "520px" }}>
      {[
        ["订单 #1024", <Badge variant="success">已完成</Badge>],
        ["订单 #1025", <Badge variant="processing">同步中</Badge>],
        ["订单 #1026", <Badge variant="warning">待复核</Badge>],
        ["订单 #1027", <Badge variant="error">失败</Badge>],
        ["订单 #1028", <Badge variant="info">已归档</Badge>]
      ].map(([name, status]) => (
        <div
          key={String(name)}
          style={{
            alignItems: "center",
            borderBottom: "1px solid var(--rui-color-border)",
            display: "grid",
            gap: "12px",
            gridTemplateColumns: "1fr auto",
            minHeight: "40px"
          }}
        >
          <span style={{ color: "var(--rui-color-ink)", fontSize: "0.9375rem" }}>{name}</span>
          {status}
        </div>
      ))}
    </div>
  )
};

export const FilterChips: Story = {
  name: "筛选标识",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      <Badge size="sm" variant="info">
        区域：华东
      </Badge>
      <Badge size="sm" variant="default">
        渠道：直营
      </Badge>
      <Badge size="sm" variant="success">
        SLA：达标
      </Badge>
      <Badge size="sm" variant="warning">
        风险：需关注
      </Badge>
    </div>
  )
};

export const LongText: Story = {
  name: "长文本",
  render: () => (
    <div style={{ maxWidth: "180px" }}>
      <Badge title="信息：第三方系统回传等待人工确认" variant="info">
        信息：第三方系统回传等待人工确认
      </Badge>
    </div>
  )
};
