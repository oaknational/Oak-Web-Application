import { fireEvent } from "@testing-library/react";

import { OverviewVideo, OverviewVideoProps } from "./OverviewVideo";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

jest.mock("../../../components/VideoPlayer/VideoPlayer", () => ({
  __esModule: true,
  default: () => <video data-testid="video-element" />,
}));

describe("OverviewVideo", () => {
  it("Renders the video player", () => {
    const props: OverviewVideoProps = {
      video: "video",
      title: "title",
      transcriptSentences: ["test sentence 1", "test sentence 2"],
      signLanguageVideo: "signLanguageVideo",
    };
    const { getByTestId } = renderWithTheme(<OverviewVideo {...props} />);
    expect(getByTestId("video-element")).toBeInTheDocument();
  });

  it("Renders the video transcript toggle when there is a transcript available", () => {
    const props: OverviewVideoProps = {
      video: "video",
      title: "title",
      transcriptSentences: ["test sentence 1", "test sentence 2"],
      signLanguageVideo: "signLanguageVideo",
    };
    const { getByText } = renderWithTheme(<OverviewVideo {...props} />);
    expect(getByText("Show video transcript")).toBeInTheDocument();
  });

  it("Does not render the video transcript toggle when there is no transcript available", () => {
    const props: OverviewVideoProps = {
      video: "video",
      title: "title",
      signLanguageVideo: "signLanguageVideo",
    };
    const { getByText } = renderWithTheme(<OverviewVideo {...props} />);
    expect(() => getByText("Show video transcript")).toThrow();
  });

  it("Renders the video transcript when the transcript toggle is clicked", async () => {
    const props: OverviewVideoProps = {
      video: "video",
      title: "title",
      transcriptSentences: ["test sentence 1", "test sentence 2"],
      signLanguageVideo: "signLanguageVideo",
    };
    const { getByText } = renderWithTheme(<OverviewVideo {...props} />);

    await fireEvent.click(getByText("Show video transcript"));

    expect(getByText("test sentence 1")).toBeInTheDocument();
  });

  it("Does not render the video transcript when the transcript toggle is clicked again", async () => {
    const props: OverviewVideoProps = {
      video: "video",
      title: "title",
      transcriptSentences: ["test sentence 1", "test sentence 2"],
      signLanguageVideo: "signLanguageVideo",
    };
    const { getByText } = renderWithTheme(<OverviewVideo {...props} />);

    await fireEvent.click(getByText("Show video transcript"));
    await fireEvent.click(getByText("Hide video transcript"));

    expect(() => getByText("test sentence 1")).toThrow();
  });

  it("Renders the signed video toggle when there is a signed video available", () => {
    const props: OverviewVideoProps = {
      video: "video",
      title: "title",
      transcriptSentences: ["test sentence 1", "test sentence 2"],
      signLanguageVideo: "signLanguageVideo",
    };
    const { getByText } = renderWithTheme(<OverviewVideo {...props} />);
    expect(getByText("Signed video")).toBeInTheDocument();
  });

  it("does not render the signed video toggle when there is no signed video available", () => {
    const props: OverviewVideoProps = {
      video: "video",
      title: "title",
      transcriptSentences: ["test sentence 1", "test sentence 2"],
    };
    const { getByText } = renderWithTheme(<OverviewVideo {...props} />);
    expect(() => getByText("Signed video")).toThrow();
  });

  // TODO: Not sure how to test this yet
  it.todo("loads the signed video when the signed video toggle is clicked");
});
