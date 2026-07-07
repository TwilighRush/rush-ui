import { Pagination } from "@rush_ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";
import { useState } from "react";

const storyStackStyles = {
  display: "grid",
  gap: "16px",
  maxWidth: "720px"
} satisfies CSSProperties;

const storyPanelStyles = {
  border: "1px solid var(--rui-color-border)",
  borderRadius: "var(--rui-radius-sm)",
  display: "grid",
  gap: "12px",
  padding: "16px"
} satisfies CSSProperties;

const componentDescription = `
Pagination 用于表格、列表和搜索结果底部的页码导航。v1 聚焦页码切换、总数说明、加载和错误状态，不包含 pageSize 切换器，避免和 Select 的职责重叠。

可访问性说明：
- 根节点使用 nav，并提供默认 aria-label="分页"；当前页按钮设置 aria-current="page"。
- 每个分页项都是原生 button，Enter 和 Space 使用浏览器默认激活行为。
- 支持 ArrowLeft、ArrowRight、Home、End 在可用分页按钮之间移动焦点，不会直接切换页码。
- loading 会设置 aria-busy 并禁用分页按钮；errorText 使用 role="alert" 并关联到 nav。
`;

function ControlledPaginationStory() {
  const [page, setPage] = useState(3);

  return (
    <div style={storyStackStyles}>
      <Pagination onPageChange={setPage} page={page} showTotal total={128} />
      <p style={{ margin: 0 }}>当前页：{page}</p>
    </div>
  );
}

const meta = {
  title: "组件/导航/Pagination",
  component: Pagination,
  args: {
    total: 128,
    pageSize: 10,
    defaultPage: 3,
    siblingCount: 1,
    boundaryCount: 1,
    showTotal: true,
    size: "md",
    disabled: false,
    loading: false
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
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  name: "交互预览"
};

export const Controlled: Story = {
  name: "受控页码",
  render: () => <ControlledPaginationStory />
};

export const Sizes: Story = {
  name: "尺寸",
  render: () => (
    <div style={storyStackStyles}>
      <Pagination aria-label="小尺寸分页" defaultPage={2} size="sm" total={68} />
      <Pagination aria-label="中尺寸分页" defaultPage={4} size="md" total={128} />
      <Pagination aria-label="大尺寸分页" defaultPage={7} size="lg" total={280} />
    </div>
  )
};

export const States: Story = {
  name: "状态",
  render: () => (
    <div style={storyStackStyles}>
      <div style={storyPanelStyles}>
        <strong>加载中</strong>
        <Pagination defaultPage={4} loading loadingText="成员列表刷新中" showTotal total={128} />
      </div>
      <div style={storyPanelStyles}>
        <strong>错误提示</strong>
        <Pagination defaultPage={4} errorText="当前页加载失败，请重试或返回上一页。" showTotal total={128} />
      </div>
      <div style={storyPanelStyles}>
        <strong>空结果</strong>
        <Pagination showTotal total={0} />
      </div>
    </div>
  )
};

export const DenseList: Story = {
  name: "密集列表",
  render: () => <Pagination defaultPage={18} pageSize={20} showTotal size="sm" total={960} />
};

export const CustomTotal: Story = {
  name: "自定义总数",
  render: () => (
    <Pagination
      defaultPage={6}
      showTotal={({ end, page, pageCount, start, total }) => `当前第 ${page}/${pageCount} 页，展示 ${start}-${end} 条，共 ${total} 条客户`}
      total={236}
    />
  )
};
