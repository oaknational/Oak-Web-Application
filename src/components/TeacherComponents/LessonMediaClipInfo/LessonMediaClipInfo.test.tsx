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
});
