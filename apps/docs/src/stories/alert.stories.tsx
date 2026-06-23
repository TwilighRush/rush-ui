import { Alert, Button } from "@rush_ui/react";
import type { Meta, StoryObj } from "@storybook/react";

const componentDescription = `
Alert 用于在页面、表单或流程区域内展示需要用户注意的反馈信息，例如同步结果、风险提示、配置说明和保存失败原因。它不是弹窗，也不会接管焦点。

可访问性说明：
- 默认使用 role="status"，error 变体默认使用 role="alert"。
- 紧急程度不匹配时，可以通过 role、aria-live 或 aria-label 覆盖语义。
- 状态图标是装饰内容，状态含义应由标题和正文文本表达。
- actions 区域只负责布局，按钮或链接仍由使用方提供可访问名称。
`;

const meta = {
  title: "组件/反馈/Alert",
  component: Alert,
  args: {
    children: "客户资料已同步到最新版本。",
    title: "同步完成",
    variant: "info"
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "success", "warning", "error", "info"]
    }
  },
  parameters: {
    docs: {
      description: {
        component: componentDescription
      }
    }
  }
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "交互预览"
};

export const Variants: Story = {
  name: "状态",
  render: () => (
    <div style={{ display: "grid", gap: "12px", maxWidth: "720px" }}>
      <Alert title="配置说明" variant="default">
        新建成员会继承当前工作区的默认权限策略。
      </Alert>
      <Alert title="同步完成" variant="success">
        客户资料已更新，相关审批任务也已重新计算。
      </Alert>
      <Alert title="配额即将用尽" variant="warning">
        当前短信额度剩余 8%，建议在批量通知前完成充值。
      </Alert>
      <Alert title="保存失败" variant="error">
        审批规则缺少必填条件，请补充风险等级后重试。
      </Alert>
      <Alert title="系统提示" variant="info">
        成员状态变更会在下一次权限同步后生效。
      </Alert>
    </div>
  )
};

export const WithActions: Story = {
  name: "带操作",
  render: () => (
    <div style={{ maxWidth: "760px" }}>
      <Alert
        actions={
          <>
            <Button size="sm" variant="outline">
              稍后处理
            </Button>
            <Button size="sm">查看详情</Button>
          </>
        }
        title="发现 12 条高风险记录"
        variant="warning"
      >
        系统已暂停自动通过规则，建议先确认命中原因再继续批量审批。
      </Alert>
    </div>
  )
};

export const CompactMessage: Story = {
  name: "简短提示",
  render: () => (
    <div style={{ display: "grid", gap: "12px", maxWidth: "640px" }}>
      <Alert variant="success">筛选条件已保存。</Alert>
      <Alert icon={null} role="note" variant="default">
        这是静态说明文本，不需要作为动态状态播报。
      </Alert>
    </div>
  )
};

export const LongContent: Story = {
  name: "长内容",
  render: () => (
    <div style={{ maxWidth: "560px" }}>
      <Alert title="导入任务部分完成" variant="info">
        已成功导入 236 条客户记录，另有 18 条因为手机号格式不完整被跳过。下载错误明细后，可以在修正字段格式后重新导入。
      </Alert>
    </div>
  )
};
