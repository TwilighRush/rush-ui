import { act, render } from "@testing-library/react";
import axe from "axe-core";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";

import { Dialog } from "./dialog";
import { DropdownMenu } from "./dropdown-menu";
import { Popover } from "./popover";
import { Switch } from "./switch";
import { Tabs } from "./tabs";

const cases: Array<[string, ReactElement]> = [
  ["Switch", <Switch key="switch">启用通知</Switch>],
  [
    "Tabs",
    <Tabs.Root defaultValue="members" key="tabs">
      <Tabs.List aria-label="成员设置">
        <Tabs.Trigger value="members">成员</Tabs.Trigger>
        <Tabs.Trigger value="roles">角色</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="members">成员内容</Tabs.Content>
      <Tabs.Content value="roles">角色内容</Tabs.Content>
    </Tabs.Root>
  ],
  [
    "Popover",
    <Popover.Root defaultOpen key="popover">
      <Popover.Trigger>筛选</Popover.Trigger>
      <Popover.Content aria-label="筛选条件"><button type="button">应用</button></Popover.Content>
    </Popover.Root>
  ],
  [
    "DropdownMenu",
    <DropdownMenu.Root defaultOpen key="menu">
      <DropdownMenu.Trigger>更多操作</DropdownMenu.Trigger>
      <DropdownMenu.Content><DropdownMenu.Item>编辑</DropdownMenu.Item></DropdownMenu.Content>
    </DropdownMenu.Root>
  ],
  [
    "Dialog",
    <Dialog.Root defaultOpen key="dialog">
      <Dialog.Trigger>打开对话框</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>编辑成员</Dialog.Title>
        <Dialog.Description>更新成员信息。</Dialog.Description>
        <Dialog.Close>关闭</Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  ]
];

describe("public interactive components accessibility", () => {
  it.each(cases)("%s has no automatically detectable violations", async (_name, component) => {
    const view = render(component);
    await act(async () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));

    // jsdom 无法计算真实颜色，Portal 内容也不属于完整页面地标检查范围。
    const results = await axe.run(document.body, {
      rules: {
        "color-contrast": { enabled: false },
        region: { enabled: false }
      }
    });
    expect(results.violations).toEqual([]);
    view.unmount();
  });
});
