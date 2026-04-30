import { createRef } from "react";
import type { FormEvent } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { IconButton } from "./IconButton";

describe("IconButton", () => {
  const icon = <span>+</span>;

  it("renders a native button with default type and accessible name", () => {
    render(<IconButton aria-label="新建" icon={icon} />);

    const button = screen.getByRole("button", { name: "新建" });
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("type", "button");
  });

  it("supports aria-labelledby as the accessible name source", () => {
    render(
      <>
        <span id="refresh-label">刷新列表</span>
        <IconButton aria-labelledby="refresh-label" icon={icon} />
      </>
    );

    expect(screen.getByRole("button", { name: "刷新列表" })).toBeInTheDocument();
  });

  it("forwards refs to the button element", () => {
    const ref = createRef<HTMLButtonElement>();

    render(<IconButton aria-label="聚焦" icon={icon} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("respects variant and size state markers", () => {
    render(<IconButton aria-label="筛选" icon={icon} size="sm" variant="outline" />);

    const button = screen.getByRole("button", { name: "筛选" });
    expect(button).toHaveAttribute("data-variant", "outline");
    expect(button).toHaveAttribute("data-size", "sm");
  });

  it("prevents interaction when disabled", () => {
    const handleClick = vi.fn();

    render(<IconButton aria-label="删除" disabled icon={icon} onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button", { name: "删除" }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("uses disabled semantics while loading", () => {
    const handleClick = vi.fn();

    render(<IconButton aria-label="保存" icon={icon} loading onClick={handleClick} />);

    const button = screen.getByRole("button", { name: "保存" });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("data-loading", "");
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("works as a submit button inside forms", () => {
    const handleSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault());

    render(
      <form onSubmit={handleSubmit}>
        <IconButton aria-label="提交表单" icon={icon} type="submit" />
      </form>
    );

    fireEvent.click(screen.getByRole("button", { name: "提交表单" }));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
