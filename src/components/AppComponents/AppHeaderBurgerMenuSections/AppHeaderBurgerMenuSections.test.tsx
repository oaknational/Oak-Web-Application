import { screen, within } from "@testing-library/react";
import * as posthog from "posthog-js/react";
import { PropsWithChildren } from "react";

import AppHeaderBurgerMenuSections from "./AppHeaderBurgerMenuSections";

import { burgerMenuSections } from "@/browser-lib/fixtures/burgerMenuSections";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import * as featureFlaggedClerk from "@/context/FeatureFlaggedClerk/FeatureFlaggedClerk";

jest.mock("@/context/FeatureFlaggedClerk/FeatureFlaggedClerk");

describe("AppHeaderBurgerburgerMenuSections", () => {
  beforeEach(() => {
    jest
      .spyOn(featureFlaggedClerk, "useFeatureFlaggedClerk")
      .mockReturnValue(featureFlaggedClerk.fakeClerkApi);
  });

  it("renders 3 burger menu sections", () => {
    renderWithProviders()(
      <AppHeaderBurgerMenuSections burgerMenuSections={burgerMenuSections} />,
    );

    const menuSection = screen.getAllByTestId("menu-section");
    expect(menuSection).toHaveLength(3);
  });

  it("renders a heading and a list in each section", () => {
    renderWithProviders()(
      <AppHeaderBurgerMenuSections burgerMenuSections={burgerMenuSections} />,
    );

    const menuSections = screen.getAllByTestId("menu-section");
    const firstSection = menuSections[0];
    const header = within(firstSection!).getByRole("heading");
    expect(header).toBeInTheDocument();
    const list = within(firstSection!).getByRole("list");
    expect(list).toBeInTheDocument();
  });

  describe("when the `use-auth-owa` feature is enabled", () => {
    function SignOutButton({ children }: PropsWithChildren) {
      return <>{children}</>;
    }
    SignOutButton.displayName = "SignoutButton";

    beforeEach(() => {
      jest.spyOn(posthog, "useFeatureFlagEnabled").mockReturnValue(true);
    });

    it("does not render a sign out button when user is not logged in", () => {
      jest
        .spyOn(featureFlaggedClerk, "useFeatureFlaggedClerk")
        .mockReturnValue({
          ...featureFlaggedClerk.fakeClerkApi,
          SignOutButton,
          SignedIn: () => null,
        });

      renderWithProviders()(
        <AppHeaderBurgerMenuSections burgerMenuSections={burgerMenuSections} />,
      );

      const signOutButton = screen.queryByText("Sign out");
      expect(signOutButton).not.toBeInTheDocument();
    });

    it("renders a sign out button when a user is logged in", async () => {
      jest
        .spyOn(featureFlaggedClerk, "useFeatureFlaggedClerk")
        .mockReturnValue({
          ...featureFlaggedClerk.fakeClerkApi,
          SignOutButton,
          SignedIn: ({ children }) => <>{children}</>,
        });

      renderWithProviders()(
        <AppHeaderBurgerMenuSections burgerMenuSections={burgerMenuSections} />,
      );
      const signOutButton = await screen.findByRole("button", {
        name: "Sign out",
      });
      expect(signOutButton).toBeInTheDocument();
    });
  });
});
