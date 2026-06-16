import { Button, IconButton, Input } from "@rush-ui/react";
import { tokens } from "@rush-ui/tokens";

const packageRoles = [
  {
    name: "@rush-ui/react",
    description: "对外发布的 React 组件入口，承载组件、类型和组合约定。"
  },
  {
    name: "@rush-ui/tokens",
    description: "可序列化的设计 token，覆盖颜色、间距、圆角和阴影。"
  },
  {
    name: "@rush-ui/utils",
    description: "跨包共享的通用工具函数，不绑定具体框架。"
  }
] as const;

export function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Rush UI</p>
        <h1>面向后台系统的 React 组件库基础工程</h1>
        <p className="lede">
          这个工作区已经接入组件包构建、Storybook 预览、自动化测试和 Changesets 版本管理。
        </p>
      </section>

      <section className="grid">
        {packageRoles.map((item) => (
          <article className="info-card" key={item.name}>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </section>

      <section className="token-card">
        <h2>基础设计 token</h2>
        <div className="swatches">
          {Object.entries(tokens.color).map(([name, value]) => (
            <div className="swatch" key={name}>
              <span className="chip" style={{ backgroundColor: value }} />
              <div>
                <strong>{name}</strong>
                <p>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="token-card">
        <h2>Button 文档示例</h2>
        <p className="lede">
          Button 已接入 RFC 约定，支持 variant、size、disabled、loading，以及前后图标插槽。
        </p>
        <div className="button-demo-row">
          <Button>默认按钮</Button>
          <Button variant="outline">次要操作</Button>
          <Button startIcon={<span>+</span>} variant="subtle">
            新建项目
          </Button>
          <Button endIcon={<span>→</span>} loading loadingText="保存中">
            保存变更
          </Button>
          <Button disabled variant="ghost">
            不可用
          </Button>
        </div>
      </section>

      <section className="token-card">
        <h2>IconButton 文档示例</h2>
        <p className="lede">纯图标操作需要通过 aria-label 或 aria-labelledby 提供稳定的可访问名称。</p>
        <div className="button-demo-row">
          <IconButton aria-label="新建记录" icon={<span>+</span>} variant="solid" />
          <IconButton aria-label="刷新列表" icon={<span>↻</span>} variant="outline" />
          <IconButton aria-label="更多操作" icon={<span>⋯</span>} />
          <IconButton aria-label="关闭面板" icon={<span>×</span>} loading variant="subtle" />
        </div>
      </section>

      <section className="token-card">
        <h2>Input 文档示例</h2>
        <p className="lede">单行输入框支持受控/非受控、禁用、只读、错误态、清空按钮、字数统计、图标和前后缀。</p>
        <div className="input-demo-grid">
          <Input allowClear aria-label="项目名称" defaultValue="客户运营后台" maxLength={20} showCount />
          <Input aria-label="金额" endAddon="CNY" placeholder="0.00" startAddon="¥" />
          <Input allowClear aria-label="邮箱" errorText="请输入有效邮箱" invalid placeholder="name@example.com" suffix="@" />
        </div>
      </section>
    </main>
  );
}
