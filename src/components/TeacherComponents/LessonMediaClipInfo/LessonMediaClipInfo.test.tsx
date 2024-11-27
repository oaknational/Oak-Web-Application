import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { LessonMediaClipInfo } from "./LessonMediaClipInfo";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("LessonMediaClipInfo component", () => {
  it("should render", () => {
    const { getByText } = renderWithTheme(
      <LessonMediaClipInfo
        clipTitle="Clip title"
        keyStageTitle="KS 2"
        yearTitle="Year 2"
        subjectTitle="Maths"
      />,
    );
    const clipTitle = getByText("Clip title");
    const constructedInfo = getByText("KS 2 • Year 2 • Maths");
    expect(clipTitle).toBeInTheDocument();
    expect(constructedInfo).toBeInTheDocument();
  });

  it("should render video transcript if provided", () => {
    const videoTranscript = <p>transcript for the video</p>;
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonMediaClipInfo
          clipTitle="Clip title"
          keyStageTitle="KS2"
          yearTitle="Year 2"
          subjectTitle="Maths"
          videoTranscript={videoTranscript}
        />
      </OakThemeProvider>,
    );
    const trasncript = getByText("transcript for the video");
    expect(trasncript).toBeInTheDocument();
  });
});
