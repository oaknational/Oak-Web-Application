import { screen } from "@testing-library/dom";
import { act } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";

import { LessonDownloads } from "./LessonDownloads.view";

import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoggedIn,
  mockLoggedOut,
  mockTeacherUserWithDownloadAccess,
  mockUserWithoutDownloadAccess,
} from "@/__tests__/__helpers__/mockUser";
import lessonDownloadsFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonDownloads.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { resolveOakHref } from "@/common-lib/urls";

const renderWithProvidersFn = renderWithProviders();

// The HubSpot sync effect resolves asynchronously, so flush it inside act()
const render = async (ui: React.ReactElement) => {
  let result!: ReturnType<typeof renderWithProvidersFn>;
  await act(async () => {
    result = renderWithProvidersFn(ui);
  });
  return result;
};

const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn(() => ({
    replace: mockReplace,
  })),
}));

// This view fetches HubSpot contacts and probes download URLs on mount.
fetchMock.doMock();

beforeEach(() => {
  mockReplace.mockClear();
});

const lesson = lessonDownloadsFixture({
  lessonTitle: "The meaning of time",
});

const breadcrumbsSlot = <></>;

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
    await render(
      <LessonDownloads lesson={lesson} breadcrumbsSlot={breadcrumbsSlot} />,
    );

    const schoolSelection = screen.getByLabelText("School (required)");

    expect(schoolSelection).toBeInTheDocument();
  });
  it("should not show details when fully onboarded", async () => {
    setUseUserReturn({
      ...mockLoggedIn,
      user: mockTeacherUserWithDownloadAccess,
    });
    const result = await render(
      <LessonDownloads lesson={lesson} breadcrumbsSlot={breadcrumbsSlot} />,
    );

    expect(
      result.queryByLabelText("School (required)"),
    ).not.toBeInTheDocument();
  });

  it.each([
    { geoRestricted: true, loginRequired: false },
    { geoRestricted: false, loginRequired: true },
    { geoRestricted: true, loginRequired: true },
  ])(
    "should show LoginRequired button and hide download button & form when not logged in (geoRestricted: $geoRestricted, loginRequired: $loginRequired)",
    async ({ geoRestricted, loginRequired }) => {
      setUseUserReturn(mockLoggedOut);
      const { queryByText, getByRole, queryByRole } = await render(
        <LessonDownloads
          lesson={{ ...lesson, geoRestricted, loginRequired }}
          breadcrumbsSlot={breadcrumbsSlot}
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
    },
  );

  it("should not show LoginRequired button when logged in", async () => {
    setUseUserReturn({
      ...mockLoggedIn,
      user: mockTeacherUserWithDownloadAccess,
    });
    const { queryByRole } = await render(
      <LessonDownloads
        lesson={restrictedLesson}
        breadcrumbsSlot={breadcrumbsSlot}
      />,
    );

    const loginRequiredButton = queryByRole("button", {
      name: "Sign in to continue",
    });

    expect(loginRequiredButton).not.toBeInTheDocument();
  });

  it("should show LessonDownloadRegionBlocked instead of copyright banner when logged in but not region authorised", async () => {
    setUseUserReturn({ ...mockLoggedIn, user: mockUserWithoutDownloadAccess });
    const { queryByRole, getByText, queryByTestId } = await render(
      <LessonDownloads
        lesson={restrictedLesson}
        breadcrumbsSlot={breadcrumbsSlot}
      />,
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

describe("With downloads page experiment feature flag", () => {
  it("should render the downloads accordion when with-accordion variant is active", async () => {
    const { queryByText } = await render(
      <LessonDownloads lesson={lesson} breadcrumbsSlot={breadcrumbsSlot} />,
    );

    const downloadsAccordion = queryByText("All resources selected");

    expect(downloadsAccordion).toBeInTheDocument();
  });
});

describe("Download success redirect", () => {
  it("renders the standard downloads page before redirecting", async () => {
    const { getByText, queryByText } = await render(
      <LessonDownloads
        lesson={lesson}
        breadcrumbsSlot={breadcrumbsSlot}
        successRedirect={resolveOakHref({
          page: "lesson-downloads-success",
          programmeSlug: "maths-primary",
          unitSlug: "u",
          lessonSlug: "l",
        })}
      />,
    );

    expect(getByText("All resources selected")).toBeInTheDocument();
    expect(queryByText(/Thanks for downloading/i)).not.toBeInTheDocument();
  });
});
