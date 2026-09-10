import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { LessonMediaClipInfo } from "./LessonMediaClipInfo";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("LessonMediaClipInfo component", () => {
  it("should render", () => {
    const { getByText } = render(
      <LessonMediaClipInfo
        clipTitle="Clip title"
        keyStageTitle="Key stage 2"
        yearTitle="Year 2"
        subjectTitle="Maths"
        isMobile={false}
      />,
    );
    const clipTitle = getByText("Clip title");
    const keyStage = getByText("Key stage 2");
    const year = getByText("Year 2");
    const subjectTitle = getByText("Maths");
    expect(clipTitle).toBeInTheDocument();
    expect(keyStage).toBeInTheDocument();
    expect(year).toBeInTheDocument();
    expect(subjectTitle).toBeInTheDocument();
  });

  it("should render video transcript if provided", () => {
    const videoTranscript = <p>transcript for the video</p>;
    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonMediaClipInfo
          clipTitle="Clip title"
          keyStageTitle="KS2"
          yearTitle="Year 2"
          subjectTitle="Maths"
          videoTranscript={videoTranscript}
          isMobile={false}
        />
      </OakThemeProvider>,
    );
    const trasncript = getByText("transcript for the video");
    expect(trasncript).toBeInTheDocument();
  });
});
