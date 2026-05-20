import { PupilLessonVideoTopNav } from "./PupilLessonVideoTopNav";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import "@/__tests__/__helpers__/ResizeObserverMock";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonVideoTopNav", () => {
  it("renders heading and mobile summary", () => {
    render(
      <PupilLessonVideoTopNav
        heading="Video lesson"
        mobileSummary="In progress"
      />,
    );

    expect(document.body).toHaveTextContent("Video lesson");
    expect(document.body).toHaveTextContent("In progress");
  });
});
