import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";
import Card from "../Card";

import ExpandingContainer from ".";

const resourceContainerExpanded = jest.fn();
jest.mock("../../context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      resourceContainerExpanded: (...args: unknown[]) =>
        resourceContainerExpanded(...args),
    },
  }),
}));

describe("comonents/ExpandingContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("component renders with the title", () => {
    const { getAllByRole } = renderWithTheme(
      <ExpandingContainer
        external={true}
        projectable={true}
        downloadable={true}
        title={"Video"}
        keyStageSlug={"ks3"}
        subjectSlug={"maths"}
        unitSlug={"unit"}
        slug={"slug-slug-slug"}
      >
        <Card $background={"white"} $ba={3} $borderColor={"grey2"}>
          Grid box
        </Card>
      </ExpandingContainer>
    );

    expect(getAllByRole("button")).toHaveLength(3);
    expect(getAllByRole("link")).toHaveLength(1);
  });
  it("component renders with the title only", () => {
    const { getAllByRole } = renderWithTheme(
      <ExpandingContainer
        external={false}
        projectable={false}
        downloadable={false}
        title={"Video"}
        keyStageSlug={"ks3"}
        subjectSlug={"maths"}
        unitSlug={"unit"}
        slug={"slug-slug-slug"}
      >
        <Card $background={"white"} $ba={3} $borderColor={"grey2"}>
          Grid box
        </Card>
      </ExpandingContainer>
    );

    expect(getAllByRole("button")).toHaveLength(1);
  });
  it("renders top right icons", async () => {
    const log1 = jest.spyOn(console, "log");
    const log2 = jest.spyOn(console, "log");
    const user = userEvent.setup();
    renderWithTheme(
      <ExpandingContainer
        external={true}
        projectable={true}
        downloadable={true}
        keyStageSlug={"ks3"}
        subjectSlug={"maths"}
        unitSlug={"unit"}
        slug={"slug-slug-slug"}
        title={"Video"}
      >
        <Card $background={"white"} $ba={3} $borderColor={"grey2"}>
          Grid box
        </Card>
      </ExpandingContainer>
    );

    const downloadLinkButton = screen.getByTestId("download-button");
    expect(downloadLinkButton).toHaveAttribute(
      "href",
      "/beta/teachers/key-stages/ks3/subjects/maths/units/unit/lessons/slug-slug-slug/downloads?preselected=video"
    );
    const projectButton = screen.getByTestId("project-button");
    await user.click(projectButton);
    expect(log1).toHaveBeenCalled();

    const externalButton = screen.getByTestId("external-button");
    await user.click(externalButton);
    expect(log2).toHaveBeenCalled();
  });

  it("calls tackingCallback on Download Button click if provided in props", async () => {
    const user = userEvent.setup();
    const trackingCallback = jest.fn();

    renderWithTheme(
      <ExpandingContainer
        external={true}
        projectable={true}
        downloadable={true}
        keyStageSlug={"ks3"}
        subjectSlug={"maths"}
        unitSlug={"unit"}
        slug={"slug-slug-slug"}
        title={"Video"}
        trackingCallback={trackingCallback}
      >
        <Card $background={"white"} $ba={3} $borderColor={"grey2"}>
          Grid box
        </Card>
      </ExpandingContainer>
    );

    const downloadLinkButton = screen.getByTestId("download-button");

    await user.click(downloadLinkButton);
    expect(trackingCallback).toHaveBeenCalledTimes(1);
  });

  it("adds selected+[title] to query string", async () => {
    renderWithTheme(
      <ExpandingContainer
        external={true}
        projectable={true}
        downloadable={true}
        title={"Worksheet"}
        keyStageSlug={"ks3"}
        subjectSlug={"maths"}
        unitSlug={"unit"}
        slug={"slug-slug-slug"}
      >
        <Card $background={"white"} $ba={3} $borderColor={"grey2"}>
          Grid box
        </Card>
      </ExpandingContainer>
    );

    const downloadLinkButton = screen.getByTestId("download-button");
    expect(downloadLinkButton).toHaveAttribute(
      "href",
      "/beta/teachers/key-stages/ks3/subjects/maths/units/unit/lessons/slug-slug-slug/downloads?preselected=worksheet"
    );
  });

  it("component expands and contract on click", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <ExpandingContainer
        external={true}
        projectable={true}
        downloadable={true}
        keyStageSlug={"ks3"}
        subjectSlug={"maths"}
        unitSlug={"unit"}
        slug={"slug-slug-slug"}
        title={"Video"}
      >
        <Card $background={"white"} $ba={3} $borderColor={"grey2"}>
          Grid box
        </Card>
      </ExpandingContainer>
    );

    const downloadButton = screen.getByTestId("expand-button");
    await user.click(downloadButton);
    expect(screen.getByTestId("expanded-container")).toHaveStyle(
      "max-height: 9600px"
    );
  });

  it("calls tracking.resourceContainerExpanded once, with correct props", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <ExpandingContainer
        external={true}
        projectable={true}
        downloadable={true}
        keyStageSlug={"ks3"}
        subjectSlug={"maths"}
        unitSlug={"unit"}
        slug={"slug-slug-slug"}
        title={"Video"}
      >
        <Card $background={"white"} $ba={3} $borderColor={"grey2"}>
          Grid box
        </Card>
      </ExpandingContainer>
    );

    const expandButton = screen.getByTestId("expand-button");
    await user.click(expandButton);

    expect(resourceContainerExpanded).toHaveBeenCalledTimes(1);
    expect(resourceContainerExpanded).toHaveBeenCalledWith({
      pageName: ["Lesson"],
      containerTitle: "Video",
      analyticsUseCase: ["Teacher"],
    });
  });
});
