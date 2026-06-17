import { Textarea } from "@rush-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";
import { useState } from "react";

const storyRowStyles = {
  alignItems: "flex-start",
  display: "flex",
  flexWrap: "wrap",
  gap: "16px"
} satisfies CSSProperties;

const storyStackStyles = {
  display: "grid",
  gap: "12px",
  maxWidth: "420px"
} satisfies CSSProperties;

const componentDescription = `
Textarea 用于后台系统中的备注、说明、审批意见和长文本配置。组件渲染原生 textarea，并与 Input 保持一致的尺寸、错误态、字数统计、受控/非受控和焦点样式。

可访问性说明：
- 输入行为沿用原生 textarea，保留多行键盘输入、复制粘贴和表单提交能力。
- 受控模式使用 value + onValueChange，非受控模式使用 defaultValue。
- showCount 会把字数统计自动关联到 aria-describedby。
- invalid 状态会设置 aria-invalid；提供 errorText 时会自动关联 aria-describedby。
- autoSize 只调整高度，不改变原生输入语义；传入 maxRows 后超出内容保留内部滚动。
- suffix 作为装饰性后置内容渲染，不应承载必要语义。
- disabled 使用原生 disabled；readOnly 使用原生 readOnly，并保留可聚焦语义。
`;

function ControlledTextareaStory() {
  const [value, setValue] = useState("请补充客户回访结论。");

  return (
    <div style={storyStackStyles}>
      <Textarea aria-label="回访结论" onValueChange={setValue} value={value} />
      <p style={{ margin: 0 }}>当前值：{value}</p>
    </div>
  );
}

const meta = {
  title: "组件/表单/Textarea",
  component: Textarea,
  args: {
    "aria-label": "备注",
    placeholder: "请输入备注",
    size: "md",
    autoSize: false,
    disabled: false,
    invalid: false,
    readOnly: false,
    showCount: false
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
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "交互预览"
};

export const Sizes: Story = {
  name: "尺寸",
  render: () => (
    <div style={storyRowStyles}>
      <Textarea aria-label="小尺寸" placeholder="小尺寸备注" size="sm" />
      <Textarea aria-label="中尺寸" placeholder="中尺寸备注" size="md" />
      <Textarea aria-label="大尺寸" placeholder="大尺寸备注" size="lg" />
    </div>
  )
};

export const Controlled: Story = {
  name: "受控输入",
  render: () => <ControlledTextareaStory />
};

export const States: Story = {
  name: "状态",
  render: () => (
    <div style={storyRowStyles}>
      <Textarea aria-label="禁用备注" disabled placeholder="不可编辑" />
      <Textarea aria-label="只读备注" readOnly value="系统归档说明" />
      <Textarea aria-label="错误备注" errorText="审批意见不能为空" invalid placeholder="请输入审批意见" />
    </div>
  )
};

export const CountAndSuffix: Story = {
  name: "字数统计与后置内容",
  render: () => (
    <div style={storyStackStyles}>
      <Textarea aria-label="客户备注" defaultValue="客户希望下周三再联系。" maxLength={80} showCount />
      <Textarea aria-label="快捷备注" placeholder="输入后按快捷键提交" suffix="⌘ Enter" />
      <Textarea
        aria-label="错误客户备注"
        defaultValue="当前说明过短"
        errorText="请补充处理动作和下一步跟进计划"
        invalid
        maxLength={120}
        showCount
      />
    </div>
  )
};

export const AutoSize: Story = {
  name: "自适应高度",
  render: () => (
    <div style={storyStackStyles}>
      <Textarea
        aria-label="处理说明"
        autoSize={{ minRows: 2, maxRows: 6 }}
        defaultValue={"已完成客户资料核对。\n待销售同事补充跟进记录。"}
        maxLength={200}
        showCount
      />
      <Textarea aria-label="简短备注" autoSize placeholder="输入内容时高度自动增长" />
    </div>
  )
};

export const InFormContext: Story = {
  name: "表单场景",
  render: () => (
    <form style={storyStackStyles}>
      <label htmlFor="story-textarea-remark">备注</label>
      <Textarea defaultValue="客户要求保留历史联系人。" id="story-textarea-remark" name="remark" />
    </form>
  )
};
