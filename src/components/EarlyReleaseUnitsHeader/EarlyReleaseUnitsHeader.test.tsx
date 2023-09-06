import { screen } from "@testing-library/react";

import EarlyReleaseUnitstitle from ".";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("components/AppHeader", () => {
  test("renders correct copy", () => {
    render(<EarlyReleaseUnitstitle />);

    expect(screen.getByText("Teachers & Subject leads")).toBeInTheDocument();
    expect(screen.getByText("New teaching resources")).toBeInTheDocument();
    expect(
      screen.getByText(
        "We're releasing new teaching resources throughout this academic year, with everything available to you by summer 2024."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Explore our early-release units...")
    ).toBeInTheDocument();
  });
});
