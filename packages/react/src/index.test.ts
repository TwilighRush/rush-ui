import { describe, expect, it } from "vitest";

import { createComponentClassName } from "./index";

describe("createComponentClassName", () => {
  it("creates stable slot class names for future components", () => {
    expect(createComponentClassName("button")).toBe("rui-button-root");
    expect(createComponentClassName("button", "icon")).toBe("rui-button-icon");
  });
});
