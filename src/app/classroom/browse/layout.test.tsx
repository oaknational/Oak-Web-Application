import React from "react";

import Page from "./layout";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { googleClassroomApi } from "@/browser-lib/google-classroom";
import useAnalytics from "@/context/Analytics/useAnalytics";

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

const mockVerifySessionInner = jest.fn();
jest.mock("@/browser-lib/google-classroom", () => ({
  googleClassroomApi: {
    verifySession: jest.fn(() => mockVerifySessionInner),
    createAttachment: jest.fn(),
  },
}));
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("src/app/classroom/browse/layout", () => {
  const trackSpy = {
    classroomLessonsAttached: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAnalytics as jest.Mock).mockReturnValue({ track: trackSpy });
  });

  it("layout renders auth and browse components", () => {
    renderWithTheme(
      <Page>
        <div>Child content</div>
      </Page>,
    );

    expect(googleClassroomApi.verifySession).toHaveBeenCalledWith();
    expect(withAuthMock).toHaveBeenCalledWith(
      expect.objectContaining({
        verifySessionAction: mockVerifySessionInner,
        signInUrl: "/classroom/sign-in",
      }),
    );

    expect(browseLayoutMock).toHaveBeenCalledWith(
      expect.objectContaining({
        createAttachmentAction: googleClassroomApi.createAttachment,
      }),
    );
  });

  it("tracks classroom lessons attached with the classroom assignment id", () => {
    renderWithTheme(
      <Page>
        <div>Child content</div>
      </Page>,
    );

    const browseLayoutProps = browseLayoutMock.mock.calls[0][0];
    browseLayoutProps.onLessonAttached({
      googleLoginHint: "teacher-123",
      itemId: "item-1",
      courseId: "course-1",
      lessonName: "Lesson 1",
      unitName: "Unit 1",
      gradeSyncEnabled: true,
    });

    expect(trackSpy.classroomLessonsAttached).toHaveBeenCalledWith({
      googleLoginHint: "teacher-123",
      itemId: "item-1",
      courseId: "course-1",
      lessonName: "Lesson 1",
      unitName: "Unit 1",
      gradeSyncEnabled: true,
      clientEnvironment: "iframe",
      classroomAssignmentId: "course-1:item-1",
    });
  });
});
