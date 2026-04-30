import { describe, expect, it } from "vitest";

import { Button, IconButton } from "./index";

describe("@rush-ui/react entry", () => {
  it("exports public components", () => {
    expect(Button).toBeTypeOf("object");
    expect(IconButton).toBeTypeOf("object");
  });
});
