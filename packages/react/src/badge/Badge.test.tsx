import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders a status badge with default variant and size", () => {
    render(<Badge>默认</Badge>);

    const badge = screen.getByText("默认").closest(".rui-badge");

    expect(badge?.tagName).toBe("SPAN");
    expect(badge).toHaveAttribute("data-variant", "default");
    expect(badge).toHaveAttribute("data-size", "md");
  });

  it("forwards refs to the badge element", () => {
    const ref = createRef<HTMLSpanElement>();

    render(<Badge ref={ref}>成功</Badge>);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current?.textContent).toContain("成功");
  });

  it("respects variant and size state markers", () => {
    render(
      <Badge size="lg" variant="processing">
        处理中
      </Badge>
    );

    const badge = screen.getByText("处理中").closest(".rui-badge");
    expect(badge).toHaveAttribute("data-variant", "processing");
    expect(badge).toHaveAttribute("data-size", "lg");
  });

  it("supports every status variant", () => {
    const variants = ["default", "success", "warning", "error", "info", "processing"] as const;

    render(
      <div>
        {variants.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </div>
    );

    for (const variant of variants) {
      expect(screen.getByText(variant).closest(".rui-badge")).toHaveAttribute("data-variant", variant);
    }
  });

  it("passes className to the root and native attributes to the span", () => {
    render(
      <Badge aria-label="订单状态：成功" className="custom-badge" data-track="order-status" title="订单状态">
        成功
      </Badge>
    );

    const badge = screen.getByLabelText("订单状态：成功");
    expect(badge).toHaveClass("custom-badge");
    expect(badge).toHaveAttribute("data-track", "order-status");
    expect(badge).toHaveAttribute("title", "订单状态");
  });

  it("keeps the visual indicator decorative", () => {
    render(<Badge variant="warning">待确认</Badge>);

    const badge = screen.getByText("待确认").closest(".rui-badge");
    const indicator = badge?.querySelector(".rui-badge__indicator");

    expect(indicator).toHaveAttribute("aria-hidden", "true");
  });

  it("allows consumers to opt into explicit status semantics", () => {
    render(
      <Badge role="status" variant="info">
        已同步
      </Badge>
    );

    expect(screen.getByRole("status")).toHaveTextContent("已同步");
  });
});
