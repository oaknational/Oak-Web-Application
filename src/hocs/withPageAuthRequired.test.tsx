import { render, screen } from "@testing-library/react";

import { withPageAuthRequired } from "./withPageAuthRequired";

import {
  mockLoadingUser,
  mockLoggedIn,
  mockLoggedOut,
} from "@/__tests__/__helpers__/mockUser";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";

describe(withPageAuthRequired, () => {
  const OriginalComponent = () => <div data-testid="canary" />;
  const Subject = withPageAuthRequired(OriginalComponent);

  beforeEach(() => {
    setUseUserReturn(mockLoadingUser);
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
      setUseUserReturn(mockLoggedOut);
    });

    it("redirects the user to sign-up", () => {
      render(<Subject />);

      expect(
        screen.queryByTestId("clerk-redirect-to-sign-up"),
      ).toBeInTheDocument();
    });
  });

  describe("when the user is signed-in", () => {
    beforeEach(() => {
      setUseUserReturn(mockLoggedIn);
    });

    it("redirects them to sign-in", () => {
      render(<Subject />);

      expect(screen.queryByTestId("canary")).toBeInTheDocument();
    });
  });
});
