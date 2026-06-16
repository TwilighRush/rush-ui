import { createRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders a native textarea", () => {
    render(<Textarea aria-label="备注" />);

    const textarea = screen.getByRole("textbox", { name: "备注" });
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("forwards refs to the textarea element", () => {
    const ref = createRef<HTMLTextAreaElement>();

    render(<Textarea aria-label="说明" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("supports uncontrolled value through defaultValue", () => {
    render(<Textarea aria-label="项目说明" defaultValue="控制台说明" />);

    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox", { name: "项目说明" });
    expect(textarea.value).toBe("控制台说明");

    fireEvent.change(textarea, { target: { value: "运营后台说明" } });
    expect(textarea.value).toBe("运营后台说明");
  });

  it("supports controlled value with onValueChange", () => {
    function ControlledTextarea() {
      const [value, setValue] = useState("控制台说明");

      return <Textarea aria-label="项目说明" onValueChange={setValue} value={value} />;
    }

    render(<ControlledTextarea />);

    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox", { name: "项目说明" });
    fireEvent.change(textarea, { target: { value: "运营后台说明" } });

    expect(textarea.value).toBe("运营后台说明");
  });

  it("calls native onChange and semantic onValueChange", () => {
    const handleChange = vi.fn();
    const handleValueChange = vi.fn();

    render(<Textarea aria-label="审批意见" onChange={handleChange} onValueChange={handleValueChange} />);

    fireEvent.change(screen.getByRole("textbox", { name: "审批意见" }), { target: { value: "同意" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleValueChange).toHaveBeenCalledWith("同意");
  });

  it("passes className to the root and native attributes to the textarea", () => {
    render(<Textarea aria-label="备注" className="custom-textarea" data-track="remark" name="remark" rows={6} />);

    const textarea = screen.getByRole("textbox", { name: "备注" });
    const root = textarea.closest(".rui-textarea");

    expect(root).toHaveClass("custom-textarea");
    expect(textarea).toHaveAttribute("data-track", "remark");
    expect(textarea).toHaveAttribute("name", "remark");
    expect(textarea).toHaveAttribute("rows", "6");
  });

  it("respects size and state markers", () => {
    render(<Textarea aria-label="备注" disabled invalid readOnly size="lg" />);

    const root = screen.getByRole("textbox", { name: "备注" }).closest(".rui-textarea");
    expect(root).toHaveAttribute("data-size", "lg");
    expect(root).toHaveAttribute("data-disabled", "");
    expect(root).toHaveAttribute("data-invalid", "");
    expect(root).toHaveAttribute("data-readonly", "");
  });

  it("uses disabled semantics", () => {
    render(<Textarea aria-label="备注" disabled />);

    expect(screen.getByRole("textbox", { name: "备注" })).toBeDisabled();
  });

  it("uses readonly semantics without disabling focus", () => {
    render(<Textarea aria-label="只读备注" readOnly />);

    const textarea = screen.getByRole("textbox", { name: "只读备注" });
    expect(textarea).toHaveAttribute("readonly");
    expect(textarea).not.toBeDisabled();
  });

  it("renders suffix content as decorative content", () => {
    render(<Textarea aria-label="备注" suffix={<span data-testid="suffix-content">⌘ Enter</span>} />);

    expect(screen.getByTestId("suffix-content").closest(".rui-textarea__suffix")).toHaveAttribute("aria-hidden", "true");
  });

  it("links invalid textarea to the error text", () => {
    render(<Textarea aria-label="审批意见" errorText="请输入审批意见" invalid />);

    const textarea = screen.getByRole("textbox", { name: "审批意见" });
    const error = screen.getByRole("alert");

    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute("aria-describedby", error.id);
    expect(error).toHaveTextContent("请输入审批意见");
  });

  it("preserves existing aria-describedby when rendering error text", () => {
    render(
      <>
        <p id="remark-help">用于操作日志展示</p>
        <Textarea aria-describedby="remark-help" aria-label="备注" errorText="请输入备注" invalid />
      </>
    );

    const textarea = screen.getByRole("textbox", { name: "备注" });
    expect(textarea.getAttribute("aria-describedby")).toContain("remark-help");
    expect(textarea.getAttribute("aria-describedby")).toContain(screen.getByRole("alert").id);
  });

  it("shows character count and keeps it updated", () => {
    render(<Textarea aria-label="备注" defaultValue="客户" maxLength={20} showCount />);

    const textarea = screen.getByRole("textbox", { name: "备注" });
    const count = screen.getByText("2 / 20");

    expect(textarea.getAttribute("aria-describedby")).toContain(count.id);

    fireEvent.change(textarea, { target: { value: "客户后台" } });
    expect(screen.getByText("4 / 20")).toBeInTheDocument();
  });

  it("auto sizes height from scroll height", async () => {
    render(<Textarea aria-label="备注" autoSize defaultValue="第一行" />);

    const textarea = screen.getByRole<HTMLTextAreaElement>("textbox", { name: "备注" });
    Object.defineProperty(textarea, "scrollHeight", { configurable: true, value: 96 });

    fireEvent.change(textarea, { target: { value: "第一行\n第二行\n第三行" } });

    await waitFor(() => {
      expect(textarea.style.height).toBe("96px");
      expect(textarea.style.overflowY).toBe("hidden");
    });
  });

  it("keeps native keyboard events available", () => {
    const handleKeyDown = vi.fn((event: KeyboardEvent<HTMLTextAreaElement>) => event.key);

    render(<Textarea aria-label="备注" onKeyDown={handleKeyDown} />);

    fireEvent.keyDown(screen.getByRole("textbox", { name: "备注" }), { key: "Enter" });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });
});
