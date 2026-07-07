import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders an accessible loading status by default", () => {
    render(<Spinner />);

    const spinner = screen.getByRole("status", { name: "加载中" });

    expect(spinner).toHaveClass("rui-spinner");
    expect(spinner).toHaveAttribute("data-size", "md");
    expect(spinner.querySelector(".rui-spinner__indicator")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders visible label content", () => {
    render(<Spinner label="正在同步成员" />);

    expect(screen.getByRole("status")).toHaveTextContent("正在同步成员");
    expect(screen.getByText("正在同步成员")).toHaveClass("rui-spinner__label");
  });

  it("respects size state markers", () => {
    render(<Spinner aria-label="加载报表" size="lg" />);

    expect(screen.getByRole("status", { name: "加载报表" })).toHaveAttribute("data-size", "lg");
  });

  it("can be marked decorative with aria-hidden", () => {
    render(<Spinner aria-hidden />);

    const spinner = document.querySelector(".rui-spinner");

    expect(screen.queryByRole("status")).toBeNull();
    expect(spinner).toHaveAttribute("aria-hidden", "true");
    expect(spinner).not.toHaveAttribute("aria-label");
  });

  it("passes className and native attributes to the root", () => {
    render(<Spinner aria-label="加载成员" className="custom-spinner" data-track="member-loading" id="member-spinner" />);

    const spinner = screen.getByRole("status", { name: "加载成员" });

    expect(spinner).toHaveClass("custom-spinner");
    expect(spinner).toHaveAttribute("data-track", "member-loading");
    expect(spinner).toHaveAttribute("id", "member-spinner");
  });

  it("forwards refs to the spinner root", () => {
    const ref = createRef<HTMLSpanElement>();

    render(<Spinner ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(ref.current).toHaveClass("rui-spinner");
  });
});
