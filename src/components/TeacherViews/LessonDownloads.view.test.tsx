import { LessonDownloads } from "./LessonDownloads.view";

import {
  enableMockClerk,
  setUseUserReturn,
} from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoggedIn,
  mockTeacherUserWithDownloadAccess,
  mockUserWithDownloadAccessNotOnboarded,
} from "@/__tests__/__helpers__/mockUser";
import lessonDownloadsFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonDownloads.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("@/context/FeatureFlaggedClerk/FeatureFlaggedClerk");

const render = renderWithProviders();

const lesson = lessonDownloadsFixture({
  lessonTitle: "The meaning of time",
});

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: jest.fn(() => true),
}));

describe("Hiding 'Your details", () => {
  beforeEach(() => {
    enableMockClerk();
    jest.clearAllMocks();
  });
  it("should show 'Your Details' when not logged in", () => {
    const result = render(
      <LessonDownloads lesson={lesson} isCanonical={false} />,
    );

    expect(result.queryByText("Your details")).toBeInTheDocument();
  });
  it("should not show 'Your Details' when fully onboarded", () => {
    setUseUserReturn({
      ...mockLoggedIn,
      user: mockTeacherUserWithDownloadAccess,
    });
    const result = render(
      <LessonDownloads lesson={lesson} isCanonical={false} />,
    );

    expect(result.queryByText("Your details")).not.toBeInTheDocument();
  });
  it("should show 'Your Details' with logged in but not fully onboarded ", () => {
    setUseUserReturn({
      ...mockLoggedIn,
      user: mockUserWithDownloadAccessNotOnboarded,
    });
    const result = render(
      <LessonDownloads lesson={lesson} isCanonical={false} />,
    );

    expect(result.queryByText("Your details")).toBeInTheDocument();
  });
});
