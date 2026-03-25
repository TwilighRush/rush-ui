import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("App", () => {
  it("renders the monorepo overview", () => {
    render(<App />);

    expect(screen.getByText("React component library monorepo foundation")).toBeInTheDocument();
    expect(screen.getByText("@rush-ui/react")).toBeInTheDocument();
  });
});
