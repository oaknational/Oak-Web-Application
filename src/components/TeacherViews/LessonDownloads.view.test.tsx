import { useFeatureFlagVariantKey } from "posthog-js/react";

import { LessonDownloads } from "./LessonDownloads.view";

import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoggedIn,
  mockLoggedOut,
  mockTeacherUserWithDownloadAccess,
  mockUserWithDownloadAccessNotOnboarded,
  mockUserWithoutDownloadAccess,
} from "@/__tests__/__helpers__/mockUser";
import lessonDownloadsFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonDownloads.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

const lesson = lessonDownloadsFixture({
  lessonTitle: "The meaning of time",
});

const restrictedLesson = lessonDownloadsFixture({
  lessonTitle: "The meaning of time",
  geoRestricted: true,
  loginRequired: true,
});

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: jest.fn(),
}));

describe("Hiding 'Your details", () => {
  beforeEach(() => {
    (useFeatureFlagVariantKey as jest.Mock).mockReturnValue("control");
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

  it("should show LoginRequired button and hide download button & form when not logged and geo restricted", () => {
    setUseUserReturn(mockLoggedOut);
    const { queryByText, getByRole, queryByRole } = render(
      <LessonDownloads
        lesson={{ ...lesson, geoRestricted: true, loginRequired: false }}
        isCanonical={false}
      />,
    );

    const yourDetailsHeading = queryByText("Your details");
    const downloadButton = queryByRole("button", {
      name: "Download .zip",
    });
    const loginRequiredButton = getByRole("button", {
      name: "Sign in to continue",
    });

    expect(downloadButton).not.toBeInTheDocument();
    expect(yourDetailsHeading).not.toBeInTheDocument();

    expect(loginRequiredButton).toBeInTheDocument();
  });

  it("should show LoginRequired button and hide download button & form when not logged in", () => {
    setUseUserReturn(mockLoggedOut);
    const { queryByText, getByRole, queryByRole } = render(
      <LessonDownloads
        lesson={{ ...lesson, geoRestricted: false, loginRequired: true }}
        isCanonical={false}
      />,
    );

    const yourDetailsHeading = queryByText("Your details");
    const downloadButton = queryByRole("button", {
      name: "Download .zip",
    });
    const loginRequiredButton = getByRole("button", {
      name: "Sign in to continue",
    });

    expect(downloadButton).not.toBeInTheDocument();
    expect(yourDetailsHeading).not.toBeInTheDocument();

    expect(loginRequiredButton).toBeInTheDocument();
  });

  it("should show LoginRequired button and hide download button & form when not logged and geoRestricted", () => {
    setUseUserReturn(mockLoggedOut);
    const { queryByText, getByRole, queryByRole } = render(
      <LessonDownloads
        lesson={{ ...lesson, geoRestricted: true, loginRequired: true }}
        isCanonical={false}
      />,
    );
    const yourDetailsHeading = queryByText("Your details");
    const downloadButton = queryByRole("button", {
      name: "Download .zip",
    });
    const loginRequiredButton = getByRole("button", {
      name: "Sign in to continue",
    });

    expect(downloadButton).not.toBeInTheDocument();
    expect(yourDetailsHeading).not.toBeInTheDocument();
    expect(loginRequiredButton).toBeInTheDocument();
  });

  it("should not show LoginRequired button when logged in", () => {
    setUseUserReturn({
      ...mockLoggedIn,
      user: mockTeacherUserWithDownloadAccess,
    });
    const { queryByRole } = render(
      <LessonDownloads lesson={restrictedLesson} isCanonical={false} />,
    );

    const loginRequiredButton = queryByRole("button", {
      name: "Sign in to continue",
    });

    expect(loginRequiredButton).not.toBeInTheDocument();
  });

  it("should show LessonDownloadRegionBlocked instead of copyright banner when logged in but not region authorised", () => {
    setUseUserReturn({ ...mockLoggedIn, user: mockUserWithoutDownloadAccess });
    const { queryByText, queryByRole, getByText, queryByTestId } = render(
      <LessonDownloads lesson={restrictedLesson} isCanonical={false} />,
    );

    const yourDetailsHeading = queryByText("Your details");
    const downloadButton = queryByRole("button", {
      name: "Download .zip",
    });
    const regionRestrictedMessage = getByText(
      /Sorry, downloads for this lesson are only available in the UK/,
    );

    const copyrightRestrictionBanner = queryByTestId(
      "copyright-banner-signed-out",
    );

    expect(regionRestrictedMessage).toBeInTheDocument();
    expect(yourDetailsHeading).not.toBeInTheDocument();
    expect(downloadButton).not.toBeInTheDocument();
    expect(copyrightRestrictionBanner).not.toBeInTheDocument();
  });
});

describe.only("With downloads page experiment feature flag", () => {
  it("should render the downloads accordion when with-accordion variant is active", () => {
    (useFeatureFlagVariantKey as jest.Mock).mockReturnValue("with-accordion");
    const { queryByText } = render(
      <LessonDownloads lesson={lesson} isCanonical={false} />,
    );

    const downloadsAccordion = queryByText("All resources selected");

    expect(downloadsAccordion).toBeInTheDocument();
  });
});
