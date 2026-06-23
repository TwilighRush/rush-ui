import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("App", () => {
  it("renders the monorepo overview", () => {
    render(<App />);

    expect(screen.getByText("面向后台系统的 React 组件库基础工程")).toBeInTheDocument();
    expect(screen.getByText("@rush_ui/react")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Dialog 文档示例" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "DropdownMenu 文档示例" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Popover 文档示例" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Switch 文档示例" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tabs 文档示例" })).toBeInTheDocument();
  });
});
