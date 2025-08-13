import { render, screen } from "@testing-library/react";

import { withOnboardingRequired } from "./withOnboardingRequired";

import {
  mockLoadingUser,
  mockLoggedIn,
  mockLoggedOut,
} from "@/__tests__/__helpers__/mockUser";
import {
  setUseUserReturn,
  UseUserReturn,
} from "@/__tests__/__helpers__/mockClerk";

describe(withOnboardingRequired, () => {
  const OriginalComponent = () => <div data-testid="canary" />;
  const Subject = withOnboardingRequired(() => <div data-testid="canary" />);

  describe.each<[string, UseUserReturn]>([
    ["clerk has yet to load", mockLoadingUser],
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

  it("renders the component when the user is signed in and onboarded", () => {
    setUseUserReturn(mockLoggedIn);

    render(<Subject />);

    expect(screen.queryByTestId("canary")).toBeInTheDocument();
  });

  it("renders the component when the user is signed out", () => {
    setUseUserReturn(mockLoggedOut);

    render(<Subject />);

    expect(screen.queryByTestId("canary")).toBeInTheDocument();
  });
});
