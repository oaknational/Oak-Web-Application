import userEvent from "@testing-library/user-event";
import { act, screen } from "@testing-library/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { LessonItemContainer } from "./LessonItemContainer";

import Card from "@/components/SharedComponents/Card";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import { LessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import {
  mockLinkClick,
  setupMockLinkClick,
  teardownMockLinkClick,
} from "@/utils/mockLinkClick";

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
  let lessonOverview: LessonOverviewPageData;

  beforeAll(() => {
    lessonOverview = lessonOverviewFixture();
  });

  beforeEach(() => {
    setupMockLinkClick();
  });

  afterEach(() => {
    teardownMockLinkClick();
  });

  it("renders the title with the correct level", () => {
    const { getAllByRole } = renderWithTheme(
      <LessonItemContainer
        title={"Slide deck"}
        anchorId={"slide-deck"}
        isSpecialist={false}
        pageLinks={[]}
      >
        <Card $background={"white"} $ba={3} $borderColor={"grey30"}>
          Inner content
        </Card>
      </LessonItemContainer>,
    );
    expect(getAllByRole("heading", { level: 2 })).toHaveLength(1);
  });

  it("renders the children", () => {
    const { getByText } = renderWithTheme(
      <LessonItemContainer
        title={"Slide deck"}
        anchorId="slide-deck"
        isSpecialist={false}
        pageLinks={[]}
      >
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
        isSpecialist={false}
        slugs={lessonOverview}
        pageLinks={[]}
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
        isSpecialist={false}
        displayMediaClipButton={false}
        anchorId="slide-deck"
        pageLinks={[]}
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
        isSpecialist={false}
        anchorId="slide-deck"
        isFinalElement={true}
        pageLinks={[]}
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
        isSpecialist={false}
        anchorId="slide-deck"
        isFinalElement={false}
        pageLinks={[]}
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
        title={"Lesson video"}
        isSpecialist={false}
        anchorId={"video"}
        onDownloadButtonClick={onDownloadButtonClick}
        pageLinks={[]}
      >
        <Card $background={"white"} $ba={3} $borderColor={"grey30"}>
          Grid box
        </Card>
      </LessonItemContainer>,
    );

    const downloadLinkButton = screen.getByTestId("download-button");

    await user.click(downloadLinkButton);
    expect(mockLinkClick).toHaveBeenCalledWith(
      "http://localhost/teachers/programmes/english-primary-ks2/units/grammar-1-simple-compound-and-adverbial-complex-sentences/lessons/lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences/downloads?",
    );
    expect(onDownloadButtonClick).toHaveBeenCalledTimes(1);
  });

  it("adds selected+[title] to query string", async () => {
    renderWithTheme(
      <LessonItemContainer
        title={"Worksheet"}
        downloadable={true}
        isSpecialist={false}
        anchorId="worksheet"
        slugs={lessonOverview}
        pageLinks={[]}
      >
        <Card $background={"white"} $ba={3} $borderColor={"grey30"}>
          Grid box
        </Card>
      </LessonItemContainer>,
    );

    const downloadLinkButton = screen.getByTestId("download-button");
    expect(downloadLinkButton).toHaveAttribute(
      "href",
      "/teachers/programmes/english-primary-ks2/units/grammar-1-simple-compound-and-adverbial-complex-sentences/lessons/lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences/downloads?preselected=worksheet",
    );
  });

  test("skip button becomes visible when focussed", async () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonItemContainer
          title={"Slide deck"}
          downloadable={true}
          isSpecialist={false}
          anchorId="slide-deck"
          slugs={lessonOverview}
          pageLinks={[
            { anchorId: "slide-deck", label: "Slide deck" },
            { anchorId: "video", label: "Video" },
          ]}
        >
          <Card $background={"white"} $ba={3} $borderColor={"grey30"}>
            Grid box
          </Card>
        </LessonItemContainer>
        <LessonItemContainer
          title={"Lesson video"}
          downloadable={true}
          isSpecialist={false}
          anchorId="video"
          slugs={lessonOverview}
          pageLinks={[
            { anchorId: "slide-deck", label: "Slide deck" },
            { anchorId: "video", label: "Video" },
          ]}
        >
          <Card $background={"white"} $ba={3} $borderColor={"grey30"}>
            Grid box
          </Card>
        </LessonItemContainer>
      </OakThemeProvider>,
    );

    const slideDeckButton = getByText("Skip slide deck").closest("a");

    if (!slideDeckButton) {
      throw new Error("Could not find button");
    }
    expect(slideDeckButton).not.toBeVisible();

    act(() => {
      slideDeckButton.focus();
    });
    expect(slideDeckButton).toHaveFocus();
    expect(slideDeckButton).not.toHaveStyle("position: absolute");

    act(() => {
      slideDeckButton.blur();
    });
    expect(slideDeckButton).not.toHaveFocus();
    expect(slideDeckButton).not.toBeVisible();
  });
  it("renders the play all button when displayMediaClip is true and curriculum data is provided", () => {
    const { getAllByRole } = renderWithTheme(
      <LessonItemContainer
        title={"Demonstration videos"}
        downloadable={false}
        anchorId={"media-clips"}
        displayMediaClipButton={true}
        isSpecialist={false}
        slugs={lessonOverview}
        pageLinks={[]}
      >
        <Card $background={"white"} $ba={3} $borderColor={"grey30"}>
          Inner content
        </Card>
      </LessonItemContainer>,
    );
    expect(getAllByRole("link")).toHaveLength(1);
  });
});
