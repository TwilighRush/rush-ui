import { createRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Input } from "./Input";

describe("Input", () => {
  it("renders a native text input with default type", () => {
    render(<Input aria-label="用户名" />);

    const input = screen.getByRole("textbox", { name: "用户名" });
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("type", "text");
  });

  it("forwards refs to the input element", () => {
    const ref = createRef<HTMLInputElement>();

    render(<Input aria-label="搜索" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("supports uncontrolled value through defaultValue", () => {
    render(<Input aria-label="项目名称" defaultValue="控制台" />);

    const input = screen.getByRole<HTMLInputElement>("textbox", { name: "项目名称" });
    expect(input.value).toBe("控制台");

    fireEvent.change(input, { target: { value: "运营后台" } });
    expect(input.value).toBe("运营后台");
  });

  it("supports controlled value with onValueChange", () => {
    function ControlledInput() {
      const [value, setValue] = useState("控制台");

      return <Input aria-label="项目名称" onValueChange={setValue} value={value} />;
    }

    render(<ControlledInput />);

    const input = screen.getByRole<HTMLInputElement>("textbox", { name: "项目名称" });
    fireEvent.change(input, { target: { value: "运营后台" } });

    expect(input.value).toBe("运营后台");
  });

  it("calls native onChange and semantic onValueChange", () => {
    const handleChange = vi.fn();
    const handleValueChange = vi.fn();

    render(<Input aria-label="筛选关键词" onChange={handleChange} onValueChange={handleValueChange} />);

    fireEvent.change(screen.getByRole("textbox", { name: "筛选关键词" }), { target: { value: "订单" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleValueChange).toHaveBeenCalledWith("订单");
  });

  it("clears controlled value with allowClear", () => {
    const handleChange = vi.fn();
    const handleClear = vi.fn();

    function ClearableInput() {
      const [value, setValue] = useState("订单");

      return <Input allowClear aria-label="搜索" onChange={handleChange} onClear={handleClear} onValueChange={setValue} value={value} />;
    }

    render(<ClearableInput />);

    const input = screen.getByRole<HTMLInputElement>("textbox", { name: "搜索" });
    fireEvent.click(screen.getByRole("button", { name: "清空输入" }));

    expect(input.value).toBe("");
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleClear).toHaveBeenCalledTimes(1);
    expect(input).toHaveFocus();
  });

  it("clears uncontrolled value with allowClear", () => {
    const handleValueChange = vi.fn();

    render(<Input allowClear aria-label="筛选关键词" defaultValue="订单" onValueChange={handleValueChange} />);

    const input = screen.getByRole<HTMLInputElement>("textbox", { name: "筛选关键词" });
    fireEvent.click(screen.getByRole("button", { name: "清空输入" }));

    expect(input.value).toBe("");
    expect(handleValueChange).toHaveBeenCalledWith("");
  });

  it("keeps the clear button slot mounted to avoid width changes", () => {
    render(<Input allowClear aria-label="搜索" />);

    const root = screen.getByRole("textbox", { name: "搜索" }).closest(".rui-input");
    const clearButton = root?.querySelector(".rui-input__clear");

    expect(screen.queryByRole("button", { name: "清空输入" })).not.toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toHaveAttribute("data-hidden", "");
  });

  it("passes className to the root and native attributes to the input", () => {
    render(<Input aria-label="客户编号" className="custom-input" data-track="customer-id" name="customerId" />);

    const input = screen.getByRole("textbox", { name: "客户编号" });
    const root = input.closest(".rui-input");

    expect(root).toHaveClass("custom-input");
    expect(input).toHaveAttribute("data-track", "customer-id");
    expect(input).toHaveAttribute("name", "customerId");
  });

  it("respects size and state markers", () => {
    render(<Input aria-label="邮箱" disabled invalid readOnly size="lg" />);

    const root = screen.getByRole("textbox", { name: "邮箱" }).parentElement?.parentElement;
    expect(root).toHaveAttribute("data-size", "lg");
    expect(root).toHaveAttribute("data-disabled", "");
    expect(root).toHaveAttribute("data-invalid", "");
    expect(root).toHaveAttribute("data-readonly", "");
  });

  it("renders prefix and suffix icon slots as decorative content", () => {
    render(
      <Input
        aria-label="搜索"
        prefix={<span data-testid="prefix-icon">⌕</span>}
        suffix={<span data-testid="suffix-icon">⌘K</span>}
      />
    );

    expect(screen.getByTestId("prefix-icon").closest(".rui-input__icon")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("suffix-icon").closest(".rui-input__icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("uses disabled semantics", () => {
    render(<Input aria-label="编号" disabled />);

    expect(screen.getByRole("textbox", { name: "编号" })).toBeDisabled();
  });

  it("uses readonly semantics without disabling focus", () => {
    render(<Input aria-label="只读字段" readOnly />);

    const input = screen.getByRole("textbox", { name: "只读字段" });
    expect(input).toHaveAttribute("readonly");
    expect(input).not.toBeDisabled();
  });

  it("links invalid input to the error text", () => {
    render(<Input aria-label="邮箱" errorText="请输入有效邮箱" invalid />);

    const input = screen.getByRole("textbox", { name: "邮箱" });
    const error = screen.getByRole("alert");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", error.id);
    expect(error).toHaveTextContent("请输入有效邮箱");
  });

  it("preserves existing aria-describedby when rendering error text", () => {
    render(
      <>
        <p id="email-help">用于接收系统通知</p>
        <Input aria-describedby="email-help" aria-label="邮箱" errorText="请输入有效邮箱" invalid />
      </>
    );

    const input = screen.getByRole("textbox", { name: "邮箱" });
    expect(input.getAttribute("aria-describedby")).toContain("email-help");
    expect(input.getAttribute("aria-describedby")).toContain(screen.getByRole("alert").id);
  });

  it("shows character count and keeps it updated", () => {
    render(<Input aria-label="项目名称" defaultValue="客户" maxLength={10} showCount />);

    const input = screen.getByRole("textbox", { name: "项目名称" });
    const count = screen.getByText("2 / 10");

    expect(input.getAttribute("aria-describedby")).toContain(count.id);

    fireEvent.change(input, { target: { value: "客户后台" } });
    expect(screen.getByText("4 / 10")).toBeInTheDocument();
  });

  it("keeps native keyboard events available", () => {
    const handleKeyDown = vi.fn((event: KeyboardEvent<HTMLInputElement>) => event.key);

    render(<Input aria-label="搜索" onKeyDown={handleKeyDown} />);

    fireEvent.keyDown(screen.getByRole("textbox", { name: "搜索" }), { key: "Enter" });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });
});
