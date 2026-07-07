import { createRef, useState } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders page controls, current page semantics and total summary", () => {
    render(<Pagination defaultPage={5} showTotal total={95} />);

    const navigation = screen.getByRole("navigation", { name: "分页" });
    const currentPage = screen.getByRole("button", { name: "第 5 页，当前页" });

    expect(navigation).toBeInTheDocument();
    expect(currentPage).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("第 41-50 条 / 共 95 条")).toBeInTheDocument();
    expect(screen.getAllByText("...")).toHaveLength(2);
  });

  it("supports uncontrolled page changes", () => {
    const handlePageChange = vi.fn();

    render(<Pagination defaultPage={2} onPageChange={handlePageChange} total={35} />);

    fireEvent.click(screen.getByRole("button", { name: "下一页" }));
    expect(screen.getByRole("button", { name: "第 3 页，当前页" })).toHaveAttribute("aria-current", "page");
    expect(handlePageChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByRole("button", { name: "前往第 1 页" }));
    expect(screen.getByRole("button", { name: "第 1 页，当前页" })).toHaveAttribute("aria-current", "page");
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it("does not emit changes when selecting the current page", () => {
    const handlePageChange = vi.fn();

    render(<Pagination defaultPage={2} onPageChange={handlePageChange} total={35} />);

    fireEvent.click(screen.getByRole("button", { name: "第 2 页，当前页" }));

    expect(handlePageChange).not.toHaveBeenCalled();
  });

  it("supports controlled page state", () => {
    function ControlledPagination() {
      const [page, setPage] = useState(1);

      return <Pagination onPageChange={setPage} page={page} total={35} />;
    }

    render(<ControlledPagination />);

    fireEvent.click(screen.getByRole("button", { name: "下一页" }));

    expect(screen.getByRole("button", { name: "第 2 页，当前页" })).toHaveAttribute("aria-current", "page");
  });

  it("clamps empty or out-of-range pages to the available range", () => {
    render(<Pagination defaultPage={4} showTotal total={0} />);

    expect(screen.getByRole("button", { name: "第 1 页，当前页" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "上一页" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "下一页" })).toBeDisabled();
    expect(screen.getByText("第 0-0 条 / 共 0 条")).toBeInTheDocument();
  });

  it("uses disabled semantics for disabled and loading states", () => {
    const { rerender } = render(<Pagination disabled total={35} />);

    expect(screen.getByRole("button", { name: "下一页" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "第 1 页，当前页" })).toBeDisabled();

    rerender(<Pagination loading loadingText="列表刷新中" total={35} />);

    const navigation = screen.getByRole("navigation", { name: "分页" });
    expect(navigation).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveTextContent("列表刷新中");
    expect(screen.getByRole("button", { name: "前往第 2 页" })).toBeDisabled();
  });

  it("links error text and preserves existing descriptions", () => {
    render(
      <>
        <p id="page-help">列表底部分页。</p>
        <Pagination aria-describedby="page-help" errorText="当前页加载失败，请重试。" total={35} />
      </>
    );

    const navigation = screen.getByRole("navigation", { name: "分页" });
    const error = screen.getByRole("alert");

    expect(navigation.getAttribute("aria-describedby")).toContain("page-help");
    expect(navigation.getAttribute("aria-describedby")).toContain(error.id);
    expect(error).toHaveTextContent("当前页加载失败，请重试。");
  });

  it("moves focus with arrow keys, Home and End without changing page", () => {
    render(<Pagination defaultPage={5} total={100} />);

    const currentPage = screen.getByRole("button", { name: "第 5 页，当前页" });
    const nextPage = screen.getByRole("button", { name: "前往第 6 页" });
    currentPage.focus();

    fireEvent.keyDown(currentPage, { key: "ArrowRight" });
    expect(nextPage).toHaveFocus();
    expect(screen.getByRole("button", { name: "第 5 页，当前页" })).toHaveAttribute("aria-current", "page");

    fireEvent.keyDown(nextPage, { key: "End" });
    expect(screen.getByRole("button", { name: "下一页" })).toHaveFocus();

    fireEvent.keyDown(screen.getByRole("button", { name: "下一页" }), { key: "Home" });
    expect(screen.getByRole("button", { name: "上一页" })).toHaveFocus();
  });

  it("forwards refs, className and custom accessible labels", () => {
    const ref = createRef<HTMLElement>();

    render(
      <Pagination
        className="custom-pagination"
        getPageAriaLabel={(page, selected) => (selected ? `当前第 ${page} 页` : `打开第 ${page} 页`)}
        nextAriaLabel="下一批"
        previousAriaLabel="上一批"
        ref={ref}
        total={35}
      />
    );

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toHaveClass("custom-pagination");
    expect(screen.getByRole("button", { name: "上一批" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "下一批" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "当前第 1 页" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "打开第 2 页" })).toBeInTheDocument();
  });

  it("supports custom total rendering", () => {
    render(<Pagination showTotal={({ page, pageCount, total }) => `第 ${page}/${pageCount} 页，共 ${total} 条`} total={35} />);

    expect(screen.getByText("第 1/4 页，共 35 条")).toBeInTheDocument();
  });
});
