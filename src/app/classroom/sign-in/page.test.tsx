import React from "react";

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
    expect(getGoogleSignInUrlMock).toHaveBeenCalledWith("123456789");

    viewProps.onSuccessfulSignIn();
    expect(routerPush).toHaveBeenCalledWith(
      "/classroom/browse?login_hint=123456789&courseId=gc-1",
    );
    expect(viewProps.privacyPolicyUrl).toBe("/legal/privacy-policy");
  });

  it("falls back to empty query params when not present", async () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams(""));

    renderWithTheme(<Page />);

    const viewProps = googleSignInViewMock.mock.calls[0][0];
    await viewProps.getGoogleSignInLink();
    expect(getGoogleSignInUrlMock).toHaveBeenCalledWith(null);

    viewProps.onSuccessfulSignIn();
    expect(routerPush).toHaveBeenCalledWith("/classroom/browse?");
  });
});
