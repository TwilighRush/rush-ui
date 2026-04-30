import { describe, expect, it } from "vitest";

import { createComponentClassName } from "./component-class-name";

describe("createComponentClassName", () => {
  it("creates stable slot class names for internal components", () => {
    expect(createComponentClassName("button")).toBe("rui-button-root");
    expect(createComponentClassName("button", "icon")).toBe("rui-button-icon");
  });
});
