import { describe, expect, it } from "vitest";

import { tokens } from "./index";

describe("tokens", () => {
  it("exposes foundational design tokens", () => {
    expect(tokens.color.accent).toBe("#c56a1b");
    expect(tokens.color.status.success.indicator).toBe("#27824a");
    expect(tokens.space.lg).toBe("24px");
  });
});
