import React from "react";
import { AuthCookieKeys } from "@oaknational/google-classroom-addon/ui";

import Page from "./layout";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { googleClassroomApi } from "@/browser-lib/google-classroom";

const useSearchParamsMock = jest.fn();
const useParamsMock = jest.fn();
const withAuthMock = jest.fn();
const mockVerifySessionInner = jest.fn();

jest.mock("next/navigation", () => ({
  __esModule: true,
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
    AccessToken: "oak-gclassroom-access-token",
    Session: "oak-gclassroom-session",
  },
}));

jest.mock("@/browser-lib/google-classroom", () => ({
  googleClassroomApi: {
    verifySession: jest.fn(() => mockVerifySessionInner),
  },
}));

describe("src/app/classroom/pupil/programmes/[programmeSlug]/[unitSlug]/[lessonSlug]/results/printable/layout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams("loginHint=abc&courseId=123&itemId=456"),
    );
    useParamsMock.mockReturnValue({
      programmeSlug: "maths-primary",
      unitSlug: "unit-1",
      lessonSlug: "lesson-1",
    });
  });

  it("passes verifySession to WithGoogleClassroomAuth", () => {
    renderWithTheme(
      <Page>
        <div>Child content</div>
      </Page>,
    );

    expect(googleClassroomApi.verifySession).toHaveBeenCalledWith();
    expect(withAuthMock).toHaveBeenCalledWith(
      expect.objectContaining({
        verifySessionAction: mockVerifySessionInner,
      }),
    );
  });

  it("builds sign-in URL with encoded redirecturi containing all params", () => {
    renderWithTheme(
      <Page>
        <div>Child content</div>
      </Page>,
    );

    const authProps = withAuthMock.mock.calls[0][0];
    const signInUrl = authProps.signInUrl as string;

    const parsed = new URL(`http://localhost${signInUrl}`);
    const redirectUri = parsed.searchParams.get("redirecturi");

    expect(redirectUri).not.toBeNull();
    expect(decodeURIComponent(redirectUri!)).toBe(
      "/classroom/pupil/programmes/maths-primary/unit-1/lesson-1/results/printable?loginHint=abc&courseId=123&itemId=456",
    );
  });

  it("passes auth cookie keys", () => {
    renderWithTheme(
      <Page>
        <div>Child content</div>
      </Page>,
    );

    expect(withAuthMock).toHaveBeenCalledWith(
      expect.objectContaining({
        cookieKeys: [AuthCookieKeys.AccessToken, AuthCookieKeys.Session],
      }),
    );
  });
});
