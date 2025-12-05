import { screen } from "@testing-library/dom";

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

describe("Hiding 'Your details", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedOut);
  });
  it("should show details section when not logged in", async () => {
    render(<LessonDownloads lesson={lesson} isCanonical={false} />);

    const schoolSelection = screen.getByLabelText("School (required)");

    expect(schoolSelection).toBeInTheDocument();
  });
  it("should not show details when fully onboarded", () => {
    setUseUserReturn({
      ...mockLoggedIn,
      user: mockTeacherUserWithDownloadAccess,
    });
    const result = render(
      <LessonDownloads lesson={lesson} isCanonical={false} />,
    );

    expect(
      result.queryByLabelText("School (required)"),
    ).not.toBeInTheDocument();
  });
  it("should show details with logged in but not fully onboarded ", () => {
    setUseUserReturn({
      ...mockLoggedIn,
      user: mockUserWithDownloadAccessNotOnboarded,
    });
    render(<LessonDownloads lesson={lesson} isCanonical={false} />);

    const schoolSelection = screen.getByLabelText("School (required)");

    expect(schoolSelection).toBeInTheDocument();
  });
});

describe("Complex copyright", () => {
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
    const { queryByRole, getByText, queryByTestId } = render(
      <LessonDownloads lesson={restrictedLesson} isCanonical={false} />,
    );

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
    expect(downloadButton).not.toBeInTheDocument();
    expect(copyrightRestrictionBanner).not.toBeInTheDocument();
  });
});

describe("Filtering downloads", () => {
  it("should not show resources which aren't available for download", () => {
    setUseUserReturn({
      ...mockLoggedIn,
      user: mockTeacherUserWithDownloadAccess,
    });

    const lessonWithUnavailableDownloads = lessonDownloadsFixture({
      lessonTitle: "Test lesson",
      downloads: [
        {
          type: "presentation",
          exists: true,
          label: "Lesson slides",
          ext: "PDF",
          inGcsBucket: true,
          forbidden: false,
        },
        {
          type: "worksheet-pdf",
          exists: false, // doesn't exist
          label: "Worksheet",
          ext: "PDF",
        },
        {
          type: "exit-quiz-questions",
          exists: true,
          label: "Exit quiz questions",
          ext: "PDF",
          forbidden: true, // forbidden
        },
        {
          type: "exit-quiz-answers",
          exists: true,
          label: "Exit quiz answers",
          ext: "PDF",
          inGcsBucket: false, // not in GCS bucket
        },
      ],
    });

    const { queryByText } = render(
      <LessonDownloads
        lesson={lessonWithUnavailableDownloads}
        isCanonical={false}
      />,
    );

    expect(queryByText("Lesson slides")).toBeInTheDocument();

    expect(queryByText("Worksheet")).not.toBeInTheDocument();
    expect(queryByText("Exit quiz questions")).not.toBeInTheDocument();
    expect(queryByText("Exit quiz answers")).not.toBeInTheDocument();
  });
});

describe("With downloads page experiment feature flag", () => {
  it("should render the downloads accordion when with-accordion variant is active", () => {
    const { queryByText } = render(
      <LessonDownloads lesson={lesson} isCanonical={false} />,
    );

    const downloadsAccordion = queryByText("All resources selected");

    expect(downloadsAccordion).toBeInTheDocument();
  });
});
