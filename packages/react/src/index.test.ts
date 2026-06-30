import { describe, expect, it } from "vitest";

import {
  Alert,
  Badge,
  Button,
  Checkbox,
  CheckboxGroup,
  Dialog,
  DropdownMenu,
  Field,
  IconButton,
  Input,
  Popover,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Tabs,
  Textarea,
  Tooltip
} from "./index";

describe("@rush_ui/react entry", () => {
  it("exports public components", () => {
    expect(Alert).toBeTypeOf("object");
    expect(Badge).toBeTypeOf("object");
    expect(Button).toBeTypeOf("object");
    expect(Checkbox).toBeTypeOf("object");
    expect(CheckboxGroup).toBeTypeOf("object");
    expect(Dialog.Root).toBeTypeOf("function");
    expect(DropdownMenu.Root).toBeTypeOf("function");
    expect(Field).toBeTypeOf("object");
    expect(IconButton).toBeTypeOf("object");
    expect(Input).toBeTypeOf("object");
    expect(Popover.Root).toBeTypeOf("function");
    expect(Radio).toBeTypeOf("object");
    expect(RadioGroup).toBeTypeOf("object");
    expect(Select).toBeTypeOf("object");
    expect(Switch).toBeTypeOf("object");
    expect(Tabs.Root).toBeTypeOf("object");
    expect(Textarea).toBeTypeOf("object");
    expect(Tooltip.Root).toBeTypeOf("function");
  });
});
