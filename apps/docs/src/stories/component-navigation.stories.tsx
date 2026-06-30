import type { Meta, StoryObj } from "@storybook/react";
import type { CSSProperties } from "react";

const pageStyles = {
  color: "var(--rui-color-ink)",
  display: "grid",
  gap: "24px",
  margin: "0 auto",
  maxWidth: "960px",
  padding: "40px 24px"
} satisfies CSSProperties;

const gridStyles = {
  display: "grid",
  gap: "16px",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
} satisfies CSSProperties;

const cardStyles = {
  background: "var(--rui-color-surface)",
  border: "1px solid var(--rui-color-border)",
  borderRadius: "8px",
  display: "grid",
  gap: "10px",
  padding: "16px"
} satisfies CSSProperties;

const componentListStyles = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  listStyle: "none",
  margin: 0,
  padding: 0
} satisfies CSSProperties;

const componentItemStyles = {
  background: "var(--rui-color-canvas)",
  border: "1px solid var(--rui-color-border)",
  borderRadius: "999px",
  color: "var(--rui-color-ink)",
  fontSize: "0.875rem",
  lineHeight: 1,
  padding: "6px 10px"
} satisfies CSSProperties;

const categories = [
  {
    name: "基础",
    description: "承载页面、工具栏和业务流程里的通用操作入口。",
    components: ["Button", "IconButton"]
  },
  {
    name: "表单",
    description: "覆盖输入、选择、校验提示和表单项组合。",
    components: ["Field", "Input", "Textarea", "Checkbox", "Radio", "Select", "Switch"]
  },
  {
    name: "导航",
    description: "组织并列内容和对象级操作入口。",
    components: ["Tabs", "DropdownMenu"]
  },
  {
    name: "反馈",
    description: "处理区域内提示、需要聚焦的短流程与轻量上下文内容。",
    components: ["Alert", "Dialog", "Empty", "Popover", "Tooltip"]
  },
  {
    name: "数据展示",
    description: "用于展示对象状态、列表状态和轻量信息标识。",
    components: ["Badge"]
  }
] as const;

const meta = {
  title: "组件",
  parameters: {
    docs: {
      description: {
        component: "Rush UI 组件文档按基础、表单、反馈、数据展示四类组织，便于在组件数量增长后快速定位。"
      }
    }
  }
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  name: "概览",
  render: () => (
    <main style={pageStyles}>
      <header>
        <p style={{ color: "var(--rui-color-accent)", fontWeight: 700, margin: "0 0 8px" }}>Rush UI 组件</p>
        <h1 style={{ fontSize: "2rem", lineHeight: 1.2, margin: 0 }}>组件文档分类</h1>
        <p style={{ color: "var(--rui-color-ink-muted)", fontSize: "1rem", lineHeight: 1.7, margin: "12px 0 0" }}>
          侧栏以组件用途为主线组织：基础组件优先展示操作入口，表单组件集中管理输入控件，反馈与数据展示为后续扩展保留稳定位置。
        </p>
      </header>

      <section aria-label="组件分类" style={gridStyles}>
        {categories.map((category) => (
          <article key={category.name} style={cardStyles}>
            <div>
              <h2 style={{ fontSize: "1.125rem", lineHeight: 1.3, margin: 0 }}>{category.name}</h2>
              <p style={{ color: "var(--rui-color-ink-muted)", lineHeight: 1.6, margin: "8px 0 0" }}>{category.description}</p>
            </div>
            <ul aria-label={`${category.name}组件`} style={componentListStyles}>
              {category.components.map((component) => (
                <li key={component} style={componentItemStyles}>
                  {component}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  )
};
