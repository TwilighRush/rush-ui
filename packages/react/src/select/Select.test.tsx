import { createRef, useState } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Field } from "../field";
import { Select } from "./Select";
import type { SelectOption } from "./Select";

const statusOptions: SelectOption[] = [
  { label: "待处理", textValue: "pending", value: "pending" },
  { label: "处理中", textValue: "processing", value: "processing" },
  { label: "已完成", textValue: "done", value: "done" }
];

describe("Select", () => {
  it("renders a combobox with placeholder text", () => {
    render(<Select aria-label="项目状态" options={statusOptions} placeholder="请选择状态" />);

    const select = screen.getByRole("combobox", { name: "项目状态" });
    const root = select.closest(".rui-select");

    expect(select).toHaveAttribute("aria-expanded", "false");
    expect(select).toHaveTextContent("请选择状态");
    expect(root).toHaveAttribute("data-placeholder", "");
  });

  it("forwards refs to the combobox button", () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Select aria-label="项目状态" options={statusOptions} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveAttribute("role", "combobox");
  });

  it("supports uncontrolled value through defaultValue", () => {
    render(<Select aria-label="项目状态" defaultValue="processing" options={statusOptions} />);

    const select = screen.getByRole("combobox", { name: "项目状态" });
    expect(select).toHaveTextContent("处理中");

    fireEvent.click(select);
    fireEvent.click(screen.getByRole("option", { name: "已完成" }));

    expect(select).toHaveTextContent("已完成");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("renders the popup through a portal when opened by click", () => {
    render(<Select aria-label="项目状态" options={statusOptions} placeholder="请选择状态" />);

    const select = screen.getByRole("combobox", { name: "项目状态" });
    const root = select.closest(".rui-select");
    fireEvent.click(select);

    const popup = screen.getByRole("listbox").parentElement;
    expect(select).toHaveAttribute("aria-expanded", "true");
    expect(popup).toHaveClass("rui-select__popup");
    expect(document.body).toContainElement(popup);
    expect(root).not.toContainElement(popup);
  });

  it("anchors the upward popup to the trigger instead of offsetting by max height", () => {
    const innerHeightDescriptor = Object.getOwnPropertyDescriptor(window, "innerHeight");
    const innerWidthDescriptor = Object.getOwnPropertyDescriptor(window, "innerWidth");

    Object.defineProperty(window, "innerHeight", { configurable: true, value: 600 });
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 800 });

    render(<Select aria-label="项目状态" options={statusOptions} placeholder="请选择状态" />);

    const select = screen.getByRole("combobox", { name: "项目状态" });
    const rectSpy = vi.spyOn(select, "getBoundingClientRect").mockReturnValue({
      bottom: 580,
      height: 40,
      left: 24,
      right: 244,
      top: 540,
      width: 220,
      x: 24,
      y: 540,
      toJSON: () => ({})
    });

    try {
      fireEvent.click(select);

      const popup = screen.getByRole("listbox").parentElement as HTMLElement;
      expect(popup.style.bottom).toBe("66px");
      expect(popup.style.top).toBe("");
      expect(popup.style.maxHeight).toBe("280px");
      expect(popup.style.width).toBe("220px");
    } finally {
      rectSpy.mockRestore();

      if (innerHeightDescriptor) {
        Object.defineProperty(window, "innerHeight", innerHeightDescriptor);
      }

      if (innerWidthDescriptor) {
        Object.defineProperty(window, "innerWidth", innerWidthDescriptor);
      }
    }
  });

  it("supports controlled value with onValueChange", () => {
    function ControlledSelect() {
      const [value, setValue] = useState("pending");

      return <Select aria-label="项目状态" onValueChange={setValue} options={statusOptions} value={value} />;
    }

    render(<ControlledSelect />);

    const select = screen.getByRole("combobox", { name: "项目状态" });
    expect(select).toHaveTextContent("待处理");

    fireEvent.click(select);
    fireEvent.click(screen.getByRole("option", { name: "处理中" }));

    expect(select).toHaveTextContent("处理中");
  });

  it("calls onValueChange only when the selected value changes", () => {
    const handleValueChange = vi.fn();

    render(<Select aria-label="项目状态" defaultValue="pending" onValueChange={handleValueChange} options={statusOptions} />);

    const select = screen.getByRole("combobox", { name: "项目状态" });
    fireEvent.click(select);
    fireEvent.click(screen.getByRole("option", { name: "待处理" }));
    expect(handleValueChange).not.toHaveBeenCalled();

    fireEvent.click(select);
    fireEvent.click(screen.getByRole("option", { name: "已完成" }));
    expect(handleValueChange).toHaveBeenCalledWith("done");
  });

  it("renders a hidden input for form submission", () => {
    const { container } = render(<Select aria-label="项目状态" defaultValue="pending" name="status" options={statusOptions} />);

    const input = container.querySelector<HTMLInputElement>('input[type="hidden"][name="status"]');
    expect(input).toHaveValue("pending");

    fireEvent.click(screen.getByRole("combobox", { name: "项目状态" }));
    fireEvent.click(screen.getByRole("option", { name: "已完成" }));

    expect(input).toHaveValue("done");
  });

  it("passes className to the root and respects size and state markers", () => {
    render(<Select aria-label="项目状态" className="custom-select" invalid options={statusOptions} size="lg" />);

    const root = screen.getByRole("combobox", { name: "项目状态" }).closest(".rui-select");

    expect(root).toHaveClass("custom-select");
    expect(root).toHaveAttribute("data-size", "lg");
    expect(root).toHaveAttribute("data-invalid", "");
  });

  it("uses disabled semantics and prevents opening", () => {
    render(<Select aria-label="项目状态" disabled options={statusOptions} />);

    const select = screen.getByRole("combobox", { name: "项目状态" });
    fireEvent.click(select);

    expect(select).toBeDisabled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("links invalid select to the error text", () => {
    render(<Select aria-label="项目状态" errorText="请选择项目状态" invalid options={statusOptions} />);

    const select = screen.getByRole("combobox", { name: "项目状态" });
    const error = screen.getByRole("alert");

    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select.getAttribute("aria-describedby")).toContain(error.id);
    expect(error).toHaveTextContent("请选择项目状态");
  });

  it("preserves existing aria-describedby when rendering error text", () => {
    render(
      <>
        <p id="status-help">影响列表筛选范围。</p>
        <Select aria-describedby="status-help" aria-label="项目状态" errorText="请选择项目状态" invalid options={statusOptions} />
      </>
    );

    const select = screen.getByRole("combobox", { name: "项目状态" });
    expect(select.getAttribute("aria-describedby")).toContain("status-help");
    expect(select.getAttribute("aria-describedby")).toContain(screen.getByRole("alert").id);
  });

  it("renders option descriptions and selected state", () => {
    render(
      <Select
        aria-label="分配策略"
        defaultValue="team"
        options={[
          { description: "只把记录分配给当前登录成员。", label: "个人队列", value: "owner" },
          { description: "按团队规则自动分配给成员。", label: "团队队列", value: "team" }
        ]}
      />
    );

    fireEvent.click(screen.getByRole("combobox", { name: "分配策略" }));

    expect(screen.getByText("按团队规则自动分配给成员。")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "团队队列 按团队规则自动分配给成员。" })).toHaveAttribute("aria-selected", "true");
  });

  it("shows empty state when there are no options", () => {
    render(<Select aria-label="项目状态" emptyText="暂无状态" options={[]} />);

    fireEvent.click(screen.getByRole("combobox", { name: "项目状态" }));

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("暂无状态")).toBeInTheDocument();
  });

  it("opens with ArrowDown and selects the active option with Enter", () => {
    const handleValueChange = vi.fn();

    render(<Select aria-label="项目状态" onValueChange={handleValueChange} options={statusOptions} />);

    const select = screen.getByRole("combobox", { name: "项目状态" });
    fireEvent.keyDown(select, { key: "ArrowDown" });

    const pendingOption = screen.getByRole("option", { name: "待处理" });
    expect(select).toHaveAttribute("aria-expanded", "true");
    expect(select).toHaveAttribute("aria-activedescendant", pendingOption.id);

    fireEvent.keyDown(select, { key: "Enter" });

    expect(select).toHaveTextContent("待处理");
    expect(handleValueChange).toHaveBeenCalledWith("pending");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("moves active option with arrows and skips disabled options", () => {
    render(
      <Select
        aria-label="项目状态"
        options={[
          { label: "待处理", value: "pending" },
          { disabled: true, label: "处理中", value: "processing" },
          { label: "已完成", value: "done" }
        ]}
      />
    );

    const select = screen.getByRole("combobox", { name: "项目状态" });
    fireEvent.keyDown(select, { key: "ArrowDown" });
    fireEvent.keyDown(select, { key: "ArrowDown" });

    expect(select).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "已完成" }).id);
  });

  it("supports Home, End and Escape keys", () => {
    render(<Select aria-label="项目状态" defaultValue="processing" options={statusOptions} />);

    const select = screen.getByRole("combobox", { name: "项目状态" });
    fireEvent.keyDown(select, { key: "ArrowDown" });
    fireEvent.keyDown(select, { key: "End" });
    expect(select).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "已完成" }).id);

    fireEvent.keyDown(select, { key: "Home" });
    expect(select).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "待处理" }).id);

    fireEvent.keyDown(select, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("supports typeahead with textValue", () => {
    render(<Select aria-label="审批模式" options={statusOptions} />);

    const select = screen.getByRole("combobox", { name: "审批模式" });
    fireEvent.keyDown(select, { key: "d" });

    expect(select).toHaveAttribute("aria-expanded", "true");
    expect(select).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "已完成" }).id);

    fireEvent.keyDown(select, { key: "Enter" });
    expect(select).toHaveTextContent("已完成");
  });

  it("combines with Field for label, help text, required and error state", () => {
    render(
      <Field errorText="请选择项目状态" helpText="会影响列表筛选范围。" label="项目状态" required>
        <Select options={statusOptions} placeholder="请选择状态" />
      </Field>
    );

    const select = screen.getByRole("combobox", { name: "项目状态 请选择状态" });
    const help = screen.getByText("会影响列表筛选范围。");
    const error = screen.getByRole("alert");

    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAttribute("aria-required", "true");
    expect(select.getAttribute("aria-describedby")).toContain(help.id);
    expect(select.getAttribute("aria-describedby")).toContain(error.id);
  });
});
