import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders an info alert with status semantics by default", () => {
    render(<Alert title="同步完成">客户资料已更新。</Alert>);

    const alert = screen.getByRole("status");

    expect(alert).toHaveClass("rui-alert");
    expect(alert).toHaveAttribute("data-variant", "info");
    expect(alert).toHaveTextContent("同步完成");
    expect(alert).toHaveTextContent("客户资料已更新。");
  });

  it("uses assertive alert semantics for error variant by default", () => {
    render(
      <Alert title="保存失败" variant="error">
        请检查必填项后重试。
      </Alert>
    );

    expect(screen.getByRole("alert")).toHaveAttribute("data-variant", "error");
  });

  it("allows consumers to override the semantic role", () => {
    render(
      <Alert role="note" title="配置说明" variant="default">
        此规则只影响新增成员。
      </Alert>
    );

    expect(screen.getByRole("note")).toHaveTextContent("此规则只影响新增成员。");
  });

  it("supports every visual variant", () => {
    const variants = ["default", "success", "warning", "error", "info"] as const;

    render(
      <div>
        {variants.map((variant) => (
          <Alert key={variant} variant={variant}>
            {variant}
          </Alert>
        ))}
      </div>
    );

    for (const variant of variants) {
      expect(screen.getByText(variant).closest(".rui-alert")).toHaveAttribute("data-variant", variant);
    }
  });

  it("forwards refs to the alert root", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Alert ref={ref}>已保存筛选条件。</Alert>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.textContent).toContain("已保存筛选条件。");
  });

  it("passes className and native attributes to the root", () => {
    render(
      <Alert aria-label="成员导入提示" className="custom-alert" data-track="import-alert" id="import-alert" title="导入完成">
        已成功导入 24 位成员。
      </Alert>
    );

    const alert = screen.getByLabelText("成员导入提示");
    expect(alert).toHaveClass("custom-alert");
    expect(alert).toHaveAttribute("data-track", "import-alert");
    expect(alert).toHaveAttribute("id", "import-alert");
  });

  it("keeps the default icon decorative", () => {
    render(<Alert variant="warning">配额即将用尽。</Alert>);

    const alert = screen.getByRole("status");
    const icon = alert.querySelector(".rui-alert__icon");

    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveTextContent("!");
  });

  it("supports custom icons and action content", () => {
    render(
      <Alert
        actions={<button type="button">查看详情</button>}
        icon={<span data-testid="custom-icon">?</span>}
        title="存在重复记录"
        variant="warning"
      >
        请确认后再继续导入。
      </Alert>
    );

    expect(screen.getByTestId("custom-icon")).toHaveTextContent("?");
    expect(screen.getByRole("button", { name: "查看详情" })).toBeInTheDocument();
  });

  it("can hide the icon when icon is null", () => {
    render(<Alert icon={null}>仅显示文本内容。</Alert>);

    const alert = screen.getByRole("status");

    expect(alert).not.toHaveAttribute("data-has-icon");
    expect(alert.querySelector(".rui-alert__icon")).toBeNull();
  });
});
