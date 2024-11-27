import { LessonMediaClipInfo } from "./LessonMediaClipInfo";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("LessonMediaClipInfo component", () => {
  it("should render", () => {
    const { getByText } = renderWithTheme(
      <LessonMediaClipInfo
        clipTitle="Clip title"
        keyStageSlug="KS2"
        yearSlug="Year 2"
        subjectSlug="Maths"
      />,
    );
    const clipTitle = getByText("Clip title");
    const constructedInfo = getByText("KS2 • Year 2 • Maths");
    expect(clipTitle).toBeInTheDocument();
    expect(constructedInfo).toBeInTheDocument();
  });

  // it("should render video transcript if provided", () => {
  //   const videoTranscript = (<p>transcript for the video</p>);
  //   const { getByTestId } = renderWithTheme(
  //     <LessonMediaClipInfo clipTitle="Clip title" keyStageSlug="KS2" yearSlug="Year 2" subjectSlug="Maths" videoTranscript={videoTranscript} />,
  //   );
  //   const trasncript = getByTestId("videoTranscript");
  //   expect(trasncript).toHaveTextContent("transcript for the video");
  // });
});
