import { screen } from "@testing-library/react";

import { RestrictedSignInPrompt } from "./RestrictedSignInPrompt";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("RestrictedSignInPrompt", () => {
  it("renders the component", () => {
    render(<RestrictedSignInPrompt />);

    expect(
      screen.getByRole("heading", { name: "Sign in to continue" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Our content remains 100% free/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/P.S. Signing in also gives you more ways/),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(
        "An illustration of a hijabi teacher writing on a whiteboard",
      ),
    ).toBeInTheDocument();
  });
});
