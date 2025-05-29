import LessonOverviewSideNavAnchorLinks from "./LessonOverviewSideNavAnchorLinks";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("LessonOverviewSideNavAnchorLinks", () => {
  it("should render the links correctly", () => {
    const links = [
      { label: "Link 1", anchorId: "link1" },
      { label: "Link 2", anchorId: "link2" },
    ];
    const { getByText } = renderWithTheme(
      <LessonOverviewSideNavAnchorLinks
        links={links}
        currentSectionId="link1"
      />,
    );

    expect(getByText("Link 1")).toBeInTheDocument();
    expect(getByText("Link 2")).toBeInTheDocument();
  });
});
