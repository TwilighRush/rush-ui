import { Checkbox, CheckboxGroup, Field, Input, Radio, RadioGroup, Select, Textarea } from "@rush-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";

const formStyles = {
  display: "grid",
  gap: "16px",
  maxWidth: "460px"
} satisfies CSSProperties;

const compactFormStyles = {
  display: "grid",
  gap: "12px",
  maxWidth: "420px"
} satisfies CSSProperties;

const componentDescription = `
Field 用于把 label、说明文本、必填标记、错误态和 Rush 输入控件组合成稳定的表单项。组件会为子输入生成或沿用 id，把 label 自动合并到 aria-labelledby，并把 helpText 自动合并到 aria-describedby。

可访问性说明：
- label 会通过 htmlFor 关联到子输入控件，并通过 aria-labelledby 支持 CheckboxGroup、RadioGroup、Select 这类组控件。
- helpText 会自动追加到子输入控件的 aria-describedby。
- required 会传递给子输入控件，并渲染视觉必填标记。
- errorText 会传递给 Input / Textarea / CheckboxGroup / RadioGroup / Select，由输入组件设置 aria-invalid 并渲染 role="alert" 错误文本。
- Field 不改变子输入的键盘、禁用、只读和表单提交语义。
`;

const meta = {
  title: "组件/表单/Field",
  component: Field,
  args: {
    children: <Input />,
    label: "项目名称"
  },
  parameters: {
    docs: {
      description: {
        component: componentDescription
      }
    }
  }
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithInput: Story = {
  name: "组合 Input",
  render: () => (
    <form style={formStyles}>
      <Field helpText="项目名称会显示在侧边栏、面包屑和操作日志中。" label="项目名称" required>
        <Input allowClear defaultValue="客户运营后台" maxLength={20} showCount />
      </Field>
      <Field label="项目编号" optionalText="选填">
        <Input endAddon=".rushui.cn" placeholder="workspace" />
      </Field>
    </form>
  )
};

export const WithTextarea: Story = {
  name: "组合 Textarea",
  render: () => (
    <form style={formStyles}>
      <Field helpText="建议写清处理动作、影响范围和下一步计划。" label="处理说明" required>
        <Textarea
          autoSize={{ minRows: 2, maxRows: 6 }}
          defaultValue={"已完成客户资料核对。\n待销售同事补充跟进记录。"}
          maxLength={200}
          showCount
        />
      </Field>
      <Field label="内部备注" optionalText="选填">
        <Textarea placeholder="仅运营团队可见" suffix="⌘ Enter" />
      </Field>
    </form>
  )
};

export const ErrorState: Story = {
  name: "错误态",
  render: () => (
    <form style={compactFormStyles}>
      <Field errorText="项目名称不能为空" label="项目名称" required>
        <Input allowClear placeholder="请输入项目名称" />
      </Field>
      <Field errorText="请补充处理动作和下一步跟进计划" label="审批意见" required>
        <Textarea maxLength={120} placeholder="请输入审批意见" showCount />
      </Field>
    </form>
  )
};

export const FormExample: Story = {
  name: "表单组合",
  render: () => (
    <form style={formStyles}>
      <Field helpText="用于识别后台应用和权限范围。" label="项目名称" required>
        <Input allowClear defaultValue="客户运营后台" maxLength={20} showCount />
      </Field>
      <Field label="项目域名" optionalText="选填">
        <Input endAddon=".rushui.cn" placeholder="workspace" />
      </Field>
      <Field helpText="填写最近一次客户沟通结论。" label="客户备注">
        <Textarea autoSize={{ minRows: 3, maxRows: 6 }} maxLength={160} placeholder="请输入备注" showCount />
      </Field>
    </form>
  )
};

export const WithRadioGroup: Story = {
  name: "组合 RadioGroup",
  render: () => (
    <form style={formStyles}>
      <Field helpText="方向键会在可用选项之间移动焦点并更新选择。" label="默认通知方式" required>
        <RadioGroup defaultValue="email" name="defaultNotice">
          <Radio value="email">邮件通知</Radio>
          <Radio value="sms">短信通知</Radio>
          <Radio disabled value="webhook">
            Webhook 暂不可用
          </Radio>
        </RadioGroup>
      </Field>
      <Field errorText="请选择导出范围" label="导出范围" required>
        <RadioGroup name="exportScope">
          <Radio value="current">当前页</Radio>
          <Radio value="all">全部结果</Radio>
        </RadioGroup>
      </Field>
    </form>
  )
};

export const WithCheckboxGroup: Story = {
  name: "组合 CheckboxGroup",
  render: () => (
    <form style={formStyles}>
      <Field helpText="用于控制成员在客户资料中的操作范围。" label="权限范围" required>
        <CheckboxGroup defaultValue={["read"]} name="permission">
          <Checkbox value="read">查看</Checkbox>
          <Checkbox value="export">导出</Checkbox>
          <Checkbox value="archive">归档</Checkbox>
        </CheckboxGroup>
      </Field>
      <Field errorText="请至少选择一个通知渠道" label="通知渠道" required>
        <CheckboxGroup name="channels">
          <Checkbox value="email">邮件通知</Checkbox>
          <Checkbox value="sms">短信通知</Checkbox>
        </CheckboxGroup>
      </Field>
    </form>
  )
};

export const WithSelect: Story = {
  name: "组合 Select",
  render: () => (
    <form style={formStyles}>
      <Field helpText="支持方向键、Enter、Escape、Home、End 和首字母定位。" label="项目状态" required>
        <Select
          name="status"
          options={[
            { label: "待处理", textValue: "pending", value: "pending" },
            { label: "处理中", textValue: "processing", value: "processing" },
            { label: "已完成", textValue: "done", value: "done" }
          ]}
          placeholder="请选择状态"
        />
      </Field>
      <Field errorText="请选择客户范围" label="客户范围" required>
        <Select
          name="scope"
          options={[
            { label: "我的客户", textValue: "owner", value: "owner" },
            { label: "团队客户", textValue: "team", value: "team" }
          ]}
          placeholder="请选择范围"
        />
      </Field>
    </form>
  )
};
