import React from "react";
import { AuthCookieKeys } from "@oaknational/google-classroom-addon/ui";

import Page from "./page";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { googleClassroomApi } from "@/browser-lib/google-classroom";

const useRouterMock = jest.fn();
const useSearchParamsMock = jest.fn();
const googleSignInViewMock = jest.fn();
const getGoogleSignInUrlMock = jest.fn();

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
  AuthCookieKeys: {
    PupilAccessToken: "oak-gclassroom-pupil-token",
    PupilSession: "oak-gclassroom-pupil-session",
  },
}));

jest.mock("@/browser-lib/google-classroom", () => ({
  googleClassroomApi: {
    getGoogleSignInUrl: jest.fn(),
  },
}));

describe("src/app/classroom/pupil/sign-in/page", () => {
  const routerPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (googleClassroomApi.getGoogleSignInUrl as jest.Mock) =
      getGoogleSignInUrlMock;
    useRouterMock.mockReturnValue({ push: routerPush });
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams(
        "login_hint=pupil@school.com&programmeSlug=maths-primary&unitSlug=unit-1&lessonSlug=lesson-1",
      ),
    );
    getGoogleSignInUrlMock.mockResolvedValue("https://example.com");
  });

  it("provides GoogleSignInView with isPupil=true for the sign-in link", async () => {
    renderWithTheme(<Page />);

    const viewProps = googleSignInViewMock.mock.calls[0][0];

    await viewProps.getGoogleSignInLink();
    expect(getGoogleSignInUrlMock).toHaveBeenCalledWith(
      "pupil@school.com",
      true,
    );
  });

  it("provides correct props to GoogleSignInView", () => {
    renderWithTheme(<Page />);

    const viewProps = googleSignInViewMock.mock.calls[0][0];
    expect(viewProps.privacyPolicyUrl).toBe("/legal/privacy-policy");
    expect(viewProps.showMailingListOption).toBe(false);
    expect(viewProps.cookieKeys).toEqual([
      AuthCookieKeys.PupilAccessToken,
      AuthCookieKeys.PupilSession,
    ]);
  });

  it("redirects to pupil lesson page on successful sign in when slugs are present", () => {
    renderWithTheme(<Page />);

    const viewProps = googleSignInViewMock.mock.calls[0][0];
    viewProps.onSuccessfulSignIn();

    expect(routerPush).toHaveBeenCalledWith(
      "/pupils/programmes/maths-primary/units/unit-1/lessons/lesson-1?login_hint=pupil%40school.com&programmeSlug=maths-primary&unitSlug=unit-1&lessonSlug=lesson-1",
    );
  });

  it("does not redirect when slug params are missing", () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams("login_hint=pupil@school.com"),
    );

    renderWithTheme(<Page />);

    const viewProps = googleSignInViewMock.mock.calls[0][0];
    viewProps.onSuccessfulSignIn();

    expect(routerPush).not.toHaveBeenCalled();
  });

  it("falls back to null login_hint when not present", async () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams(""));

    renderWithTheme(<Page />);

    const viewProps = googleSignInViewMock.mock.calls[0][0];
    await viewProps.getGoogleSignInLink();
    expect(getGoogleSignInUrlMock).toHaveBeenCalledWith(null, true);
  });
});
