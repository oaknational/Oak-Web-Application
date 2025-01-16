import { render, screen } from "@testing-library/react";
import { useUser } from "@clerk/nextjs";

import { withOnboardingRequired } from "./withOnboardingRequired";

import {
  mockLoadingUser,
  mockLoggedIn,
  mockLoggedOut,
} from "@/__tests__/__helpers__/mockUser";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";

type UseUserReturn = ReturnType<typeof useUser>;

describe(withOnboardingRequired, () => {
  const OriginalComponent = () => <div data-testid="canary" />;
  const Subject = withOnboardingRequired(() => <div data-testid="canary" />);

  beforeEach(() => {
    setUseUserReturn(mockLoadingUser);
  });

  describe.each<[string, UseUserReturn]>([
    ["clerk has yet to load", mockLoadingUser],
    ["the user is not signed-in", mockLoggedOut],
    [
      "the user is signed in but not onboarded",
      {
        ...mockLoggedIn,
        user: {
          ...mockLoggedIn.user,
          publicMetadata: { owa: { isOnboarded: false } },
        },
      },
    ],
  ])("%s", (__, currentUseUserReturn) => {
    beforeEach(() => {
      setUseUserReturn(currentUseUserReturn);
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
      setUseUserReturn(mockLoggedIn);
    });

    it("renders the component", () => {
      render(<Subject />);

      expect(screen.queryByTestId("canary")).toBeInTheDocument();
    });
  });
});
