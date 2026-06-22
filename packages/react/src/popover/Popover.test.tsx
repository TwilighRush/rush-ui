import { createRef } from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Popover } from "./Popover";

function PopoverExample({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  return (
    <div>
      <button type="button">上一个按钮</button>
      <Popover.Root onOpenChange={onOpenChange}>
        <Popover.Trigger>筛选条件</Popover.Trigger>
        <Popover.Content aria-label="筛选条件面板">
          <input aria-label="关键字" />
          <button type="button">应用</button>
        </Popover.Content>
      </Popover.Root>
      <button type="button">下一个按钮</button>
    </div>
  );
}

describe("Popover", () => {
  it("toggles from the trigger and moves focus into content", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PopoverExample onOpenChange={handleChange} />);
    const trigger = screen.getByRole("button", { name: "筛选条件" });

    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "筛选条件面板" })).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(handleChange).toHaveBeenCalledWith(true);
    await waitFor(() => expect(screen.getByRole("textbox", { name: "关键字" })).toHaveFocus());

    await user.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("dismisses on outside pointer and Escape", async () => {
    const user = userEvent.setup();
    render(<PopoverExample />);
    const trigger = screen.getByRole("button", { name: "筛选条件" });

    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "下一个按钮" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole("textbox", { name: "关键字" })).toHaveFocus());
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("continues Tab order relative to the trigger", async () => {
    const user = userEvent.setup();
    render(<PopoverExample />);
    const trigger = screen.getByRole("button", { name: "筛选条件" });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole("textbox", { name: "关键字" })).toHaveFocus());
    const apply = screen.getByRole("button", { name: "应用" });
    apply.focus();
    await user.tab();
    await waitFor(() => expect(screen.getByRole("button", { name: "下一个按钮" })).toHaveFocus());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole("textbox", { name: "关键字" })).toHaveFocus());
    await user.tab({ shift: true });
    expect(trigger).toHaveFocus();
  });

  it("respects controlled open state", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Popover.Root open={false} onOpenChange={handleChange}>
        <Popover.Trigger>筛选条件</Popover.Trigger>
        <Popover.Content aria-label="筛选条件面板">内容</Popover.Content>
      </Popover.Root>
    );
    await user.click(screen.getByRole("button"));
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("forwards trigger and content refs with className", async () => {
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger ref={triggerRef}>打开</Popover.Trigger>
        <Popover.Content aria-label="内容" className="custom-popover" ref={contentRef}>内容</Popover.Content>
      </Popover.Root>
    );
    expect(triggerRef.current).toHaveClass("rui-popover__trigger");
    expect(contentRef.current).toHaveClass("custom-popover");
  });
});
