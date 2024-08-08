import { render, screen } from "@testing-library/react";
import { useUser } from "@clerk/nextjs";

import { withOnboardingRequired } from "./withOnboardingRequired";

import * as clerk from "@/context/FeatureFlaggedClerk/FeatureFlaggedClerk";

jest.mock("@/context/FeatureFlaggedClerk/FeatureFlaggedClerk");

type UseUserReturn = ReturnType<typeof useUser>;

describe(withOnboardingRequired, () => {
  const OriginalComponent = () => <div data-testid="canary" />;
  const Subject = withOnboardingRequired(() => <div data-testid="canary" />);
  let useUserReturn: UseUserReturn;

  beforeEach(() => {
    useUserReturn = {
      user: undefined,
      isLoaded: false,
      isSignedIn: undefined,
    };

    jest.spyOn(clerk, "useFeatureFlaggedClerk").mockReturnValue({
      ...clerk.fakeClerkApi,
      useUser() {
        return useUserReturn;
      },
    });
  });

  describe.each<[string, UseUserReturn]>([
    [
      "clerk has yet to load",
      {
        user: undefined,
        isLoaded: false,
        isSignedIn: undefined,
      },
    ],
    [
      "the user is not signed-in",
      { user: null, isLoaded: true, isSignedIn: false },
    ],
    [
      "the user is signed in but not onboarded",
      {
        user: { id: "123", publicMetadata: {} },
        isLoaded: true,
        isSignedIn: true,
      } as UseUserReturn,
    ],
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
        user: {
          userId: "123",
          publicMetadata: { "owa:onboarded": true },
        },
        isLoaded: true,
        isSignedIn: true,
      } as unknown as UseUserReturn;
    });

    it("renders the component", () => {
      render(<Subject />);

      expect(screen.queryByTestId("canary")).toBeInTheDocument();
    });
  });
});
