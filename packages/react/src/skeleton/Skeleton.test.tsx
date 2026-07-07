import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renders a decorative block placeholder by default", () => {
    render(<Skeleton data-testid="skeleton" />);

    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton).toHaveClass("rui-skeleton");
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton).toHaveAttribute("data-variant", "block");
    expect(skeleton).toHaveAttribute("data-animated", "");
  });

  it("supports text and circle variants", () => {
    const { rerender } = render(<Skeleton data-testid="skeleton" variant="text" />);

    expect(screen.getByTestId("skeleton")).toHaveAttribute("data-variant", "text");

    rerender(<Skeleton data-testid="skeleton" variant="circle" />);

    expect(screen.getByTestId("skeleton")).toHaveAttribute("data-variant", "circle");
  });

  it("renders multiple text lines", () => {
    render(<Skeleton data-testid="skeleton" lines={3} variant="text" />);

    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton).toHaveAttribute("data-has-lines", "");
    expect(skeleton).toHaveAttribute("data-lines", "3");
    expect(skeleton.querySelectorAll(".rui-skeleton__line")).toHaveLength(3);
  });

  it("can disable animation", () => {
    render(<Skeleton animated={false} data-testid="skeleton" />);

    expect(screen.getByTestId("skeleton")).not.toHaveAttribute("data-animated");
  });

  it("applies width and height through inline style", () => {
    render(<Skeleton data-testid="skeleton" height={48} width="12rem" />);

    const skeleton = screen.getByTestId("skeleton");

    expect(skeleton).toHaveStyle({ height: "48px", width: "12rem" });
  });

  it("passes className and native attributes to the root", () => {
    render(
      <Skeleton
        aria-hidden={false}
        aria-label="成员列表占位"
        className="custom-skeleton"
        data-testid="skeleton"
        data-track="member-skeleton"
        role="img"
      />
    );

    const skeleton = screen.getByRole("img", { name: "成员列表占位" });

    expect(skeleton).toHaveClass("custom-skeleton");
    expect(skeleton).toHaveAttribute("aria-hidden", "false");
    expect(skeleton).toHaveAttribute("data-track", "member-skeleton");
  });

  it("forwards refs to the skeleton root", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Skeleton ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("rui-skeleton");
  });
});
