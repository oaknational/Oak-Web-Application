import { fireEvent } from "@testing-library/react";

import {
  LessonOverviewVideo,
  LessonOverviewVideoProps,
} from "./LessonOverviewVideo";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

jest.mock("@/components/SharedComponents/VideoPlayer/VideoPlayer", () => ({
  __esModule: true,
  default: () => <video data-testid="video-element" />,
}));

describe("LessonOverviewVideo", () => {
  it("Renders the video player", () => {
    const props: LessonOverviewVideoProps = {
      video: "video",
      title: "title",
      transcriptSentences: ["test sentence 1", "test sentence 2"],
      signLanguageVideo: "signLanguageVideo",
      isLegacy: true,
    };
    const { getByTestId } = renderWithTheme(<LessonOverviewVideo {...props} />);
    expect(getByTestId("video-element")).toBeInTheDocument();
  });

  it("Renders the video transcript toggle when there is a transcript available", () => {
    const props: LessonOverviewVideoProps = {
      video: "video",
      title: "title",
      transcriptSentences: ["test sentence 1", "test sentence 2"],
      signLanguageVideo: "signLanguageVideo",
      isLegacy: true,
    };
    const { getByText } = renderWithTheme(<LessonOverviewVideo {...props} />);
    expect(getByText("Show transcript")).toBeInTheDocument();
  });

  it("Does not render the video transcript toggle when there is no transcript available", () => {
    const props: LessonOverviewVideoProps = {
      video: "video",
      title: "title",
      signLanguageVideo: "signLanguageVideo",
      isLegacy: true,
    };
    const { getByText } = renderWithTheme(<LessonOverviewVideo {...props} />);
    expect(() => getByText("Show transcript")).toThrow();
  });

  it("Renders the video transcript when the transcript toggle is clicked", async () => {
    const props: LessonOverviewVideoProps = {
      video: "video",
      title: "title",
      transcriptSentences: ["test sentence 1", "test sentence 2"],
      signLanguageVideo: "signLanguageVideo",
      isLegacy: true,
    };
    const { getByText } = renderWithTheme(<LessonOverviewVideo {...props} />);

    await fireEvent.click(getByText("Show transcript"));

    expect(getByText("test sentence 1")).toBeInTheDocument();
  });

  it("Does not render the video transcript when the transcript toggle is clicked again", async () => {
    const props: LessonOverviewVideoProps = {
      video: "video",
      title: "title",
      transcriptSentences: ["test sentence 1", "test sentence 2"],
      signLanguageVideo: "signLanguageVideo",
      isLegacy: true,
    };
    const { getByText } = renderWithTheme(<LessonOverviewVideo {...props} />);

    await fireEvent.click(getByText("Show transcript"));
    await fireEvent.click(getByText("Hide transcript"));

    expect(() => getByText("test sentence 1")).toThrow();
  });

  it("Renders the signed video toggle when there is a signed video available", () => {
    const props: LessonOverviewVideoProps = {
      video: "video",
      title: "title",
      transcriptSentences: ["test sentence 1", "test sentence 2"],
      signLanguageVideo: "signLanguageVideo",
      isLegacy: true,
    };
    const { getByText } = renderWithTheme(<LessonOverviewVideo {...props} />);
    expect(getByText("Show sign language")).toBeInTheDocument();
  });

  it("does not render the signed video toggle when there is no signed video available", () => {
    const props: LessonOverviewVideoProps = {
      video: "video",
      title: "title",
      transcriptSentences: ["test sentence 1", "test sentence 2"],
      signLanguageVideo: null,
      isLegacy: true,
    };
    const { getByText } = renderWithTheme(<LessonOverviewVideo {...props} />);
    expect(() => getByText("Show sign language")).toThrow();
  });
});
