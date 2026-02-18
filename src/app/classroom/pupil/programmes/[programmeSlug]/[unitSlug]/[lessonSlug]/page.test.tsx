import React from "react";
import { AuthCookieKeys } from "@oaknational/google-classroom-addon/ui";

import Page from "./page";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { googleClassroomApi } from "@/browser-lib/google-classroom";

const useRouterMock = jest.fn();
const useSearchParamsMock = jest.fn();
const useParamsMock = jest.fn();
const withAuthMock = jest.fn();
const mockVerifySessionInner = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => useRouterMock(),
  useSearchParams: () => useSearchParamsMock(),
  useParams: () => useParamsMock(),
}));

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  WithGoogleClassroomAuth: (props: never) => {
    withAuthMock(props);
    const { children } = props;
    return <div data-testid="auth-wrapper">{children}</div>;
  },
  AuthCookieKeys: {
    PupilAccessToken: "oak-gclassroom-pupil-token",
    PupilSession: "oak-gclassroom-pupil-session",
  },
}));

jest.mock("@/browser-lib/google-classroom", () => ({
  googleClassroomApi: {
    verifySession: jest.fn(() => mockVerifySessionInner),
  },
}));

describe("src/app/classroom/pupil/programmes/[programmeSlug]/[unitSlug]/[lessonSlug]/page", () => {
  const routerPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouterMock.mockReturnValue({ push: routerPush });
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams("login_hint=123456789&itemId=123"),
    );
    useParamsMock.mockReturnValue({
      programmeSlug: "maths-primary",
      unitSlug: "unit-1",
      lessonSlug: "lesson-1",
    });
  });

  it("passes verifySession with isPupil=true to WithGoogleClassroomAuth", () => {
    renderWithTheme(<Page />);

    expect(googleClassroomApi.verifySession).toHaveBeenCalledWith(true);
    expect(withAuthMock).toHaveBeenCalledWith(
      expect.objectContaining({
        verifySessionAction: mockVerifySessionInner,
      }),
    );
  });

  it("passes correct sign-in URL with slug params", () => {
    renderWithTheme(<Page />);

    expect(withAuthMock).toHaveBeenCalledWith(
      expect.objectContaining({
        signInUrl:
          "/classroom/pupil/sign-in?programmeSlug=maths-primary&unitSlug=unit-1&lessonSlug=lesson-1",
      }),
    );
  });

  it("passes pupil cookie keys", () => {
    renderWithTheme(<Page />);

    expect(withAuthMock).toHaveBeenCalledWith(
      expect.objectContaining({
        cookieKeys: [
          AuthCookieKeys.PupilAccessToken,
          AuthCookieKeys.PupilSession,
        ],
      }),
    );
  });

  it("redirects to pupil lesson page on verify success", () => {
    renderWithTheme(<Page />);

    const authProps = withAuthMock.mock.calls[0][0];
    authProps.onVerifySuccess();

    expect(routerPush).toHaveBeenCalledWith(
      "/pupils/programmes/maths-primary/units/unit-1/lessons/lesson-1?login_hint=123456789&itemId=123",
    );
  });

  it("handles empty search params in redirect", () => {
    useSearchParamsMock.mockReturnValue(new URLSearchParams(""));

    renderWithTheme(<Page />);

    const authProps = withAuthMock.mock.calls[0][0];
    authProps.onVerifySuccess();

    expect(routerPush).toHaveBeenCalledWith(
      "/pupils/programmes/maths-primary/units/unit-1/lessons/lesson-1?",
    );
  });
});
