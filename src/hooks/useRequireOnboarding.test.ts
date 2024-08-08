import mockRouter from "next-router-mock";
import { act } from "react-dom/test-utils";

import { useRequireOnboarding } from "./useRequireOnboarding";

import { renderHookWithProviders } from "@/__tests__/__helpers__/renderWithProviders";

describe(useRequireOnboarding, () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/original");
  });

  describe("when the user is not logged in", () => {
    const renderHookWithNoUser = renderHookWithProviders({
      user: { user: undefined },
    });

    it("does nothing", async () => {
      await act(async () => {
        await renderHookWithNoUser(useRequireOnboarding);
      });

      expect(mockRouter.pathname).toEqual("/original");
    });
  });

  describe("when the user is logged in", () => {
    describe("and the user has completed onboarding", () => {
      const renderHookWithOnboardedUser = renderHookWithProviders({
        user: { user: { "owa:onboarded": true } },
      });

      it("does nothing", () => {
        renderHookWithOnboardedUser(useRequireOnboarding);

        expect(mockRouter.pathname).toEqual("/original");
      });
    });

    describe("and the user has not completed onboarding", () => {
      const renderHookWithUser = renderHookWithProviders({
        user: { user: {} },
      });

      it("redirects to the onboarding page", () => {
        renderHookWithUser(useRequireOnboarding);

        expect(mockRouter.pathname).toEqual("/onboarding");
        expect(mockRouter.query.returnTo).toEqual("/original");
      });

      it.each(["/onboarding", "/onboarding/foo", "/404", "/500"])(
        "does not redirect when the user is at %p",
        (route) => {
          mockRouter.setCurrentUrl(route);

          renderHookWithUser(useRequireOnboarding);

          expect(mockRouter.pathname).toEqual(route);
        },
      );
    });
  });
});
