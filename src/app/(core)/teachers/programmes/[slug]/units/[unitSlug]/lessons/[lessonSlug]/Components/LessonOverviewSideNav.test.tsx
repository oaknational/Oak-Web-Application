import { screen } from "@testing-library/react";

import LessonOverviewSideNav from "./LessonOverviewSideNav";
import { CurrentSectionIdProvider } from "./CurrentSectionIdProvider";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

const links = [
  { label: "Lesson Guide", anchorId: "lesson-guide" },
  { label: "Lesson Details", anchorId: "lesson-details" },
  { label: "Worksheet", anchorId: "worksheet" },
  { label: "Slides", anchorId: "slides" },
];

const downloadAllButtonProps = {
  lessonSlug: "test-lesson",
  unitSlug: "test-unit",
  programmeSlug: "test-programme",
  expired: false,
  showDownloadAll: false,
  isCanonical: false,
  geoRestricted: false,
  loginRequired: false,
  unitTitle: "Test Unit",
};

const defaultProps = {
  contentRestricted: false,
  links,
  downloadAllButtonProps,
};

describe("LessonOverviewSideNav", () => {
  it("renders side navigation anchor links correctly", () => {
    render(
      <CurrentSectionIdProvider>
        <LessonOverviewSideNav {...defaultProps} />
      </CurrentSectionIdProvider>,
    );

    expect(
      screen.getByRole("navigation", { name: "page navigation" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Lesson Guide")).toBeInTheDocument();
    expect(screen.getByText("Lesson Details")).toBeInTheDocument();
    expect(screen.getByText("Worksheet")).toBeInTheDocument();
    expect(screen.getByText("Slides")).toBeInTheDocument();
  });

  it("does not render TeachWithOakPromoSection when showPromoSection is false", () => {
    render(
      <CurrentSectionIdProvider>
        <LessonOverviewSideNav {...defaultProps} showPromoSection={false} />
      </CurrentSectionIdProvider>,
    );

    expect(
      screen.queryByText(
        "Ever wondered why our lessons are structured this way?",
      ),
    ).not.toBeInTheDocument();
  });

  it("renders TeachWithOakPromoSection when showPromoSection is true", () => {
    render(
      <CurrentSectionIdProvider>
        <LessonOverviewSideNav {...defaultProps} showPromoSection />
      </CurrentSectionIdProvider>,
    );

    expect(
      screen.getByText(
        "Ever wondered why our lessons are structured this way?",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("See the thinking")).toBeInTheDocument();
  });
});
