import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Switch } from "./Switch";

describe("Switch", () => {
  it("toggles in uncontrolled mode", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch onCheckedChange={handleChange}>启用通知</Switch>);
    const control = screen.getByRole("switch", { name: "启用通知" });

    expect(control).not.toBeChecked();
    await user.click(control);
    expect(control).toBeChecked();
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("respects controlled state", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={handleChange}>启用通知</Switch>);
    const control = screen.getByRole("switch");

    await user.click(control);
    expect(control).not.toBeChecked();
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("toggles with Tab and Space", async () => {
    const user = userEvent.setup();
    render(<Switch>启用通知</Switch>);
    await user.tab();
    const control = screen.getByRole("switch");
    expect(control).toHaveFocus();
    await user.keyboard(" ");
    expect(control).toBeChecked();
  });

  it("prevents interaction when disabled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch disabled onCheckedChange={handleChange}>启用通知</Switch>);
    await user.click(screen.getByRole("switch"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("uses native form submission, required and reset behavior", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <Switch name="notifications" required value="enabled">启用通知</Switch>
      </form>
    );
    const form = container.querySelector("form") as HTMLFormElement;
    const control = screen.getByRole("switch");
    expect(control).toBeRequired();
    await user.click(control);
    expect(new FormData(form).get("notifications")).toBe("enabled");
    form.reset();
    expect(control).not.toBeChecked();
  });

  it("associates description and error text", () => {
    render(<Switch description="仅影响新申请" errorText="必须启用" invalid>自动审批</Switch>);
    const control = screen.getByRole("switch", { name: "自动审批" });
    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(control).toHaveAccessibleDescription("仅影响新申请 必须启用");
  });

  it("forwards the input ref and applies className to the root", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Switch className="custom-switch" defaultChecked ref={ref} size="lg">启用通知</Switch>);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBeChecked();
    expect(ref.current?.closest(".rui-switch")).toHaveClass("custom-switch");
    expect(ref.current?.closest(".rui-switch")).toHaveAttribute("data-size", "lg");
  });

  it("keeps an aria-label only compact usage accessible", () => {
    render(<Switch aria-label="启用通知" />);
    expect(screen.getByRole("switch", { name: "启用通知" })).toBeInTheDocument();
  });
});
