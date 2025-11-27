import { fireEvent } from "@testing-library/react";

import { AnalyticsBrowseData } from "../types/lesson.types";

import {
  LessonOverviewVideo,
  LessonOverviewVideoProps,
} from "./LessonOverviewVideo";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

jest.mock("@/components/SharedComponents/VideoPlayer/VideoPlayer", () => ({
  __esModule: true,
  default: () => <video data-testid="video-element" />,
}));

export const mockBrowsePathwayData: AnalyticsBrowseData = {
  keyStageSlug: "ks4",
  keyStageTitle: "Key stage 4",
  subjectSlug: "maths",
  subjectTitle: "Maths",
  unitSlug: "surds",
  unitName: "Surds",
  lessonSlug: "lesson-1",
  lessonName: "Lesson 1",
  pathway: null,
  tierName: "Foundation",
  yearGroupName: "Year 10",
  yearGroupSlug: "year-10",
  examBoard: null,
  releaseGroup: "2023",
  phase: "secondary",
  lessonReleaseCohort: "2023-2026",
  lessonReleaseDate: "unreleased",
};

describe("LessonOverviewVideo", () => {
  it("Renders the video player", () => {
    const props: LessonOverviewVideoProps = {
      video: "video",
      title: "title",
      transcriptSentences: ["test sentence 1", "test sentence 2"],
      signLanguageVideo: "signLanguageVideo",
      isLegacy: true,
      browsePathwayData: mockBrowsePathwayData,
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
      browsePathwayData: mockBrowsePathwayData,
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
      browsePathwayData: mockBrowsePathwayData,
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
      browsePathwayData: mockBrowsePathwayData,
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
      browsePathwayData: mockBrowsePathwayData,
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
      browsePathwayData: mockBrowsePathwayData,
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
      browsePathwayData: mockBrowsePathwayData,
    };
    const { getByText } = renderWithTheme(<LessonOverviewVideo {...props} />);
    expect(() => getByText("Show sign language")).toThrow();
  });
});
