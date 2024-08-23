import { render, screen } from "@testing-library/react";
import { useUser } from "@clerk/nextjs";

import { withOnboardingRequired } from "./withOnboardingRequired";

import * as clerk from "@/context/FeatureFlaggedClerk/FeatureFlaggedClerk";
import {
  mockLoadingUser,
  mockLoggedIn,
  mockLoggedOut,
} from "@/__tests__/__helpers__/mockUser";

jest.mock("@/context/FeatureFlaggedClerk/FeatureFlaggedClerk");

type UseUserReturn = ReturnType<typeof useUser>;

describe(withOnboardingRequired, () => {
  const OriginalComponent = () => <div data-testid="canary" />;
  const Subject = withOnboardingRequired(() => <div data-testid="canary" />);
  let useUserReturn: UseUserReturn;

  beforeEach(() => {
    useUserReturn = mockLoadingUser;

    jest.spyOn(clerk, "useFeatureFlaggedClerk").mockReturnValue({
      ...clerk.fakeClerkApi,
      useUser() {
        return useUserReturn;
      },
    });
  });

  describe.each<[string, UseUserReturn]>([
    ["clerk has yet to load", mockLoadingUser],
    ["the user is not signed-in", mockLoggedOut],
    ["the user is signed in but not onboarded", mockLoggedIn],
  ])("%s", (__, currentUseUserReturn) => {
    beforeEach(() => {
      useUserReturn = currentUseUserReturn;
    });

    it("renders nothing", () => {
      const { container } = render(<Subject />);

      expect(container).toBeEmptyDOMElement();
    });

    describe("and a fallback component was supplied", () => {
      const SubjectWithFallback = withOnboardingRequired(
        OriginalComponent,
        ({ children }) => {
          return <div data-testid="fallback">{children}</div>;
        },
      );

      it("renders the fallback component with the component as its child", () => {
        render(<SubjectWithFallback />);

        expect(screen.queryByTestId("canary")).toBeInTheDocument();
        expect(screen.getByTestId("fallback")).toContainElement(
          screen.getByTestId("canary"),
        );
      });
    });
  });

  describe("when the user is signed in and onboarded", () => {
    beforeEach(() => {
      useUserReturn = {
        ...mockLoggedIn,
        user: {
          ...mockLoggedIn.user,
          publicMetadata: { owa: { isOnboarded: true } },
        },
      };
    });

    it("renders the component", () => {
      render(<Subject />);

      expect(screen.queryByTestId("canary")).toBeInTheDocument();
    });
  });
});
