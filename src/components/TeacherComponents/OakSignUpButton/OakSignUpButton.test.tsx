import { screen } from "@testing-library/dom";

import OakSignUpButton from "./OakSignUpButton";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoadingUser,
  mockLoggedOut,
  mockNotOnboardedUser,
} from "@/__tests__/__helpers__/mockUser";

const render = renderWithProviders();

describe("Sign up button", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedOut);
  });
  it("should render a sign up button", () => {
    render(<OakSignUpButton />);
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });
  it("should render an onboarding button", () => {
    setUseUserReturn(mockNotOnboardedUser);
    render(<OakSignUpButton />);
    expect(
      screen.getByRole("button", { name: /complete sign up to continue/i }),
    ).toBeInTheDocument();
  });
  it("should render a loading button", () => {
    setUseUserReturn(mockLoadingUser);
    render(<OakSignUpButton />);
    expect(
      screen.getByRole("button", { name: /loading.../i }),
    ).toBeInTheDocument();
  });
  it.todo("should render an action button");
  it.todo("renders a primary variant");
  it.todo("renders a secondary variant");
  it.todo("renders a tertiary variant");
});
