import HeaderLesson, { HeaderLessonProps } from "./HeaderLesson";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import lessonOverviewFixture from "@/node-lib/curriculum-api/fixtures/lessonOverview.fixture";

const props = {
  ...lessonOverviewFixture(),
  breadcrumbs: [],
  background: "pink30",
  lessonDescription: "A lesson description",
  isNew: true,
  subjectIconBackgroundColor: "pink",
} as unknown as HeaderLessonProps;

describe("HeaderLesson", () => {
  it("renders the title with the correct level", () => {
    const { getAllByRole } = renderWithTheme(<HeaderLesson {...props} />);
    const subjectHeading = getAllByRole("heading", { level: 1 });
    expect(subjectHeading).toHaveLength(1);
    expect(subjectHeading[0]).toHaveTextContent("Islamic Geometry");
  });

  it("renders the download button when !expired && hasDownloadableResources", () => {
    const { getAllByRole } = renderWithTheme(<HeaderLesson {...props} />);
    expect(getAllByRole("link")).toHaveLength(1);
  });

  it("does not render the download button when expired && hasDownloadableResources", () => {
    const { queryByRole } = renderWithTheme(
      <HeaderLesson {...props} expired={true} />
    );
    const downloadLink = queryByRole("link");
    expect(downloadLink).toBeNull();
  });

  it("does not render the download button when !expired && !hasDownloadableResources", () => {
    const { queryByRole } = renderWithTheme(
      <HeaderLesson {...props} hasDownloadableResources={false} />
    );
    const downloadLink = queryByRole("link");
    expect(downloadLink).toBeNull();
  });

  it("renders year title when passed in ", () => {
    const { getAllByText } = renderWithTheme(<HeaderLesson {...props} />);
    const year = getAllByText("year 11");
    expect(year).toHaveLength(2); // mobile and desktop
  });

  it("renders a lesson description when passed in ", () => {
    const { getAllByText } = renderWithTheme(<HeaderLesson {...props} />);
    const description = getAllByText("A lesson description");
    expect(description).toHaveLength(2); // mobile and desktop
  });
});
