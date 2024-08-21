import mockRouter from "next-router-mock";
import { act } from "react-dom/test-utils";

import { useRequireOnboarding } from "./useRequireOnboarding";

import { renderHookWithProviders } from "@/__tests__/__helpers__/renderWithProviders";
import * as featureFlaggedClerk from "@/context/FeatureFlaggedClerk/FeatureFlaggedClerk";
import {
  mockLoadingUser,
  mockLoggedIn,
  mockLoggedOut,
} from "@/__tests__/__helpers__/mockUser";

jest.mock("@/context/FeatureFlaggedClerk/FeatureFlaggedClerk");

describe(useRequireOnboarding, () => {
  const renderHook = renderHookWithProviders();

  let useUserReturn = mockLoadingUser;

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
      useUserReturn = mockLoggedOut;
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
          ...mockLoggedIn,
          user: {
            ...mockLoggedIn.user,
            publicMetadata: { owa: { isOnboarded: true } },
          },
        };
      });

      it("does nothing", () => {
        renderHook(useRequireOnboarding);

        expect(mockRouter.pathname).toEqual("/original");
      });
    });

    describe("and the user has not completed onboarding", () => {
      beforeEach(() => {
        useUserReturn = mockLoggedIn;
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
