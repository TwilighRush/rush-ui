import { createRef, useRef } from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Popover } from "../popover";
import { Select } from "../select";
import { Dialog } from "./Dialog";

function DialogExample({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  return (
    <Dialog.Root onOpenChange={onOpenChange}>
      <Dialog.Trigger>编辑成员</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>编辑成员</Dialog.Title>
        <Dialog.Description>更新成员角色与访问范围。</Dialog.Description>
        <input aria-label="成员名称" />
        <Dialog.Close>取消</Dialog.Close>
        <button type="button">保存</button>
      </Dialog.Content>
    </Dialog.Root>
  );
}

describe("Dialog", () => {
  it("opens with accessible title, description and initial focus", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<DialogExample onOpenChange={handleChange} />);

    await user.click(screen.getByRole("button", { name: "编辑成员" }));
    const dialog = screen.getByRole("dialog", { name: "编辑成员" });
    expect(dialog).toHaveAccessibleDescription("更新成员角色与访问范围。");
    expect(document.body.style.overflow).toBe("hidden");
    expect(handleChange).toHaveBeenCalledWith(true);
    await waitFor(() => expect(screen.getByRole("textbox", { name: "成员名称" })).toHaveFocus());
  });

  it("supports an explicit initial focus target", async () => {
    function Example() {
      const targetRef = useRef<HTMLButtonElement>(null);
      return (
        <Dialog.Root defaultOpen>
          <Dialog.Trigger>打开</Dialog.Trigger>
          <Dialog.Content initialFocusRef={targetRef}>
            <Dialog.Title>确认</Dialog.Title>
            <button type="button">返回</button>
            <button ref={targetRef} type="button">继续</button>
          </Dialog.Content>
        </Dialog.Root>
      );
    }
    render(<Example />);
    await waitFor(() => expect(screen.getByRole("button", { name: "继续" })).toHaveFocus());
  });

  it("closes with Escape and restores the previous focus", async () => {
    const user = userEvent.setup();
    render(<DialogExample />);
    const trigger = screen.getByRole("button", { name: "编辑成员" });
    trigger.focus();
    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(document.body.style.overflow).toBe("");
  });

  it("closes from the close button and configurable backdrop", async () => {
    const user = userEvent.setup();
    render(<DialogExample />);
    const trigger = screen.getByRole("button", { name: "编辑成员" });

    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "取消" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(trigger);
    fireEvent.mouseDown(screen.getByRole("dialog").parentElement as HTMLElement);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps a locked backdrop open", () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>打开</Dialog.Trigger>
        <Dialog.Content closeOnBackdropClick={false} aria-label="处理中">内容</Dialog.Content>
      </Dialog.Root>
    );
    fireEvent.mouseDown(screen.getByRole("dialog").parentElement as HTMLElement);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("traps Tab and programmatic focus inside the dialog", async () => {
    const user = userEvent.setup();
    render(
      <>
        <DialogExample />
        <button type="button">外部按钮</button>
      </>
    );
    await user.click(screen.getByRole("button", { name: "编辑成员" }));
    const input = screen.getByRole("textbox", { name: "成员名称" });
    const save = screen.getByRole("button", { name: "保存" });
    save.focus();
    await user.tab();
    expect(input).toHaveFocus();

    screen.getByRole("button", { name: "外部按钮", hidden: true }).focus();
    expect(input).toHaveFocus();
  });

  it("marks background content inert and restores it on close", async () => {
    const user = userEvent.setup();
    const { container } = render(<DialogExample />);
    const trigger = screen.getByRole("button", { name: "编辑成员" });
    await user.click(trigger);
    expect(container).toHaveAttribute("inert");
    expect(container).toHaveAttribute("aria-hidden", "true");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(container).not.toHaveAttribute("inert"));
    expect(container).not.toHaveAttribute("aria-hidden");
  });

  it("supports controlled state without rendering stale content", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Dialog.Root open={false} onOpenChange={handleChange}>
        <Dialog.Trigger>打开</Dialog.Trigger>
        <Dialog.Content aria-label="受控弹窗">内容</Dialog.Content>
      </Dialog.Root>
    );
    await user.click(screen.getByRole("button", { name: "打开" }));
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("forwards refs and className", () => {
    const contentRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Trigger ref={triggerRef}>打开</Dialog.Trigger>
        <Dialog.Content className="custom-dialog" ref={contentRef} aria-label="标题">内容</Dialog.Content>
      </Dialog.Root>
    );
    expect(contentRef.current).toHaveClass("custom-dialog");
    expect(triggerRef.current).toHaveClass("rui-dialog__trigger");
  });

  it("allows a nested popover branch and lets Escape close only the top layer", async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>打开</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>编辑成员</Dialog.Title>
          <Popover.Root defaultOpen>
            <Popover.Trigger>筛选</Popover.Trigger>
            <Popover.Content aria-label="筛选条件"><button type="button">应用</button></Popover.Content>
          </Popover.Root>
        </Dialog.Content>
      </Dialog.Root>
    );

    await waitFor(() => expect(screen.getByRole("button", { name: "应用" })).toHaveFocus());
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "筛选条件" })).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "编辑成员" })).toBeInTheDocument();
  });

  it("renders a nested Select popup above the modal layer", () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>打开</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>编辑成员</Dialog.Title>
          <Select
            aria-label="成员角色"
            options={[
              { label: "管理员", value: "admin" },
              { label: "编辑者", value: "editor" }
            ]}
          />
        </Dialog.Content>
      </Dialog.Root>
    );

    const select = screen.getByRole("combobox", { name: "成员角色" });
    fireEvent.click(select);

    const popup = screen.getByRole("listbox").parentElement as HTMLElement;
    expect(popup).toHaveClass("rui-select__popup");
    expect(popup.style.zIndex).toBe("calc(var(--rui-z-modal, 410) + 1)");

    fireEvent.click(screen.getByRole("option", { name: "编辑者" }));
    expect(select).toHaveTextContent("编辑者");
  });

  it("derives nested popup z-index from a custom dialog z-index", () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>打开</Dialog.Trigger>
        <Dialog.Content style={{ zIndex: 900 }}>
          <Dialog.Title>编辑成员</Dialog.Title>
          <Select
            aria-label="成员角色"
            options={[
              { label: "管理员", value: "admin" },
              { label: "编辑者", value: "editor" }
            ]}
          />
        </Dialog.Content>
      </Dialog.Root>
    );

    fireEvent.click(screen.getByRole("combobox", { name: "成员角色" }));

    expect((screen.getByRole("listbox").parentElement as HTMLElement).style.zIndex).toBe("901");
  });

  it("lets a nested Select handle Escape without closing the dialog", () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>打开</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>编辑成员</Dialog.Title>
          <Select
            aria-label="成员角色"
            options={[
              { label: "管理员", value: "admin" },
              { label: "编辑者", value: "editor" }
            ]}
          />
        </Dialog.Content>
      </Dialog.Root>
    );

    const select = screen.getByRole("combobox", { name: "成员角色" });
    fireEvent.click(select);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(select, { key: "Escape" });

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "编辑成员" })).toBeInTheDocument();
  });
});
