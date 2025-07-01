import LessonOverviewSideNavAnchorLinks from "./LessonOverviewSideNavAnchorLinks";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const links = [
  { label: "Lesson Guide", anchorId: "lesson-guide" },
  { label: "Lesson Details", anchorId: "lesson-details" },
  { label: "Worksheet", anchorId: "worksheet" },
  { label: "Slides", anchorId: "slides" },
];

describe("LessonOverviewSideNavAnchorLinks", () => {
  it("should render the links correctly when contentRestricted is false", () => {
    const { getByText } = renderWithTheme(
      <LessonOverviewSideNavAnchorLinks
        contentRestricted={false}
        links={links}
        currentSectionId="link1"
      />,
    );

    expect(getByText("Worksheet")).toBeInTheDocument();
    expect(getByText("Lesson Guide")).toBeInTheDocument();
  });

  it("should redirect restricted links to restricted-content anchor", () => {
    const { container } = renderWithTheme(
      <LessonOverviewSideNavAnchorLinks
        contentRestricted={true}
        links={links}
        currentSectionId="worksheet"
      />,
    );

    const lessonGuideLink = container.querySelector('a[href="#lesson-guide"]');
    const lessonDetailsLink = container.querySelector(
      'a[href="#lesson-details"]',
    );
    const worksheetLink = container.querySelector(
      'a[href="#restricted-content"]',
    );
    const slidesLink = container.querySelector('a[href="#restricted-content"]');

    // Lesson guide and lesson details should not be restricted
    expect(lessonGuideLink).toBeInTheDocument();
    expect(lessonDetailsLink).toBeInTheDocument();

    // Other content should be redirected to restricted-content
    expect(worksheetLink).toBeInTheDocument();
    expect(slidesLink).toBeInTheDocument();
  });
});
