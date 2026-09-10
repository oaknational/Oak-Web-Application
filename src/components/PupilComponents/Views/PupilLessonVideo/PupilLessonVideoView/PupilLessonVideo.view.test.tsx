import { PupilLessonVideoView } from "./PupilLessonVideo.view";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import "@/__tests__/__helpers__/ResizeObserverMock";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonVideoView", () => {
  it("renders the supplied slots", () => {
    render(
      <PupilLessonVideoView
        phase="primary"
        topNav={{ heading: "Lesson video" }}
        bottomNav={{ proceedLabel: "Continue", onProceed: () => undefined }}
        videoSlot={<div>Video player</div>}
        transcriptSlot={<div>Transcript slot</div>}
        additionalFilesSlot={<div>Additional files slot</div>}
      />,
    );

    expect(document.body).toHaveTextContent("Lesson video");
    expect(document.body).toHaveTextContent("Video player");
    expect(document.body).toHaveTextContent("Transcript slot");
    expect(document.body).toHaveTextContent("Additional files slot");
  });
});
