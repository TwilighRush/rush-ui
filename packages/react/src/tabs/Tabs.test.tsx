import { createRef } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Tabs } from "./Tabs";

function TabsChildren({ forceMount = false }: { forceMount?: boolean }) {
  return (
    <>
      <Tabs.List aria-label="工作区设置">
        <Tabs.Trigger value="members">成员</Tabs.Trigger>
        <Tabs.Trigger value="roles">角色</Tabs.Trigger>
        <Tabs.Trigger disabled value="audit">审计</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content forceMount={forceMount} value="members">成员内容</Tabs.Content>
      <Tabs.Content forceMount={forceMount} value="roles">角色内容</Tabs.Content>
      <Tabs.Content forceMount={forceMount} value="audit">审计内容</Tabs.Content>
    </>
  );
}

describe("Tabs", () => {
  it("renders the selected panel and changes on click", async () => {
    const user = userEvent.setup();
    render(<Tabs.Root defaultValue="members"><TabsChildren /></Tabs.Root>);
    expect(screen.getByRole("tab", { name: "成员" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("成员内容")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "角色" }));
    expect(screen.getByRole("tab", { name: "角色" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("角色内容")).toBeInTheDocument();
  });

  it("supports controlled state without defaultValue", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Tabs.Root value="members" onValueChange={handleChange}><TabsChildren /></Tabs.Root>);
    await user.click(screen.getByRole("tab", { name: "角色" }));
    expect(handleChange).toHaveBeenCalledWith("roles");
    expect(screen.getByText("成员内容")).toBeInTheDocument();
  });

  it("moves focus and automatic selection while skipping disabled tabs", () => {
    render(<Tabs.Root defaultValue="members"><TabsChildren /></Tabs.Root>);
    const members = screen.getByRole("tab", { name: "成员" });
    const roles = screen.getByRole("tab", { name: "角色" });
    members.focus();

    fireEvent.keyDown(members, { key: "ArrowRight" });
    expect(roles).toHaveFocus();
    expect(roles).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(roles, { key: "ArrowRight" });
    expect(members).toHaveFocus();
  });

  it("supports manual activation with Enter and Space", async () => {
    const user = userEvent.setup();
    render(<Tabs.Root activationMode="manual" defaultValue="members"><TabsChildren /></Tabs.Root>);
    const members = screen.getByRole("tab", { name: "成员" });
    const roles = screen.getByRole("tab", { name: "角色" });

    members.focus();
    await user.keyboard("{ArrowRight}");
    expect(roles).toHaveFocus();
    expect(members).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{Enter}");
    expect(roles).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowLeft} ");
    expect(members).toHaveAttribute("aria-selected", "true");
  });

  it("supports vertical arrows, Home and End", () => {
    render(<Tabs.Root defaultValue="roles" orientation="vertical"><TabsChildren /></Tabs.Root>);
    const members = screen.getByRole("tab", { name: "成员" });
    const roles = screen.getByRole("tab", { name: "角色" });
    roles.focus();
    fireEvent.keyDown(roles, { key: "ArrowUp" });
    expect(members).toHaveFocus();
    fireEvent.keyDown(members, { key: "End" });
    expect(roles).toHaveFocus();
    fireEvent.keyDown(roles, { key: "Home" });
    expect(members).toHaveFocus();
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
  });

  it("keeps force-mounted panels hidden and linked", () => {
    render(<Tabs.Root defaultValue="members"><TabsChildren forceMount /></Tabs.Root>);
    const rolesTab = screen.getByRole("tab", { name: "角色" });
    const rolesPanel = document.getElementById(rolesTab.getAttribute("aria-controls") as string) as HTMLElement;
    expect(rolesPanel).toHaveAttribute("hidden");
    expect(rolesTab).toHaveAttribute("aria-controls", rolesPanel.id);
  });

  it("forwards refs and className for every part", () => {
    const rootRef = createRef<HTMLDivElement>();
    const listRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();
    render(
      <Tabs.Root className="custom-root" defaultValue="members" ref={rootRef}>
        <Tabs.List className="custom-list" ref={listRef}>
          <Tabs.Trigger className="custom-trigger" ref={triggerRef} value="members">成员</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="custom-content" ref={contentRef} value="members">内容</Tabs.Content>
      </Tabs.Root>
    );
    expect(rootRef.current).toHaveClass("custom-root");
    expect(listRef.current).toHaveClass("custom-list");
    expect(triggerRef.current).toHaveClass("custom-trigger");
    expect(contentRef.current).toHaveClass("custom-content");
  });
});
