import mockRouter from "next-router-mock";
import { act } from "react-dom/test-utils";
import { useUser } from "@clerk/nextjs";

import { useRequireOnboarding } from "./useRequireOnboarding";

import { renderHookWithProviders } from "@/__tests__/__helpers__/renderWithProviders";
import * as featureFlaggedClerk from "@/context/FeatureFlaggedClerk/FeatureFlaggedClerk";

jest.mock("@/context/FeatureFlaggedClerk/FeatureFlaggedClerk");

type UseUserReturn = ReturnType<typeof useUser>;

describe(useRequireOnboarding, () => {
  const renderHook = renderHookWithProviders();

  let useUserReturn: UseUserReturn = {
    isLoaded: true,
    isSignedIn: false,
    user: null,
  };

  beforeEach(() => {
    jest.spyOn(featureFlaggedClerk, "useFeatureFlaggedClerk").mockReturnValue({
      ...featureFlaggedClerk.fakeClerkApi,
      useUser() {
        return useUserReturn;
      },
    });

    mockRouter.setCurrentUrl("/original");
  });

  describe("when the user is not logged in", () => {
    beforeEach(() => {
      useUserReturn = {
        isLoaded: true,
        isSignedIn: false,
        user: null,
      };
    });

    it("does nothing", async () => {
      await act(async () => {
        await renderHook(useRequireOnboarding);
      });

      expect(mockRouter.pathname).toEqual("/original");
    });
  });

  describe("when the user is logged in", () => {
    describe("and the user has completed onboarding", () => {
      beforeEach(() => {
        useUserReturn = {
          isLoaded: true,
          isSignedIn: true,
          user: { publicMetadata: { "owa:onboarded": true } },
        } as unknown as UseUserReturn;
      });

      it("does nothing", () => {
        renderHook(useRequireOnboarding);

        expect(mockRouter.pathname).toEqual("/original");
      });
    });

    describe("and the user has not completed onboarding", () => {
      beforeEach(() => {
        useUserReturn = {
          isLoaded: true,
          isSignedIn: true,
          user: { publicMetadata: {} },
        } as UseUserReturn;
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
