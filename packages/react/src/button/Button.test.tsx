import { createRef } from "react";
import type { FormEvent } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("renders a native button with default type", () => {
    render(<Button>保存</Button>);

    const button = screen.getByRole("button", { name: "保存" });
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("type", "button");
  });

  it("forwards refs to the button element", () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Button ref={ref}>聚焦</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toContain("聚焦");
  });

  it("respects variant and size state markers", () => {
    render(
      <Button size="lg" variant="outline">
        编辑
      </Button>
    );

    const button = screen.getByRole("button", { name: "编辑" });
    expect(button).toHaveAttribute("data-variant", "outline");
    expect(button).toHaveAttribute("data-size", "lg");
  });

  it("renders start and end icons", () => {
    render(
      <Button endIcon={<span>→</span>} startIcon={<span>+</span>}>
        新建
      </Button>
    );

    const button = screen.getByRole("button", { name: "新建" });
    expect(button.textContent).toContain("+");
    expect(button.textContent).toContain("→");
  });

  it("prevents interaction when disabled", () => {
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        删除
      </Button>
    );

    fireEvent.click(screen.getByRole("button", { name: "删除" }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("uses disabled semantics and loading text while loading", () => {
    const handleClick = vi.fn();

    render(
      <Button loading loadingText="保存中" onClick={handleClick}>
        保存
      </Button>
    );

    const button = screen.getByRole("button", { name: "保存中" });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("data-loading", "");
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("passes through aria and data attributes", () => {
    render(
      <Button aria-controls="panel-1" data-track="confirm">
        确认
      </Button>
    );

    const button = screen.getByRole("button", { name: "确认" });
    expect(button).toHaveAttribute("aria-controls", "panel-1");
    expect(button).toHaveAttribute("data-track", "confirm");
  });

  it("works as a submit button inside forms", () => {
    const handleSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault());

    render(
      <form onSubmit={handleSubmit}>
        <Button type="submit">提交</Button>
      </form>
    );

    fireEvent.click(screen.getByRole("button", { name: "提交" }));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
