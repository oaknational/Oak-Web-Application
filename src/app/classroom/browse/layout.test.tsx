import React from "react";

import Page from "./layout";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { googleClassroomApi } from "@/browser-lib/google-classroom";

const withAuthMock = jest.fn();
const browseLayoutMock = jest.fn();

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  WithGoogleClassroomAuth: (props: never) => {
    withAuthMock(props);
    const { children } = props;
    return <div data-testid="auth-wrapper">{children}</div>;
  },
  BrowseLayout: (props: never) => {
    browseLayoutMock(props);
    const { children } = props;
    return <div data-testid="browse-layout">{children}</div>;
  },
}));

jest.mock("@/browser-lib/google-classroom", () => ({
  googleClassroomApi: {
    verifySession: jest.fn(),
    createAttachment: jest.fn(),
  },
}));

describe("src/app/classroom/browse/layout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("layout renders auth and browse components", () => {
    renderWithTheme(
      <Page>
        <div>Child content</div>
      </Page>,
    );

    expect(withAuthMock).toHaveBeenCalledWith(
      expect.objectContaining({
        verifySessionAction: googleClassroomApi.verifySession,
        signInUrl: "/classroom/sign-in",
      }),
    );

    expect(browseLayoutMock).toHaveBeenCalledWith(
      expect.objectContaining({
        createAttachmentAction: googleClassroomApi.createAttachment,
      }),
    );
  });
});
