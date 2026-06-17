import { createRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Field } from "../field";
import { Radio, RadioGroup } from "./Radio";

describe("Radio", () => {
  it("renders a native radio with label text", () => {
    render(<Radio name="status">启用</Radio>);

    const radio = screen.getByRole("radio", { name: "启用" });
    expect(radio.tagName).toBe("INPUT");
    expect(radio).toHaveAttribute("type", "radio");
  });

  it("forwards refs to the radio input", () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <Radio name="audit" ref={ref}>
        人工审核
      </Radio>
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe("radio");
  });

  it("supports uncontrolled checked state through defaultChecked", () => {
    render(
      <>
        <Radio defaultChecked name="channel" value="email">
          邮件
        </Radio>
        <Radio name="channel" value="sms">
          短信
        </Radio>
      </>
    );

    const emailRadio = screen.getByRole("radio", { name: "邮件" });
    const smsRadio = screen.getByRole("radio", { name: "短信" });

    expect(emailRadio).toBeChecked();
    fireEvent.click(smsRadio);
    expect(emailRadio).not.toBeChecked();
    expect(smsRadio).toBeChecked();
  });

  it("supports controlled checked state with onCheckedChange", () => {
    function ControlledRadio() {
      const [checked, setChecked] = useState(false);

      return (
        <Radio checked={checked} name="mode" onCheckedChange={setChecked}>
          自动处理
        </Radio>
      );
    }

    render(<ControlledRadio />);

    const radio = screen.getByRole("radio", { name: "自动处理" });
    expect(radio).not.toBeChecked();

    fireEvent.click(radio);
    expect(radio).toBeChecked();
  });

  it("calls native onChange and semantic onCheckedChange", () => {
    const handleChange = vi.fn();
    const handleCheckedChange = vi.fn();

    render(
      <Radio name="archive" onChange={handleChange} onCheckedChange={handleCheckedChange}>
        自动归档
      </Radio>
    );

    fireEvent.click(screen.getByRole("radio", { name: "自动归档" }));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it("passes className to the root and native attributes to the input", () => {
    render(
      <Radio className="custom-radio" data-track="owner" name="owner" value="sales">
        销售负责
      </Radio>
    );

    const radio = screen.getByRole("radio", { name: "销售负责" });
    const root = radio.closest(".rui-radio");

    expect(root).toHaveClass("custom-radio");
    expect(radio).toHaveAttribute("data-track", "owner");
    expect(radio).toHaveAttribute("name", "owner");
    expect(radio).toHaveAttribute("value", "sales");
  });

  it("respects size and state markers", () => {
    render(
      <Radio disabled invalid name="risk" size="lg">
        高风险
      </Radio>
    );

    const root = screen.getByRole("radio", { name: "高风险" }).closest(".rui-radio");
    expect(root).toHaveAttribute("data-size", "lg");
    expect(root).toHaveAttribute("data-disabled", "");
    expect(root).toHaveAttribute("data-invalid", "");
  });

  it("uses disabled semantics and prevents interaction", () => {
    const handleCheckedChange = vi.fn();

    render(
      <Radio disabled name="status" onCheckedChange={handleCheckedChange}>
        禁用选项
      </Radio>
    );

    const radio = screen.getByRole("radio", { name: "禁用选项" });
    radio.click();

    expect(radio).toBeDisabled();
    expect(radio).not.toBeChecked();
    expect(handleCheckedChange).not.toHaveBeenCalled();
  });

  it("links description and invalid radio to describedby content", () => {
    render(
      <Radio description="会通知全部空间管理员。" errorText="必须选择通知策略" invalid name="notify">
        全量通知
      </Radio>
    );

    const radio = screen.getByRole("radio", { name: "全量通知" });
    const description = screen.getByText("会通知全部空间管理员。");
    const error = screen.getByRole("alert");

    expect(radio).toHaveAttribute("aria-invalid", "true");
    expect(radio.getAttribute("aria-describedby")).toContain(description.id);
    expect(radio.getAttribute("aria-describedby")).toContain(error.id);
    expect(error).toHaveTextContent("必须选择通知策略");
  });

  it("keeps native keyboard events available", () => {
    const handleKeyDown = vi.fn((event: KeyboardEvent<HTMLInputElement>) => event.key);

    render(<Radio name="keyboard" onKeyDown={handleKeyDown}>键盘选项</Radio>);

    fireEvent.keyDown(screen.getByRole("radio", { name: "键盘选项" }), { key: " " });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });
});

describe("RadioGroup", () => {
  it("renders a radiogroup and applies a shared name to radios", () => {
    render(
      <RadioGroup aria-label="通知方式" name="notice">
        <Radio value="email">邮件</Radio>
        <Radio value="sms">短信</Radio>
      </RadioGroup>
    );

    expect(screen.getByRole("radiogroup", { name: "通知方式" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "邮件" })).toHaveAttribute("name", "notice");
    expect(screen.getByRole("radio", { name: "短信" })).toHaveAttribute("name", "notice");
  });

  it("supports uncontrolled value through defaultValue", () => {
    const handleValueChange = vi.fn();

    render(
      <RadioGroup defaultValue="email" onValueChange={handleValueChange}>
        <Radio value="email">邮件</Radio>
        <Radio value="sms">短信</Radio>
      </RadioGroup>
    );

    expect(screen.getByRole("radio", { name: "邮件" })).toBeChecked();

    fireEvent.click(screen.getByRole("radio", { name: "短信" }));
    expect(screen.getByRole("radio", { name: "短信" })).toBeChecked();
    expect(handleValueChange).toHaveBeenCalledWith("sms");
  });

  it("supports controlled value with onValueChange", () => {
    function ControlledGroup() {
      const [value, setValue] = useState("manual");

      return (
        <RadioGroup aria-label="处理方式" onValueChange={setValue} value={value}>
          <Radio value="manual">人工处理</Radio>
          <Radio value="auto">自动处理</Radio>
        </RadioGroup>
      );
    }

    render(<ControlledGroup />);

    expect(screen.getByRole("radio", { name: "人工处理" })).toBeChecked();
    fireEvent.click(screen.getByRole("radio", { name: "自动处理" }));
    expect(screen.getByRole("radio", { name: "自动处理" })).toBeChecked();
  });

  it("moves focus and selection with arrow keys", () => {
    const handleValueChange = vi.fn();

    render(
      <RadioGroup defaultValue="email" onValueChange={handleValueChange}>
        <Radio value="email">邮件</Radio>
        <Radio value="sms">短信</Radio>
        <Radio value="webhook">Webhook</Radio>
      </RadioGroup>
    );

    const emailRadio = screen.getByRole("radio", { name: "邮件" });
    const smsRadio = screen.getByRole("radio", { name: "短信" });

    emailRadio.focus();
    fireEvent.keyDown(emailRadio, { key: "ArrowDown" });

    expect(smsRadio).toHaveFocus();
    expect(smsRadio).toBeChecked();
    expect(handleValueChange).toHaveBeenCalledWith("sms");
  });

  it("wraps arrow key navigation and skips disabled radios", () => {
    render(
      <RadioGroup defaultValue="email">
        <Radio value="email">邮件</Radio>
        <Radio disabled value="sms">
          短信
        </Radio>
        <Radio value="webhook">Webhook</Radio>
      </RadioGroup>
    );

    const emailRadio = screen.getByRole("radio", { name: "邮件" });
    const webhookRadio = screen.getByRole("radio", { name: "Webhook" });

    emailRadio.focus();
    fireEvent.keyDown(emailRadio, { key: "ArrowDown" });
    expect(webhookRadio).toHaveFocus();
    expect(webhookRadio).toBeChecked();

    fireEvent.keyDown(webhookRadio, { key: "ArrowDown" });
    expect(emailRadio).toHaveFocus();
    expect(emailRadio).toBeChecked();
  });

  it("supports Home and End keys for roving focus", () => {
    render(
      <RadioGroup defaultValue="sms">
        <Radio value="email">邮件</Radio>
        <Radio value="sms">短信</Radio>
        <Radio value="webhook">Webhook</Radio>
      </RadioGroup>
    );

    const emailRadio = screen.getByRole("radio", { name: "邮件" });
    const smsRadio = screen.getByRole("radio", { name: "短信" });
    const webhookRadio = screen.getByRole("radio", { name: "Webhook" });

    smsRadio.focus();
    fireEvent.keyDown(smsRadio, { key: "End" });
    expect(webhookRadio).toHaveFocus();
    expect(webhookRadio).toBeChecked();

    fireEvent.keyDown(webhookRadio, { key: "Home" });
    expect(emailRadio).toHaveFocus();
    expect(emailRadio).toBeChecked();
  });

  it("passes group state to child radios", () => {
    render(
      <RadioGroup disabled invalid required size="lg">
        <Radio value="strict">严格模式</Radio>
      </RadioGroup>
    );

    const radio = screen.getByRole("radio", { name: "严格模式" });
    const root = radio.closest(".rui-radio");

    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-required", "true");
    expect(radio).toBeDisabled();
    expect(radio).toBeRequired();
    expect(radio).toHaveAttribute("aria-invalid", "true");
    expect(root).toHaveAttribute("data-size", "lg");
    expect(root).toHaveAttribute("data-invalid", "");
  });

  it("combines with Field for label, help text, required and error state", () => {
    render(
      <Field errorText="请选择一个默认通知方式" helpText="会影响新建项目的初始配置。" label="默认通知方式" required>
        <RadioGroup defaultValue="email">
          <Radio value="email">邮件</Radio>
          <Radio value="sms">短信</Radio>
        </RadioGroup>
      </Field>
    );

    const group = screen.getByRole("radiogroup", { name: "默认通知方式" });
    const emailRadio = screen.getByRole("radio", { name: "邮件" });
    const help = screen.getByText("会影响新建项目的初始配置。");
    const error = screen.getByRole("alert");

    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAttribute("aria-required", "true");
    expect(group.getAttribute("aria-describedby")).toContain(help.id);
    expect(group.getAttribute("aria-describedby")).toContain(error.id);
    expect(emailRadio).toBeRequired();
  });
});
