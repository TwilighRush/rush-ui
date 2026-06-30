import { createRef } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Empty } from "./Empty";

describe("Empty", () => {
  it("renders title and optional description", () => {
    render(<Empty description="调整筛选条件或新建第一条成员记录。" title="暂无成员" />);

    const empty = screen.getByText("暂无成员").closest(".rui-empty");

    expect(empty?.tagName).toBe("DIV");
    expect(empty).toHaveAttribute("data-size", "md");
    expect(screen.getByText("调整筛选条件或新建第一条成员记录。")).toBeInTheDocument();
  });

  it("keeps the default icon decorative", () => {
    render(<Empty title="暂无数据" />);

    const empty = screen.getByText("暂无数据").closest(".rui-empty");
    const icon = empty?.querySelector(".rui-empty__icon");

    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon?.querySelector(".rui-empty__default-icon")).toBeInTheDocument();
  });

  it("can hide the icon when icon is null", () => {
    render(<Empty icon={null} title="暂无搜索结果" />);

    const empty = screen.getByText("暂无搜索结果").closest(".rui-empty");

    expect(empty).not.toHaveAttribute("data-has-icon");
    expect(empty?.querySelector(".rui-empty__icon")).toBeNull();
  });

  it("renders custom icon and action content", () => {
    render(
      <Empty
        actions={<button type="button">清空筛选</button>}
        icon={<span data-testid="custom-icon">0</span>}
        title="未找到匹配结果"
      />
    );

    expect(screen.getByTestId("custom-icon")).toHaveTextContent("0");
    expect(screen.getByRole("button", { name: "清空筛选" })).toBeInTheDocument();
  });

  it("respects size state markers", () => {
    render(<Empty size="lg" title="还没有项目" />);

    expect(screen.getByText("还没有项目").closest(".rui-empty")).toHaveAttribute("data-size", "lg");
  });

  it("passes className and native attributes to the root", () => {
    render(<Empty aria-label="成员空状态" className="custom-empty" data-track="member-empty" role="status" title="暂无成员" />);

    const empty = screen.getByRole("status", { name: "成员空状态" });
    expect(empty).toHaveClass("custom-empty");
    expect(empty).toHaveAttribute("data-track", "member-empty");
  });

  it("forwards refs to the empty root", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Empty ref={ref} title="暂无配置" />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.textContent).toContain("暂无配置");
  });

  it("does not intercept keyboard events from action controls", () => {
    const handleKeyDown = vi.fn();

    render(<Empty actions={<button onKeyDown={handleKeyDown}>新建成员</button>} title="暂无成员" />);

    const button = screen.getByRole("button", { name: "新建成员" });
    button.focus();
    fireEvent.keyDown(button, { key: "Enter" });

    expect(button).toHaveFocus();
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });
});
