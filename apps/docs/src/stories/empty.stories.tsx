import { Button, Empty } from "@rush_ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";

const componentDescription = `
Empty 用于展示区域内没有可用内容的状态，例如表格无数据、搜索无结果、首次创建和配置缺失。组件默认不接管焦点，也不内置业务动作；需要操作时通过 actions 放入 Button 或链接。

可访问性说明：
- 默认渲染非交互 div，不设置 role="status" 或 aria-live，避免静态空态被误当作动态播报。
- 默认图标作为装饰内容处理，空态含义应由 title 和 description 表达。
- actions 中的按钮或链接保留自身语义，键盘用户可以直接 Tab 到这些操作。
`;

const panelStyles = {
  background: "var(--rui-color-surface)",
  border: "1px solid var(--rui-color-border)",
  borderRadius: "8px"
} satisfies CSSProperties;

const tableStyles = {
  borderCollapse: "collapse",
  width: "100%"
} satisfies CSSProperties;

const cellStyles = {
  borderBottom: "1px solid var(--rui-color-border)",
  color: "var(--rui-color-ink)",
  padding: "12px",
  textAlign: "left"
} satisfies CSSProperties;

const customIcon = (
  <span
    style={{
      alignItems: "center",
      border: "1px solid currentColor",
      borderRadius: "999px",
      display: "inline-flex",
      fontSize: "1rem",
      fontWeight: 700,
      height: "1.75rem",
      justifyContent: "center",
      width: "1.75rem"
    }}
  >
    0
  </span>
);

const meta = {
  title: "组件/反馈/Empty",
  component: Empty,
  args: {
    description: "调整筛选条件或创建第一条记录后，这里会展示对应数据。",
    size: "md",
    title: "暂无数据"
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
} satisfies Meta<typeof Empty>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "交互预览"
};

export const SearchNoResults: Story = {
  name: "搜索无结果",
  render: () => (
    <div style={panelStyles}>
      <Empty
        actions={
          <>
            <Button variant="outline">清空筛选</Button>
            <Button>新建成员</Button>
          </>
        }
        description="没有成员匹配当前关键词和状态筛选，可以清空条件后重新查看全部成员。"
        title="未找到匹配结果"
      />
    </div>
  )
};

export const TableEmpty: Story = {
  name: "表格空态",
  render: () => (
    <div style={panelStyles}>
      <table aria-label="成员列表" style={tableStyles}>
        <thead>
          <tr>
            <th style={cellStyles}>成员</th>
            <th style={cellStyles}>角色</th>
            <th style={cellStyles}>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3} style={{ padding: 0 }}>
              <Empty description="当前工作区还没有成员。" size="sm" title="暂无成员" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
};

export const FirstCreate: Story = {
  name: "首次创建",
  render: () => (
    <div style={panelStyles}>
      <Empty
        actions={
          <>
            <Button>新建项目</Button>
            <Button variant="ghost">导入模板</Button>
          </>
        }
        description="创建第一个项目后，可以在这里跟踪成员、权限和审批状态。"
        size="lg"
        title="还没有项目"
      />
    </div>
  )
};

export const CustomIcon: Story = {
  name: "自定义图标",
  render: () => (
    <div style={panelStyles}>
      <Empty
        actions={<Button variant="outline">前往配置</Button>}
        description="开启客户字段映射后，导入任务会自动生成字段校验结果。"
        icon={customIcon}
        title="字段映射未配置"
      />
    </div>
  )
};

export const WithoutIcon: Story = {
  name: "无图标紧凑空态",
  render: () => (
    <div style={panelStyles}>
      <Empty description="当前筛选条件没有可显示的审批记录。" icon={null} size="sm" title="暂无审批记录" />
    </div>
  )
};

export const LongContent: Story = {
  name: "长文本换行",
  render: () => (
    <div style={{ ...panelStyles, maxWidth: 420 }}>
      <Empty
        description="当前组织范围内没有找到满足“华东区域、直营渠道、最近三十天产生风险事件且仍处于待复核状态”的成员记录。"
        title="没有符合条件的风险成员记录"
      />
    </div>
  )
};
