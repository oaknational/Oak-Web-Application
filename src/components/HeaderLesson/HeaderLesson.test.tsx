import HeaderLesson, { HeaderLessonProps } from "./HeaderLesson";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import lessonOverviewFixture from "@/node-lib/curriculum-api/fixtures/lessonOverview.fixture";

const downloadResourceButtonClicked = jest.fn();
jest.mock("../../context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      downloadResourceButtonClicked: (...args: unknown[]) =>
        downloadResourceButtonClicked(...args),
    },
  }),
}));

const props = {
  ...lessonOverviewFixture(),
  breadcrumbs: [],
  background: "pink30",
  lessonDescription: "A lesson description",
  lessonIsNew: true,
  subjectIconBackgroundColor: "pink",
} as unknown as HeaderLessonProps;

describe("HeaderLesson", () => {
  it("renders the title with the correct level", () => {
    const { getAllByRole } = renderWithTheme(<HeaderLesson {...props} />);
    const subjectHeading = getAllByRole("heading", { level: 1 });
    expect(subjectHeading).toHaveLength(1);
    expect(subjectHeading[0]).toHaveTextContent("Islamic Geometry");
  });

  //   it("renders the children", () => {
  //     const { getByText } = renderWithTheme(
  //       <HeaderLesson title={"Slide deck"} anchorId="slideDeck">
  //         <Card $background={"white"} $ba={3} $borderColor={"grey2"}>
  //           Inner content
  //         </Card>
  //       </HeaderLesson>
  //     );
  //     expect(getByText("Inner content")).toBeInTheDocument();
  //   });

  it("renders the download button when !expired && hasDownloadableResources", () => {
    const { getAllByRole } = renderWithTheme(<HeaderLesson {...props} />);
    expect(getAllByRole("link")).toHaveLength(1);
  });

  // it("doesn't render the download button when expired", () => {
  //   const { getAllByRole } = renderWithTheme(
  //     <HeaderLesson
  //       title={"Slide deck"}
  //       downloadable={true}
  //       anchorId="slideDeck"
  //     >

  //   );
  //   expect(() => getAllByRole("link")).toThrow();
  // });

  //   it("calls trackingCallback on Download Button click if provided in props", async () => {
  //     const user = userEvent.setup();
  //     const onDownloadButtonClick = jest.fn();

  //     renderWithTheme(
  //       <HeaderLesson
  //         downloadable={true}
  //         slugs={lessonOverview}
  //         title={"Video"}
  //         anchorId={"video"}
  //         onDownloadButtonClick={onDownloadButtonClick}
  //       >
  //         <Card $background={"white"} $ba={3} $borderColor={"grey2"}>
  //           Grid box
  //         </Card>
  //       </HeaderLesson>
  //     );

  //     const downloadLinkButton = screen.getByTestId("download-button");

  //     await user.click(downloadLinkButton);
  //     expect(onDownloadButtonClick).toHaveBeenCalledTimes(1);
  //   });

  //   it("adds selected+[title] to query string", async () => {
  //     renderWithTheme(
  //       <HeaderLesson
  //         title={"Worksheet"}
  //         downloadable={true}
  //         anchorId="worksheet"
  //         slugs={lessonOverview}
  //       >
  //         <Card $background={"white"} $ba={3} $borderColor={"grey2"}>
  //           Grid box
  //         </Card>
  //       </HeaderLesson>
  //     );

  //     const downloadLinkButton = screen.getByTestId("download-button");
  //     expect(downloadLinkButton).toHaveAttribute(
  //       "href",
  //       "/beta/teachers/programmes/maths-higher-ks4/units/maths-unit/lessons/macbeth-lesson-1/downloads?preselected=worksheet"
  //     );
  //   });
});
