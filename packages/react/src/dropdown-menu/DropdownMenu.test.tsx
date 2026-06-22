import { createRef } from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DropdownMenu } from "./DropdownMenu";

function MenuExample({ onSelect }: { onSelect?: () => void }) {
  return (
    <>
      <button type="button">上一个按钮</button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>更多操作</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>记录操作</DropdownMenu.Label>
          <DropdownMenu.Item onSelect={onSelect} textValue="edit member">编辑成员</DropdownMenu.Item>
          <DropdownMenu.Item disabled textValue="archive member">归档成员</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item textValue="reset password">重置密码</DropdownMenu.Item>
          <DropdownMenu.Item textValue="remove member">移除成员</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <button type="button">下一个按钮</button>
    </>
  );
}

describe("DropdownMenu", () => {
  it("opens from click and uses the trigger as its accessible name", async () => {
    const user = userEvent.setup();
    render(<MenuExample />);
    await user.click(screen.getByRole("button", { name: "更多操作" }));
    expect(screen.getByRole("menu", { name: "更多操作" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "编辑成员" })).toHaveFocus());
  });

  it("supports Arrow, Home and End navigation including disabled items", async () => {
    render(<MenuExample />);
    fireEvent.keyDown(screen.getByRole("button", { name: "更多操作" }), { key: "ArrowDown" });
    const menu = screen.getByRole("menu");
    const edit = screen.getByRole("menuitem", { name: "编辑成员" });
    const archive = screen.getByRole("menuitem", { name: "归档成员" });
    const remove = screen.getByRole("menuitem", { name: "移除成员" });
    await waitFor(() => expect(edit).toHaveFocus());

    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(archive).toHaveFocus();
    expect(archive).toHaveAttribute("aria-disabled", "true");
    fireEvent.keyDown(menu, { key: "Home" });
    expect(edit).toHaveFocus();
    fireEvent.keyDown(menu, { key: "End" });
    expect(remove).toHaveFocus();
  });

  it("opens from ArrowUp at the last item and closes with Escape", async () => {
    render(<MenuExample />);
    const trigger = screen.getByRole("button", { name: "更多操作" });
    fireEvent.keyDown(trigger, { key: "ArrowUp" });
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "移除成员" })).toHaveFocus());
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("opens from Enter and Space", async () => {
    const user = userEvent.setup();
    render(<MenuExample />);
    const trigger = screen.getByRole("button", { name: "更多操作" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("menu")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    await user.keyboard(" ");
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("matches a buffered multi-character typeahead query", async () => {
    const user = userEvent.setup();
    render(<MenuExample />);
    await user.click(screen.getByRole("button", { name: "更多操作" }));
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "编辑成员" })).toHaveFocus());
    await user.keyboard("res");
    expect(screen.getByRole("menuitem", { name: "重置密码" })).toHaveFocus();
  });

  it("does not activate or close from a disabled item", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<MenuExample onSelect={handleSelect} />);
    await user.click(screen.getByRole("button", { name: "更多操作" }));
    await user.click(screen.getByRole("menuitem", { name: "归档成员" }));
    expect(handleSelect).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("selects an item, closes and restores trigger focus", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<MenuExample onSelect={handleSelect} />);
    const trigger = screen.getByRole("button", { name: "更多操作" });
    await user.click(trigger);
    await user.click(screen.getByRole("menuitem", { name: "编辑成员" }));

    expect(handleSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("allows onClick to prevent selection and closing", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>操作</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={(event) => event.preventDefault()} onSelect={handleSelect}>保留菜单</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
    await user.click(screen.getByRole("menuitem"));
    expect(handleSelect).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("continues Tab order relative to the trigger", async () => {
    const user = userEvent.setup();
    render(<MenuExample />);
    await user.click(screen.getByRole("button", { name: "更多操作" }));
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "编辑成员" })).toHaveFocus());
    await user.tab();
    await waitFor(() => expect(screen.getByRole("button", { name: "下一个按钮" })).toHaveFocus());
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("forwards refs and className", () => {
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLButtonElement>();
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger ref={triggerRef}>操作</DropdownMenu.Trigger>
        <DropdownMenu.Content className="custom-menu" ref={contentRef}>
          <DropdownMenu.Item ref={itemRef}>编辑</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
    expect(triggerRef.current).toHaveClass("rui-dropdown-menu__trigger");
    expect(contentRef.current).toHaveClass("custom-menu");
    expect(itemRef.current).toHaveAttribute("role", "menuitem");
  });
});
