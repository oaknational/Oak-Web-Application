import { describe, expect, it } from "vitest";

import Hr from "./Hr";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("Hr", () => {
  it("should render a 'separator'", () => {
    const { getByTestId } = render(<Hr />);
    expect(getByTestId("hr")).toBeInTheDocument();
  });
});
