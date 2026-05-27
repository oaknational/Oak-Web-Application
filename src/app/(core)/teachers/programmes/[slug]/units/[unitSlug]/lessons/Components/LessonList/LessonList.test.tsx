import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";

import LessonList from "./LessonList";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { resolveOakHref } from "@/common-lib/urls";
import lessonListingFixture, {
  lessonsWithUnpublishedContent,
} from "@/node-lib/curriculum-api-2023/fixtures/lessonListing.fixture";

const render = renderWithProviders();

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
  unitIndex: 2,
  unitCount: 12,
  lessonCount: 3,
  lessons: fixtureData.lessons,
};

describe("LessonList", () => {
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

  it("renders headerCtaSlot when provided", () => {
    render(
      <LessonList
        {...defaultProps}
        headerCtaSlot={<button type="button">Custom header action</button>}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Custom header action" }),
    ).toBeInTheDocument();
  });

  it("renders 'current lesson' text on current lesson item", () => {
    render(<LessonList {...defaultProps} selectedLessonIndex={1} />);

    expect(screen.queryByText("Current lesson")).toBeInTheDocument();
  });
});
