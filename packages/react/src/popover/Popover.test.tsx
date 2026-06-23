import { createRef } from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Dialog } from "../dialog";
import { DropdownMenu } from "../dropdown-menu";
import { Select } from "../select";
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

  it("renders a nested Select popup above the popover layer", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>筛选</Popover.Trigger>
        <Popover.Content aria-label="筛选条件">
          <Select
            aria-label="成员状态"
            options={[
              { label: "启用", value: "active" },
              { label: "停用", value: "disabled" }
            ]}
          />
        </Popover.Content>
      </Popover.Root>
    );

    const select = screen.getByRole("combobox", { name: "成员状态" });
    await user.click(select);

    const popup = screen.getByRole("listbox").parentElement as HTMLElement;
    expect(popup).toHaveClass("rui-select__popup");
    expect(popup.style.zIndex).toBe("calc(var(--rui-z-popover, 300) + 1)");

    await user.click(screen.getByRole("option", { name: "停用" }));
    expect(select).toHaveTextContent("停用");
    expect(screen.getByRole("dialog", { name: "筛选条件" })).toBeInTheDocument();
  });

  it("derives nested popup z-index from a custom popover z-index", async () => {
    const user = userEvent.setup();
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>筛选</Popover.Trigger>
        <Popover.Content aria-label="筛选条件" style={{ zIndex: 700 }}>
          <Select
            aria-label="成员状态"
            options={[
              { label: "启用", value: "active" },
              { label: "停用", value: "disabled" }
            ]}
          />
        </Popover.Content>
      </Popover.Root>
    );

    await user.click(screen.getByRole("combobox", { name: "成员状态" }));

    expect((screen.getByRole("listbox").parentElement as HTMLElement).style.zIndex).toBe("701");
  });

  it("keeps nested Select above a popover that is opened inside Dialog", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>打开</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>编辑成员</Dialog.Title>
          <Popover.Root defaultOpen>
            <Popover.Trigger>筛选</Popover.Trigger>
            <Popover.Content aria-label="筛选条件">
              <Select
                aria-label="成员状态"
                options={[
                  { label: "启用", value: "active" },
                  { label: "停用", value: "disabled" }
                ]}
              />
            </Popover.Content>
          </Popover.Root>
        </Dialog.Content>
      </Dialog.Root>
    );

    const select = screen.getByRole("combobox", { name: "成员状态" });
    await user.click(select);

    const popup = screen.getByRole("listbox").parentElement as HTMLElement;
    expect(popup.style.zIndex).toBe("calc(calc(var(--rui-z-modal, 410) + 1) + 1)");
  });

  it("keeps a nested DropdownMenu focusable inside a Popover that is opened inside Dialog", async () => {
    const user = userEvent.setup();
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>打开</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>编辑成员</Dialog.Title>
          <Popover.Root defaultOpen>
            <Popover.Trigger>筛选</Popover.Trigger>
            <Popover.Content aria-label="筛选条件">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>更多操作</DropdownMenu.Trigger>
                <DropdownMenu.Content aria-label="筛选操作">
                  <DropdownMenu.Item>保存筛选</DropdownMenu.Item>
                  <DropdownMenu.Item>清空筛选</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Popover.Content>
          </Popover.Root>
        </Dialog.Content>
      </Dialog.Root>
    );

    await user.click(screen.getByRole("button", { name: "更多操作" }));

    const menu = screen.getByRole("menu", { name: "筛选操作" });
    expect(menu.style.zIndex).toBe("calc(calc(var(--rui-z-modal, 410) + 1) + 1)");
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "保存筛选" })).toHaveFocus());
    expect(screen.getByRole("dialog", { name: "编辑成员" })).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "筛选条件" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu", { name: "筛选操作" })).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "编辑成员" })).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "筛选条件" })).toBeInTheDocument();
  });
});
