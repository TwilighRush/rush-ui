import { createRef } from "react";

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Dialog } from "../dialog";
import { IconButton } from "../icon-button";
import { Tooltip } from "./Tooltip";

function TooltipExample({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  return (
    <Tooltip.Root onOpenChange={onOpenChange}>
      <Tooltip.Trigger>
        <button type="button">刷新列表</button>
      </Tooltip.Trigger>
      <Tooltip.Content>重新获取最新成员数据</Tooltip.Content>
    </Tooltip.Root>
  );
}

describe("Tooltip", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("opens on focus and links the trigger with aria-describedby", () => {
    render(<TooltipExample />);
    const trigger = screen.getByRole("button", { name: "刷新列表" });

    fireEvent.focus(trigger);

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("重新获取最新成员数据");
    expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
  });

  it("opens and closes with pointer delays", () => {
    vi.useFakeTimers();
    render(<TooltipExample />);
    const trigger = screen.getByRole("button", { name: "刷新列表" });

    fireEvent.pointerEnter(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(499));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.pointerLeave(trigger);
    act(() => vi.advanceTimersByTime(119));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("keeps the tooltip open while the pointer moves over content", () => {
    vi.useFakeTimers();
    render(
      <Tooltip.Root closeDelay={100} openDelay={0}>
        <Tooltip.Trigger>
          <button type="button">说明</button>
        </Tooltip.Trigger>
        <Tooltip.Content>补充说明</Tooltip.Content>
      </Tooltip.Root>
    );
    const trigger = screen.getByRole("button", { name: "说明" });

    fireEvent.pointerEnter(trigger);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.pointerLeave(trigger);
    fireEvent.pointerEnter(screen.getByRole("tooltip"));
    act(() => vi.advanceTimersByTime(100));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.pointerLeave(screen.getByRole("tooltip"));
    act(() => vi.advanceTimersByTime(100));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("keeps the tooltip open while the trigger still has focus", () => {
    vi.useFakeTimers();
    render(<TooltipExample />);
    const trigger = screen.getByRole("button", { name: "刷新列表" });

    fireEvent.focus(trigger);
    fireEvent.pointerLeave(trigger);
    act(() => vi.advanceTimersByTime(120));
    expect(screen.getByRole("tooltip")).toBeInTheDocument();

    fireEvent.blur(trigger);
    act(() => vi.advanceTimersByTime(120));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("dismisses on Escape", () => {
    render(
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger>
          <button type="button">刷新列表</button>
        </Tooltip.Trigger>
        <Tooltip.Content>重新获取最新成员数据</Tooltip.Content>
      </Tooltip.Root>
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("respects controlled open state", () => {
    const handleChange = vi.fn();
    render(
      <Tooltip.Root onOpenChange={handleChange} open={false}>
        <Tooltip.Trigger>
          <button type="button">刷新列表</button>
        </Tooltip.Trigger>
        <Tooltip.Content>重新获取最新成员数据</Tooltip.Content>
      </Tooltip.Root>
    );

    fireEvent.focus(screen.getByRole("button", { name: "刷新列表" }));
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("does not open when disabled", () => {
    vi.useFakeTimers();
    const handleChange = vi.fn();
    render(
      <Tooltip.Root disabled onOpenChange={handleChange} openDelay={0}>
        <Tooltip.Trigger>
          <button type="button">刷新列表</button>
        </Tooltip.Trigger>
        <Tooltip.Content>重新获取最新成员数据</Tooltip.Content>
      </Tooltip.Root>
    );
    const trigger = screen.getByRole("button", { name: "刷新列表" });

    fireEvent.focus(trigger);
    fireEvent.pointerEnter(trigger);
    act(() => vi.runAllTimers());

    expect(handleChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(trigger).not.toHaveAttribute("aria-describedby");
  });

  it("forwards refs and merges trigger/content className", () => {
    const triggerRef = createRef<HTMLButtonElement>();
    const tooltipTriggerRef = createRef<HTMLElement>();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger className="custom-trigger" ref={tooltipTriggerRef}>
          <IconButton aria-label="刷新列表" icon={<span>R</span>} ref={triggerRef} />
        </Tooltip.Trigger>
        <Tooltip.Content className="custom-tooltip" ref={contentRef}>
          重新获取最新成员数据
        </Tooltip.Content>
      </Tooltip.Root>
    );

    expect(triggerRef.current).toHaveClass("rui-tooltip__trigger");
    expect(triggerRef.current).toHaveClass("custom-trigger");
    expect(tooltipTriggerRef.current).toBe(triggerRef.current);
    expect(contentRef.current).toHaveClass("custom-tooltip");
  });

  it("renders above a dialog layer when nested in Dialog", async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Trigger>打开</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>编辑成员</Dialog.Title>
          <Tooltip.Root defaultOpen>
            <Tooltip.Trigger>
              <button type="button">字段说明</button>
            </Tooltip.Trigger>
            <Tooltip.Content>该字段会展示在成员列表中。</Tooltip.Content>
          </Tooltip.Root>
        </Dialog.Content>
      </Dialog.Root>
    );

    await waitFor(() => expect(screen.getByRole("tooltip").style.zIndex).toBe("calc(var(--rui-z-modal, 410) + 1)"));
  });
});
