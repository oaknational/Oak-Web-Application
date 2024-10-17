import { render } from "@testing-library/react";
import * as posthog from "posthog-js/react";
import mockRouter from "next-router-mock";

import withFeatureFlag from "./withFeatureFlag";

jest.mock("next/navigation", () => require("next-router-mock"));
jest.mock("posthog-js/react");

describe(withFeatureFlag, () => {
  describe.each<
    [variantValueType: string, variantValue: string | true | undefined]
  >([
    ["true", true],
    ["a string", "test-variant"],
  ])("when the variant value is %s", (__, variantValue) => {
    const Subject = withFeatureFlag(
      () => <div data-testid="canary" />,
      "test-feature",
      variantValue,
    );

    beforeEach(() => {
      mockRouter.setCurrentUrl("/flagged-page");
    });

    describe("and the feature is enabled", () => {
      beforeEach(() => {
        jest
          .spyOn(posthog, "useFeatureFlagVariantKey")
          .mockReturnValueOnce(variantValue);
      });

      it("renders the component", () => {
        const { container, getByTestId } = render(<Subject />);

        expect(posthog.useFeatureFlagVariantKey).toHaveBeenCalledWith(
          "test-feature",
        );
        expect(container).toContainElement(getByTestId("canary"));
      });

      it("does not redirect", () => {
        render(<Subject />);

        expect(mockRouter.pathname).toEqual("/flagged-page");
      });
    });

    describe("and flags are not loaded", () => {
      beforeEach(() => {
        jest
          .spyOn(posthog, "useFeatureFlagVariantKey")
          .mockReturnValueOnce(undefined);
      });

      it("renders nothing", () => {
        const { container } = render(<Subject />);

        expect(container).toBeEmptyDOMElement();
      });

      it("does not redirect", () => {
        render(<Subject />);

        expect(mockRouter.pathname).toEqual("/flagged-page");
      });
    });

    describe("and the feature is disabled", () => {
      beforeEach(() => {
        jest
          .spyOn(posthog, "useFeatureFlagVariantKey")
          .mockReturnValueOnce(false);
      });

      it("renders nothing", () => {
        const { container } = render(<Subject />);

        expect(container).toBeEmptyDOMElement();
      });

      it("redirects to the 404 page", () => {
        render(<Subject />);

        expect(mockRouter.pathname).toEqual("/404");
      });
    });
  });
});
