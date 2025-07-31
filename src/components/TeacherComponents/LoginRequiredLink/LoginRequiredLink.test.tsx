import LoginRequiredLink from "./LoginRequiredLink";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import {
  defaultCopyrightRequirements,
  isLoading,
  signedInGeoBlocked,
  signedInNotOnboarded,
  signedOutLoginRequired,
} from "@/__tests__/__helpers__/mockCopyrightRequirements";

const render = renderWithProviders();

let mockUseCopyrightRequirements = defaultCopyrightRequirements;
jest.mock("@/hooks/useCopyrightRequirements", () => ({
  useCopyrightRequirements: () => mockUseCopyrightRequirements,
}));

describe("LoginRequiredLink", () => {
  afterEach(() => {
    mockUseCopyrightRequirements = defaultCopyrightRequirements;
  });

  it("renders a sign up link when login is required and user is signed out", () => {
    mockUseCopyrightRequirements = signedOutLoginRequired;
    const { getByText, queryByRole } = render(
      <LoginRequiredLink
        loginRequired={true}
        geoRestricted={false}
        actionProps={{ href: "/foo", name: "Test Link" }}
      />,
    );
    const signUpButton = getByText("Sign up");
    const actionLink = queryByRole("link", { name: "Test Link" });
    expect(signUpButton).toBeInTheDocument();
    expect(actionLink).not.toBeInTheDocument();
  });

  it("renders an onboarding link", () => {
    mockUseCopyrightRequirements = signedInNotOnboarded;
    const { getByRole, queryByRole } = render(
      <LoginRequiredLink
        loginRequired={true}
        geoRestricted={false}
        actionProps={{ href: "/foo", name: "Test Link" }}
      />,
    );
    const onboardingLink = getByRole("link", {
      name: /complete sign up to continue/i,
    });
    const actionLink = queryByRole("link", { name: "Test Link" });
    expect(onboardingLink).toBeInTheDocument();
    expect(actionLink).not.toBeInTheDocument();
  });

  it("renders a loading link", () => {
    mockUseCopyrightRequirements = isLoading;
    const { getByText } = render(
      <LoginRequiredLink
        loginRequired={true}
        geoRestricted={true}
        actionProps={{ href: "/foo", name: "Test Link" }}
      />,
    );
    const link = getByText("Test Link");

    expect(link).not.toHaveAttribute("href");
  });

  it("renders an action link", () => {
    const { getByRole } = render(
      <LoginRequiredLink
        loginRequired={false}
        geoRestricted={false}
        actionProps={{ href: "/foo", name: "Action Link" }}
      />,
    );
    expect(getByRole("link", { name: /action link/i })).toBeInTheDocument();
  });

  it("renders a georestricted link as disabled", () => {
    mockUseCopyrightRequirements = signedInGeoBlocked;
    const { getByRole } = render(
      <LoginRequiredLink
        loginRequired={false}
        geoRestricted={true}
        actionProps={{ href: "/foo", name: "Geo Link" }}
      />,
    );
    expect(getByRole("link", { name: /geo link/i })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});
