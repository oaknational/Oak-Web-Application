import { renderHook } from "@testing-library/react";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import useOptionalDownloadSignIn from "./useOptionalDownloadSignIn";

import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn, mockLoggedOut } from "@/__tests__/__helpers__/mockUser";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: jest.fn(),
}));

describe("useOptionalDownloadSignIn", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("with feature flag enabled", () => {
    beforeEach(() => {
      (useFeatureFlagVariantKey as jest.Mock).mockImplementation(
        () => "with-buttons",
      );
    });

    test("should return showDownloadSignInButtons true and showTermsAgreement false for logged out user", async () => {
      setUseUserReturn(mockLoggedOut);

      const { result } = renderHook(useOptionalDownloadSignIn);

      expect(result.current).toEqual({
        showDownloadSignInButtons: true,
        showTermsAgreement: false,
        setShowTermsAgreement: expect.any(Function),
      });
    });

    test("should return showDownloadSignInButtons true and showTermsAgreement false for logged in but not onboarded user", async () => {
      setUseUserReturn({
        ...mockLoggedIn,
        user: {
          ...mockLoggedIn.user,
          publicMetadata: {
            owa: {
              isOnboarded: false,
            },
          },
        },
      });

      const { result } = renderHook(useOptionalDownloadSignIn);

      expect(result.current).toEqual({
        showDownloadSignInButtons: true,
        showTermsAgreement: false,
        setShowTermsAgreement: expect.any(Function),
      });
    });

    test("should return showDownloadSignInButtons false and showTermsAgreement false for logged in user", async () => {
      setUseUserReturn(mockLoggedIn);

      const { result } = renderHook(useOptionalDownloadSignIn);

      expect(result.current).toEqual({
        showDownloadSignInButtons: false,
        showTermsAgreement: false,
        setShowTermsAgreement: expect.any(Function),
      });
    });
  });

  describe("with feature flag disabled", () => {
    beforeEach(() => {
      (useFeatureFlagVariantKey as jest.Mock).mockImplementation(
        () => "control",
      );
    });

    test("should return showDownloadSignInButtons false and showTermsAgreement true for logged out user", async () => {
      setUseUserReturn(mockLoggedOut);

      const { result } = renderHook(useOptionalDownloadSignIn);

      expect(result.current).toEqual({
        showDownloadSignInButtons: false,
        showTermsAgreement: true,
        setShowTermsAgreement: expect.any(Function),
      });
    });
  });
});
