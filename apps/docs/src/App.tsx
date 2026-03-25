import { Button } from "@rush-ui/react";
import { tokens } from "@rush-ui/tokens";

const packageRoles = [
  {
    name: "@rush-ui/react",
    description: "Public React entry point for future components, types, and composition helpers."
  },
  {
    name: "@rush-ui/tokens",
    description: "Serializable design tokens for color, spacing, radius, and elevation."
  },
  {
    name: "@rush-ui/utils",
    description: "Framework-agnostic utilities that can be shared across packages."
  }
] as const;

export function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Rush UI</p>
        <h1>React component library monorepo foundation</h1>
        <p className="lede">
          This workspace is ready for package development, Storybook previews, automated testing, and versioning with
          Changesets.
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
        <h2>Foundation tokens</h2>
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
        <h2>Button docs example</h2>
        <p className="lede">
          首版 Button 已接入 RFC 约定，支持 variant、size、disabled、loading，以及前后图标插槽。
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
    </main>
  );
}
