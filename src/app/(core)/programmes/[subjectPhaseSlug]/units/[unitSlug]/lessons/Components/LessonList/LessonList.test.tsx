import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import clerk from "@clerk/nextjs";

import LessonList from "./LessonList";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { resolveOakHref } from "@/common-lib/urls";
import lessonListingFixture, {
  lessonsWithUnpublishedContent,
} from "@/node-lib/curriculum-api-2023/fixtures/lessonListing.fixture";
import { mockLoggedIn, mockLoggedOut } from "@/__tests__/__helpers__/mockUser";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";

const render = renderWithProviders();

const saveUnitButtonMock = jest.fn();
jest.mock(
  "@/components/TeacherComponents/SaveUnitButton/SaveUnitButton",
  () => ({
    SaveUnitButton: (props: unknown) => {
      saveUnitButtonMock(props);
      return <button type="button">Save unit</button>;
    },
  }),
);

const unitDownloadButtonMock = jest.fn();
jest.mock(
  "@/components/TeacherComponents/UnitDownloadButton/UnitDownloadButton",
  () => {
    return {
      __esModule: true,
      default: function Default(props: unknown) {
        unitDownloadButtonMock(props);
        const { isSignedIn } = clerk.useUser();

        const buttonText = isSignedIn
          ? "Download (.zip 5MB)"
          : "Download complete unit";

        return <button type="button">{buttonText}</button>;
      },
      useUnitDownloadButtonState: () => ({
        setShowDownloadMessage: jest.fn(),
        setDownloadError: jest.fn(),
        setDownloadInProgress: jest.fn(),
        downloadInProgress: false,
        setShowIncompleteMessage: jest.fn(),
      }),
    };
  },
);

type LessonListProps = ComponentProps<typeof LessonList>;

const fixtureData = lessonListingFixture({
  programmeSlug: "biology-secondary-ks3",
  unitSlug: "cells",
  unitTitle: "Cells",
  subjectSlug: "biology",
  subjectTitle: "Biology",
  keyStageSlug: "ks3",
  keyStageTitle: "Key Stage 3",
  lessons: [
    {
      ...lessonsWithUnpublishedContent[0],
      lessonSlug: "lesson-1",
      lessonTitle: "Introduction to cells",
      description: "Description 1",
      pupilLessonOutcome: "I can describe a cell",
      geoRestricted: false,
      loginRequired: false,
      isUnpublished: false,
      lessonReleaseDate: null,
      expired: false,
    },
    {
      ...lessonsWithUnpublishedContent[2],
      lessonSlug: "lesson-2",
      lessonTitle: "Cell structure",
      description: "Description 2",
      pupilLessonOutcome: "I can identify cell parts",
      geoRestricted: true,
      loginRequired: false,
      isUnpublished: false,
      lessonReleaseDate: null,
      expired: false,
    },
    {
      ...lessonsWithUnpublishedContent[1],
      lessonSlug: "lesson-3",
      lessonTitle: "Coming soon lesson",
      isUnpublished: true,
      lessonReleaseDate: null,
      expired: false,
    },
  ],
});

const defaultProps: LessonListProps = {
  programmeSlug: fixtureData.programmeSlug,
  unitSlug: fixtureData.unitSlug,
  unitTitle: fixtureData.unitTitle,
  unitDescription: "Learn about cells",
  subjectTitle: fixtureData.subjectTitle,
  subjectSlug: fixtureData.subjectSlug,
  keyStageSlug: fixtureData.keyStageSlug,
  keyStageTitle: fixtureData.keyStageTitle,
  unitIndex: 2,
  unitCount: 12,
  lessonCount: 3,
  lessons: fixtureData.lessons,
};

describe("LessonList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders unit and lesson summary content", () => {
    render(<LessonList {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: "Unit 2 of 12: Cells" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Learn about cells")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "3 lessons in unit" }),
    ).toBeInTheDocument();
  });

  it("renders links for published lessons and resolves hrefs", () => {
    render(<LessonList {...defaultProps} />);

    const firstLessonLink = screen.getByRole("link", {
      name: /Introduction to cells/i,
    });
    const secondLessonLink = screen.getByRole("link", {
      name: /Cell structure/i,
    });

    expect(firstLessonLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "integrated-lesson-overview",
        programmeSlug: defaultProps.programmeSlug,
        unitSlug: defaultProps.unitSlug,
        lessonSlug: "lesson-1",
      }),
    );
    expect(secondLessonLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "integrated-lesson-overview",
        programmeSlug: defaultProps.programmeSlug,
        unitSlug: defaultProps.unitSlug,
        lessonSlug: "lesson-2",
      }),
    );
  });

  it("renders copyrighted tag for restricted lessons", () => {
    render(<LessonList {...defaultProps} />);

    expect(screen.getByText("Copyrighted")).toBeInTheDocument();
    expect(screen.getByText("I can identify cell parts")).toBeInTheDocument();
  });

  it("shows coming soon and disables linking for unpublished lessons", () => {
    render(<LessonList {...defaultProps} />);

    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Coming soon lesson/i }),
    ).not.toBeInTheDocument();
  });

  it("passes save button tracking props", () => {
    render(<LessonList {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: "Save unit" }),
    ).toBeInTheDocument();
    expect(saveUnitButtonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        programmeSlug: "biology-secondary-ks3",
        unitSlug: "cells",
        unitTitle: "Cells",
        buttonVariant: "default",
        trackingProps: expect.objectContaining({
          savedFrom: "lesson_listing_save_button",
          keyStageTitle: "Key Stage 3",
          keyStageSlug: "ks3",
          subjectTitle: "Biology",
          subjectSlug: "biology",
        }),
      }),
    );
  });
  it("it renders unit count", () => {
    const { getByTestId } = render(<LessonList {...defaultProps} />);
    const unitCount = getByTestId("unit-count");

    expect(unitCount).toBeInTheDocument();
  });
  it("it does not render unit count when showUnitCount is false", () => {
    const { queryByTestId } = render(
      <LessonList {...defaultProps} showUnitCount={false} />,
    );
    const unitCount = queryByTestId("unit-count");

    expect(unitCount).not.toBeInTheDocument();
  });
  it("it does not render unit description", () => {
    render(<LessonList {...defaultProps} unitDescription={null} />);

    expect(screen.queryByText("Learn about cells")).not.toBeInTheDocument();
  });
  it("renders 'current lesson' text on current lesson item", () => {
    render(<LessonList {...defaultProps} selectedLessonIndex={1} />);

    expect(screen.queryByText("Current lesson")).toBeInTheDocument();
  });
  it("renders download button when showUnitDownloadButton is true", () => {
    setUseUserReturn(mockLoggedIn);
    render(
      <LessonList
        {...defaultProps}
        showUnitDownloadButton={true}
        isGeorestrictedUnit={true}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Download (.zip 5MB)" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Save unit" }),
    ).not.toBeInTheDocument();
  });
  it("passes download button correct props", () => {
    render(<LessonList {...defaultProps} showUnitDownloadButton={true} />);

    expect(unitDownloadButtonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        unitFileId: "biology-secondary-ks3-cells",
        showNewTag: false,
        geoRestricted: false,
      }),
    );
  });
  it("renders save button when showUnitDownloadButton is false", () => {
    render(<LessonList {...defaultProps} showUnitDownloadButton={false} />);

    expect(
      screen.getByRole("button", { name: "Save unit" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Download (.zip 5MB)" }),
    ).not.toBeInTheDocument();
  });
  it("renders logged out unit download button text", () => {
    setUseUserReturn(mockLoggedOut);
    render(<LessonList {...defaultProps} showUnitDownloadButton={true} />);

    expect(
      screen.queryByRole("button", { name: "Download complete unit" }),
    ).toBeInTheDocument();
  });
});
