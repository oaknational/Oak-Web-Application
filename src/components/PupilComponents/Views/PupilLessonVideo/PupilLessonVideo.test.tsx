import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import {
  PupilLessonVideoAdditionalFilesCard,
  PupilLessonVideoTopNav,
  PupilLessonVideoTranscript,
  PupilLessonVideoView,
} from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import "@/__tests__/__helpers__/ResizeObserverMock";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonVideo", () => {
  it("renders the video view slots", () => {
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

  it("renders the additional files card and handles downloads", async () => {
    const onDownload = jest.fn();
    const user = userEvent.setup();

    render(
      <PupilLessonVideoAdditionalFilesCard
        hasAdditionalFiles={true}
        filesCount={2}
        filesListSlot={<li>Worksheet</li>}
        onDownload={onDownload}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Download files" }));

    expect(document.body).toHaveTextContent(
      "Files you will need for this lesson",
    );
    expect(document.body).toHaveTextContent("Worksheet");
    expect(document.body).toHaveTextContent("Download files");
    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  it("does not render the additional files card when there are no files", () => {
    const { container } = render(
      <PupilLessonVideoAdditionalFilesCard
        filesCount={0}
        onDownload={() => undefined}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the top navigation defaults", () => {
    render(<PupilLessonVideoTopNav />);

    expect(document.body).toHaveTextContent("Lesson video");
    expect(document.body).toHaveTextContent("In progress...");
  });

  it("renders transcript content and a sign-language toggle", async () => {
    const onSignLanguageToggle = jest.fn();
    const user = userEvent.setup();

    render(
      <PupilLessonVideoTranscript
        transcriptSentences={["First sentence", "Second sentence"]}
        showSignLanguageToggle={true}
        signLanguageOn={false}
        onSignLanguageToggle={onSignLanguageToggle}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Show sign language" }),
    );

    expect(document.body).toHaveTextContent("First sentence");
    expect(document.body).toHaveTextContent("Second sentence");
    expect(document.body).toHaveTextContent("Show sign language");
    expect(onSignLanguageToggle).toHaveBeenCalledTimes(1);
  });

  it("does not render a transcript when there are no sentences", () => {
    const { container } = render(
      <PupilLessonVideoTranscript transcriptSentences={[]} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
