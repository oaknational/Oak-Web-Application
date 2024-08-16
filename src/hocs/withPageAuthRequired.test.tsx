import { render, screen } from "@testing-library/react";
import { useUser } from "@clerk/nextjs";

import { withPageAuthRequired } from "./withPageAuthRequired";

import * as clerk from "@/context/FeatureFlaggedClerk/FeatureFlaggedClerk";
import {
  mockLoadingUser,
  mockLoggedIn,
  mockLoggedOut,
} from "@/__tests__/__helpers__/mockUser";

jest.mock("@/context/FeatureFlaggedClerk/FeatureFlaggedClerk");

function MockRedirectToSignIn() {
  return <div data-testid="redirectToSignIn" />;
}
MockRedirectToSignIn.displayName = "MockRedirectToSignIn";

describe(withPageAuthRequired, () => {
  const OriginalComponent = () => <div data-testid="canary" />;
  const Subject = withPageAuthRequired(OriginalComponent);
  let useUserReturn: ReturnType<typeof useUser>;

  beforeEach(() => {
    useUserReturn = mockLoadingUser;
    jest.spyOn(clerk, "useFeatureFlaggedClerk").mockReturnValue({
      ...clerk.fakeClerkApi,
      RedirectToSignIn: MockRedirectToSignIn,
      useUser() {
        return useUserReturn;
      },
    });
  });

  describe("when clerk has yet to load", () => {
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

      it("renders the fallback component with the component as its children", () => {
        render(<SubjectWithFallback />);

        expect(screen.queryByTestId("canary")).toBeInTheDocument();
        expect(screen.getByTestId("fallback")).toContainElement(
          screen.getByTestId("canary"),
        );
      });
    });
  });

  describe("when the user is not signed-in", () => {
    beforeEach(() => {
      useUserReturn = mockLoggedOut;
    });

    it("redirects the user to sign-in", () => {
      render(<Subject />);

      expect(screen.queryByTestId("redirectToSignIn")).toBeInTheDocument();
    });
  });

  describe("when the user is signed-in", () => {
    beforeEach(() => {
      useUserReturn = mockLoggedIn;
    });

    it("redirects them to sign-in", () => {
      render(<Subject />);

      expect(screen.queryByTestId("canary")).toBeInTheDocument();
    });
  });
});
