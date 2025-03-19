import mockRouter from "next-router-mock";

import { useRequireOnboarding } from "./useRequireOnboarding";

import { renderHookWithProviders } from "@/__tests__/__helpers__/renderWithProviders";
import {
  mockLoadingUser,
  mockLoggedIn,
  mockLoggedOut,
} from "@/__tests__/__helpers__/mockUser";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";

describe(useRequireOnboarding, () => {
  const renderHook = renderHookWithProviders();

  beforeEach(() => {
    setUseUserReturn(mockLoadingUser);
    mockRouter.setCurrentUrl("/original");
  });

  describe("when the user is not logged in", () => {
    beforeEach(() => {
      setUseUserReturn(mockLoggedOut);
    });

    it("does nothing", async () => {
      renderHook(useRequireOnboarding);

      expect(mockRouter.pathname).toEqual("/original");
    });
  });

  describe("when the user is logged in", () => {
    describe("and the user has completed onboarding", () => {
      beforeEach(() => {
        setUseUserReturn(mockLoggedIn);
      });

      it("does nothing", () => {
        renderHook(useRequireOnboarding);

        expect(mockRouter.pathname).toEqual("/original");
      });
    });

    describe("and the user has not completed onboarding", () => {
      beforeEach(() => {
        setUseUserReturn({
          ...mockLoggedIn,
          user: {
            ...mockLoggedIn.user,
            publicMetadata: { owa: { isOnboarded: false } },
          },
        });
      });

      it("redirects to the onboarding page", () => {
        renderHook(useRequireOnboarding);

        expect(mockRouter.pathname).toEqual("/onboarding");
        expect(mockRouter.query.returnTo).toEqual("/original");
      });

      it.each(["/onboarding", "/onboarding/foo", "/404", "/500"])(
        "does not redirect when the user is at %p",
        (route) => {
          mockRouter.setCurrentUrl(route);

          renderHook(useRequireOnboarding);

          expect(mockRouter.pathname).toEqual(route);
        },
      );
    });
  });
});
