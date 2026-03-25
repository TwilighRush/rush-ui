import { describe, expect, it } from "vitest";

import { cx } from "./index";

describe("cx", () => {
  it("joins truthy class names", () => {
    expect(cx("root", undefined, "active", false, "compact")).toBe("root active compact");
  });
});
