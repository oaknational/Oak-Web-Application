import LessonOverviewSideNavAnchorLinks from "./LessonOverviewSideNavAnchorLinks";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const links = [
  { label: "Lesson Guide", anchorId: "lesson-guide" },
  { label: "Lesson Details", anchorId: "lesson-details" },
  { label: "Worksheet", anchorId: "worksheet" },
  { label: "Slides", anchorId: "slides" },
];

const downloadAllBtnProps = {
  lessonSlug: "test-lesson",
  unitSlug: "test-unit",
  programmeSlug: "test-programme",
  expired: false,
  showDownloadAll: false,
  onClickDownloadAll: jest.fn(),
  isSpecialist: false,
  isCanonical: false,
  geoRestricted: false,
  loginRequired: false,
  unitTitle: "Test Unit",
};

describe("LessonOverviewSideNavAnchorLinks", () => {
  it("should render the links correctly when contentRestricted is false", () => {
    const { getByText } = renderWithTheme(
      <LessonOverviewSideNavAnchorLinks
        contentRestricted={false}
        links={links}
        currentSectionId="link1"
        {...downloadAllBtnProps}
      />,
    );

    expect(getByText("Worksheet")).toBeInTheDocument();
    expect(getByText("Lesson Details")).toBeInTheDocument();
  });

  it("should redirect restricted links to restricted-content anchor", () => {
    const { getByText } = renderWithTheme(
      <LessonOverviewSideNavAnchorLinks
        contentRestricted={true}
        links={links}
        currentSectionId="worksheet"
        {...downloadAllBtnProps}
      />,
    );

    const lessonDetailsLink = getByText("Lesson Details").closest("a");

    const worksheetLink = getByText("Worksheet").closest("a");

    expect(lessonDetailsLink).toHaveAttribute("href", "#lesson-details");

    expect(worksheetLink).toHaveAttribute("href", "#restricted-content");
  });
});
