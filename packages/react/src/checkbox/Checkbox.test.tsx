import { createRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders a native checkbox with label text", () => {
    render(<Checkbox>接收通知</Checkbox>);

    const checkbox = screen.getByRole("checkbox", { name: "接收通知" });
    expect(checkbox.tagName).toBe("INPUT");
    expect(checkbox).toHaveAttribute("type", "checkbox");
  });

  it("forwards refs to the checkbox input", () => {
    const ref = createRef<HTMLInputElement>();

    render(<Checkbox ref={ref}>启用审批</Checkbox>);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe("checkbox");
  });

  it("supports uncontrolled checked state through defaultChecked", () => {
    render(<Checkbox defaultChecked>同步客户资料</Checkbox>);

    const checkbox = screen.getByRole("checkbox", { name: "同步客户资料" });
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("supports controlled checked state with onCheckedChange", () => {
    function ControlledCheckbox() {
      const [checked, setChecked] = useState(false);

      return (
        <Checkbox checked={checked} onCheckedChange={setChecked}>
          允许成员导出
        </Checkbox>
      );
    }

    render(<ControlledCheckbox />);

    const checkbox = screen.getByRole("checkbox", { name: "允许成员导出" });
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("calls native onChange and semantic onCheckedChange", () => {
    const handleChange = vi.fn();
    const handleCheckedChange = vi.fn();

    render(
      <Checkbox onChange={handleChange} onCheckedChange={handleCheckedChange}>
        开启自动归档
      </Checkbox>
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "开启自动归档" }));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it("supports indeterminate state", () => {
    render(<Checkbox indeterminate>本页全选</Checkbox>);

    const checkbox = screen.getByRole<HTMLInputElement>("checkbox", { name: "本页全选" });
    const root = checkbox.closest(".rui-checkbox");

    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox).toHaveAttribute("aria-checked", "mixed");
    expect(root).toHaveAttribute("data-indeterminate", "");
  });

  it("passes className to the root and native attributes to the input", () => {
    render(
      <Checkbox className="custom-checkbox" data-track="archive" name="archive" value="yes">
        归档记录
      </Checkbox>
    );

    const checkbox = screen.getByRole("checkbox", { name: "归档记录" });
    const root = checkbox.closest(".rui-checkbox");

    expect(root).toHaveClass("custom-checkbox");
    expect(checkbox).toHaveAttribute("data-track", "archive");
    expect(checkbox).toHaveAttribute("name", "archive");
    expect(checkbox).toHaveAttribute("value", "yes");
  });

  it("respects size and state markers", () => {
    render(
      <Checkbox disabled invalid size="lg">
        需要复核
      </Checkbox>
    );

    const root = screen.getByRole("checkbox", { name: "需要复核" }).closest(".rui-checkbox");
    expect(root).toHaveAttribute("data-size", "lg");
    expect(root).toHaveAttribute("data-disabled", "");
    expect(root).toHaveAttribute("data-invalid", "");
  });

  it("uses disabled semantics and prevents interaction", () => {
    const handleCheckedChange = vi.fn();

    render(
      <Checkbox disabled onCheckedChange={handleCheckedChange}>
        禁用选项
      </Checkbox>
    );

    const checkbox = screen.getByRole("checkbox", { name: "禁用选项" });
    checkbox.click();

    expect(checkbox).toBeDisabled();
    expect(checkbox).not.toBeChecked();
    expect(handleCheckedChange).not.toHaveBeenCalled();
  });

  it("links description and invalid checkbox to describedby content", () => {
    render(
      <Checkbox description="关闭后成员无法继续提交审批。" errorText="必须确认审批策略" invalid>
        启用审批策略
      </Checkbox>
    );

    const checkbox = screen.getByRole("checkbox", { name: "启用审批策略" });
    const description = screen.getByText("关闭后成员无法继续提交审批。");
    const error = screen.getByRole("alert");

    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(checkbox.getAttribute("aria-describedby")).toContain(description.id);
    expect(checkbox.getAttribute("aria-describedby")).toContain(error.id);
    expect(error).toHaveTextContent("必须确认审批策略");
  });

  it("preserves existing aria-describedby when rendering helper content", () => {
    render(
      <>
        <p id="global-help">用于操作审计。</p>
        <Checkbox aria-describedby="global-help" description="同步后自动写入日志。">
          记录变更日志
        </Checkbox>
      </>
    );

    const checkbox = screen.getByRole("checkbox", { name: "记录变更日志" });
    expect(checkbox.getAttribute("aria-describedby")).toContain("global-help");
    expect(checkbox.getAttribute("aria-describedby")).toContain(screen.getByText("同步后自动写入日志。").id);
  });

  it("keeps native keyboard events available", () => {
    const handleKeyDown = vi.fn((event: KeyboardEvent<HTMLInputElement>) => event.key);

    render(<Checkbox onKeyDown={handleKeyDown}>键盘选项</Checkbox>);

    fireEvent.keyDown(screen.getByRole("checkbox", { name: "键盘选项" }), { key: " " });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });
});
