import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import { LessonItemContainer } from "./LessonItemContainer";

import Card from "@/components/SharedComponents/Card";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import lessonOverviewFixture from "@/node-lib/curriculum-api/fixtures/lessonOverview.fixture";
import { LessonOverviewData } from "@/node-lib/curriculum-api";

const resourceContainerExpanded = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      resourceContainerExpanded: (...args: unknown[]) =>
        resourceContainerExpanded(...args),
    },
  }),
}));

describe("LessonItemContainer", () => {
  let lessonOverview: LessonOverviewData;

  beforeAll(() => {
    lessonOverview = lessonOverviewFixture();
  });

  it("renders the title with the correct level", () => {
    const { getAllByRole } = renderWithTheme(
      <LessonItemContainer title={"Slide deck"} anchorId={"slide-deck"}>
        <Card $background={"white"} $ba={3} $borderColor={"grey30"}>
          Inner content
        </Card>
      </LessonItemContainer>,
    );
    expect(getAllByRole("heading", { level: 2 })).toHaveLength(1);
  });

  it("renders the children", () => {
    const { getByText } = renderWithTheme(
      <LessonItemContainer title={"Slide deck"} anchorId="slide-deck">
        <Card $background={"white"} $ba={3} $borderColor={"grey30"}>
          Inner content
        </Card>
      </LessonItemContainer>,
    );
    expect(getByText("Inner content")).toBeInTheDocument();
  });

  it("renders the download button when downloadable is true and curriculum data is provided", () => {
    const { getAllByRole } = renderWithTheme(
      <LessonItemContainer
        title={"Slide deck"}
        downloadable={true}
        anchorId={"slide-deck"}
        slugs={lessonOverview}
      >
        <Card $background={"white"} $ba={3} $borderColor={"grey30"}>
          Inner content
        </Card>
      </LessonItemContainer>,
    );
    expect(getAllByRole("link")).toHaveLength(1);
  });

  it("doesn't render the download button without curriculum data", () => {
    const { getAllByRole } = renderWithTheme(
      <LessonItemContainer
        title={"Slide deck"}
        downloadable={true}
        anchorId="slide-deck"
      >
        <Card $background={"white"} $ba={3} $borderColor={"grey30"}>
          Inner content
        </Card>
      </LessonItemContainer>,
    );
    expect(() => getAllByRole("link")).toThrow();
  });

  it("doesn't render the seperator when isFinalElement is true", () => {
    const { getAllByTestId } = renderWithTheme(
      <LessonItemContainer
        title={"Slide deck"}
        downloadable={true}
        anchorId="slide-deck"
        isFinalElement={true}
      >
        <Card $background={"white"} $ba={3} $borderColor={"grey30"}>
          Inner content
        </Card>
      </LessonItemContainer>,
    );
    expect(() => getAllByTestId("hr")).toThrow();
  });

  it(" renders the seperator when isFinalElement is false", () => {
    const { getAllByTestId } = renderWithTheme(
      <LessonItemContainer
        title={"Slide deck"}
        downloadable={true}
        anchorId="slide-deck"
        isFinalElement={false}
      >
        <Card $background={"white"} $ba={3} $borderColor={"grey30"}>
          Inner content
        </Card>
      </LessonItemContainer>,
    );
    expect(getAllByTestId("hr")).toHaveLength(1);
  });

  it("calls trackingCallback on Download Button click if provided in props", async () => {
    const user = userEvent.setup();
    const onDownloadButtonClick = jest.fn();

    renderWithTheme(
      <LessonItemContainer
        downloadable={true}
        slugs={lessonOverview}
        title={"Video"}
        anchorId={"video"}
        onDownloadButtonClick={onDownloadButtonClick}
      >
        <Card $background={"white"} $ba={3} $borderColor={"grey30"}>
          Grid box
        </Card>
      </LessonItemContainer>,
    );

    const downloadLinkButton = screen.getByTestId("download-button");

    await user.click(downloadLinkButton);
    expect(onDownloadButtonClick).toHaveBeenCalledTimes(1);
  });

  it("adds selected+[title] to query string", async () => {
    renderWithTheme(
      <LessonItemContainer
        title={"Worksheet"}
        downloadable={true}
        anchorId="worksheet"
        slugs={lessonOverview}
      >
        <Card $background={"white"} $ba={3} $borderColor={"grey30"}>
          Grid box
        </Card>
      </LessonItemContainer>,
    );

    const downloadLinkButton = screen.getByTestId("download-button");
    expect(downloadLinkButton).toHaveAttribute(
      "href",
      "/teachers/programmes/maths-higher-ks4/units/maths-unit/lessons/macbeth-lesson-1/downloads?preselected=worksheet",
    );
  });
});
