import { render, screen } from "@testing-library/react";
import { useUser } from "@clerk/nextjs";

import { withPageAuthRequired } from "./withPageAuthRequired";

import * as clerk from "@/context/FeatureFlaggedClerk/FeatureFlaggedClerk";

jest.mock("@/context/FeatureFlaggedClerk/FeatureFlaggedClerk");

describe(withPageAuthRequired, () => {
  const OriginalComponent = () => <div data-testid="canary" />;
  const Subject = withPageAuthRequired(OriginalComponent);

  describe("when clerk has yet to load", () => {
    beforeEach(() => {
      jest.spyOn(clerk, "useFeatureFlaggedClerk").mockReturnValue({
        ...clerk.fakeClerkApi,
        useUser() {
          return { user: undefined, isLoaded: false, isSignedIn: undefined };
        },
      });
    });

    it("renders nothing", () => {
      const { container } = render(<Subject />);

      expect(container).toBeEmptyDOMElement();
    });

    describe("and a fallback component was supplied", () => {
      const SubjectWithFallback = withPageAuthRequired(
        OriginalComponent,
        ({ children }) => {
          return <div data-testid="fallback">{children}</div>;
        },
      );

      it("renders the fallback component with the original as its children", () => {
        render(<SubjectWithFallback />);

        expect(screen.queryByTestId("canary")).toBeInTheDocument();
        expect(screen.getByTestId("fallback")).toContainElement(
          screen.getByTestId("canary"),
        );
      });
    });
  });

  describe("when the user is not signed-in", () => {
    function RedirectToSignIn() {
      return <div data-testid="redirectToSignIn" />;
    }
    RedirectToSignIn.displayName = "FakeRedirectToSignIn";

    beforeEach(() => {
      jest.spyOn(clerk, "useFeatureFlaggedClerk").mockReturnValue({
        ...clerk.fakeClerkApi,
        useUser() {
          return { user: null, isLoaded: true, isSignedIn: false };
        },
        RedirectToSignIn,
      });
    });

    it("redirects them to sign-in", () => {
      render(<Subject />);

      expect(screen.queryByTestId("redirectToSignIn")).toBeInTheDocument();
    });
  });

  describe("when the user is signed-in", () => {
    beforeEach(() => {
      jest.spyOn(clerk, "useFeatureFlaggedClerk").mockReturnValue({
        ...clerk.fakeClerkApi,
        useUser() {
          return {
            user: { id: "123" },
            isLoaded: true,
            isSignedIn: true,
          } as ReturnType<typeof useUser>;
        },
      });
    });

    it("redirects them to sign-in", () => {
      render(<Subject />);

      expect(screen.queryByTestId("canary")).toBeInTheDocument();
    });
  });
});
