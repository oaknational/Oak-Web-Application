import { screen } from "@testing-library/dom";

import OakSignUpButton from "./OakSignUpButton";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("Sign up button", () => {
  it("should render a sign up button", () => {
    render(<OakSignUpButton />);
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });
  it.todo("should render an onboarding button");
  it.todo("should render an action button");
  it.todo("renders a primary variant");
  it.todo("renders a secondary variant");
  it.todo("renders a tertiary variant");
});
