import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Input } from "../input";
import { Textarea } from "../textarea";
import { Field } from "./Field";

describe("Field", () => {
  it("renders a label linked to the generated control id", () => {
    render(
      <Field label="项目名称">
        <Input />
      </Field>
    );

    const input = screen.getByLabelText("项目名称");
    const label = screen.getByText("项目名称").closest("label");

    expect(input).toHaveAttribute("id");
    expect(label).toHaveAttribute("for", input.id);
  });

  it("uses controlId when provided", () => {
    render(
      <Field controlId="project-name" label="项目名称">
        <Input />
      </Field>
    );

    expect(screen.getByLabelText("项目名称")).toHaveAttribute("id", "project-name");
  });

  it("keeps an existing child id when controlId is not provided", () => {
    render(
      <Field label="项目名称">
        <Input id="existing-name" />
      </Field>
    );

    expect(screen.getByLabelText("项目名称")).toHaveAttribute("id", "existing-name");
  });

  it("links help text through aria-describedby", () => {
    render(
      <Field helpText="用于侧边栏和面包屑展示" label="项目名称">
        <Input />
      </Field>
    );

    const input = screen.getByLabelText("项目名称");
    const help = screen.getByText("用于侧边栏和面包屑展示");

    expect(input.getAttribute("aria-describedby")).toContain(help.id);
  });

  it("preserves existing aria-describedby when adding help text", () => {
    render(
      <Field helpText="用于侧边栏和面包屑展示" label="项目名称">
        <Input aria-describedby="external-help" />
      </Field>
    );

    const input = screen.getByLabelText("项目名称");
    expect(input.getAttribute("aria-describedby")).toContain("external-help");
    expect(input.getAttribute("aria-describedby")).toContain(screen.getByText("用于侧边栏和面包屑展示").id);
  });

  it("passes required semantics and renders the required mark", () => {
    render(
      <Field label="项目名称" required>
        <Input />
      </Field>
    );

    expect(screen.getByLabelText("项目名称")).toBeRequired();
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  });

  it("does not override a child required value", () => {
    render(
      <Field label="项目名称" required>
        <Input required={false} />
      </Field>
    );

    expect(screen.getByLabelText("项目名称")).not.toBeRequired();
  });

  it("passes invalid and errorText to Input", () => {
    render(
      <Field errorText="请输入项目名称" label="项目名称">
        <Input />
      </Field>
    );

    const input = screen.getByLabelText("项目名称");
    const error = screen.getByRole("alert");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toContain(error.id);
    expect(error).toHaveTextContent("请输入项目名称");
  });

  it("passes invalid and errorText to Textarea", () => {
    render(
      <Field errorText="请输入备注" label="备注">
        <Textarea />
      </Field>
    );

    const textarea = screen.getByLabelText("备注");
    const error = screen.getByRole("alert");

    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea.getAttribute("aria-describedby")).toContain(error.id);
  });

  it("renders optional text for non-required fields", () => {
    render(
      <Field label="备注" optionalText="选填">
        <Textarea />
      </Field>
    );

    expect(screen.getByText("选填")).toBeInTheDocument();
  });

  it("hides optional text when required", () => {
    render(
      <Field label="备注" optionalText="选填" required>
        <Textarea />
      </Field>
    );

    expect(screen.queryByText("选填")).not.toBeInTheDocument();
  });

  it("passes className to the root and forwards the root ref", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Field className="custom-field" label="项目名称" ref={ref}>
        <Input />
      </Field>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("custom-field");
  });
});
