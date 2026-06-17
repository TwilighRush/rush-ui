import { describe, expect, it } from "vitest";

import { Badge, Button, Checkbox, Field, IconButton, Input, Radio, RadioGroup, Textarea } from "./index";

describe("@rush-ui/react entry", () => {
  it("exports public components", () => {
    expect(Badge).toBeTypeOf("object");
    expect(Button).toBeTypeOf("object");
    expect(Checkbox).toBeTypeOf("object");
    expect(Field).toBeTypeOf("object");
    expect(IconButton).toBeTypeOf("object");
    expect(Input).toBeTypeOf("object");
    expect(Radio).toBeTypeOf("object");
    expect(RadioGroup).toBeTypeOf("object");
    expect(Textarea).toBeTypeOf("object");
  });
});
