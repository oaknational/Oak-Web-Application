import React from "react";

import Page from "./page";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { googleClassroomApi } from "@/browser-lib/google-classroom";

const useRouterMock = jest.fn();
const useSearchParamsMock = jest.fn();
const googleSignInViewMock = jest.fn();
const getGoogleSignInUrlMock = jest.fn();
const trackSignInStartedMock = jest.fn();
const trackSignInCompletedMock = jest.fn();

const googleClassroomAnalyticsMock = {
  trackSignInStarted: trackSignInStartedMock,
  trackSignInCompleted: trackSignInCompletedMock,
};

jest.mock("@/components/GoogleClassroom/useGoogleClassroomAnalytics", () => ({
  __esModule: true,
  useGoogleClassroomAnalytics: (
    selector?: (state: typeof googleClassroomAnalyticsMock) => unknown,
  ) =>
    selector
      ? selector(googleClassroomAnalyticsMock)
      : googleClassroomAnalyticsMock,
}));

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => useRouterMock(),
  useSearchParams: () => useSearchParamsMock(),
}));

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  GoogleSignInView: (props: never) => {
    googleSignInViewMock(props);
    return <div data-testid="sign-in-view">Sign In</div>;
  },
}));

jest.mock("@/browser-lib/google-classroom", () => ({
  googleClassroomApi: {
    getGoogleSignInUrl: jest.fn(),
  },
}));

describe("src/app/classroom/sign-in/page", () => {
  const routerPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (googleClassroomApi.getGoogleSignInUrl as jest.Mock) =
      getGoogleSignInUrlMock;
    useRouterMock.mockReturnValue({ push: routerPush });
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams("login_hint=123456789&courseId=gc-1"),
    );
    getGoogleSignInUrlMock.mockResolvedValue("https://example.com");
  });

  it("provides GoogleSignInView with API driven callbacks", async () => {
    renderWithTheme(<Page />);

    const viewProps = googleSignInViewMock.mock.calls[0][0];

    await viewProps.getGoogleSignInLink();
    expect(getGoogleSignInUrlMock).toHaveBeenCalledWith("123456789", undefined);
    expect(trackSignInStartedMock).toHaveBeenCalledWith({
      analyticsUseCase: "Teacher",
    });

    viewProps.onSuccessfulSignIn();
    expect(trackSignInCompletedMock).toHaveBeenCalledWith({
      analyticsUseCase: "Teacher",
      subscribeToNewsletter: false,
    });
    expect(routerPush).toHaveBeenCalledWith(
      "/classroom/browse?login_hint=123456789&courseId=gc-1",
    );
    expect(viewProps.privacyPolicyUrl).toBe("/legal/privacy-policy");
  });

  it("redirects to decoded redirecturi when present", () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams(
        "redirecturi=%2Fclassroom%2Fpupil%2Fresults%2Fprintable%3FloginHint%3Dabc%26courseId%3Dgc-1%26itemId%3Ditem-1",
      ),
    );

    renderWithTheme(<Page />);

    const viewProps = googleSignInViewMock.mock.calls[0][0];
    viewProps.onSuccessfulSignIn();

    expect(routerPush).toHaveBeenCalledWith(
      "/classroom/pupil/results/printable?loginHint=abc&courseId=gc-1&itemId=item-1",
    );
  });

  it("falls back to current query params when redirecturi is not present", async () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams(""));

    renderWithTheme(<Page />);

    const viewProps = googleSignInViewMock.mock.calls[0][0];
    await viewProps.getGoogleSignInLink();
    expect(getGoogleSignInUrlMock).toHaveBeenCalledWith(null, undefined);
    expect(trackSignInStartedMock).toHaveBeenCalledWith({
      analyticsUseCase: "Teacher",
    });

    viewProps.onSuccessfulSignIn();
    expect(routerPush).toHaveBeenCalledWith("/classroom/browse?");
  });
});
