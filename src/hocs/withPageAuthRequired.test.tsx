import { render, screen } from "@testing-library/react";
import { useUser } from "@clerk/nextjs";

import { withPageAuthRequired } from "./withPageAuthRequired";

import * as clerk from "@/context/FeatureFlaggedClerk/FeatureFlaggedClerk";

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
    useUserReturn = {
      user: undefined,
      isLoaded: false,
      isSignedIn: undefined,
    };
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

  describe("when the user is signed-in", () => {
    beforeEach(() => {
      useUserReturn = {
        user: { id: "123" },
        isLoaded: true,
        isSignedIn: true,
      } as ReturnType<typeof useUser>;
    });

    it("redirects them to sign-in", () => {
      render(<Subject />);

      expect(screen.queryByTestId("canary")).toBeInTheDocument();
    });
  });
});
