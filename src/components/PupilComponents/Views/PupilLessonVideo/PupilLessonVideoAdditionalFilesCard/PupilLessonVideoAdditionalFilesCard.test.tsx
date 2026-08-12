import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import { PupilLessonVideoAdditionalFilesCard } from "./PupilLessonVideoAdditionalFilesCard";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import "@/__tests__/__helpers__/ResizeObserverMock";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonVideoAdditionalFilesCard", () => {
  it("renders file content and handles downloads", async () => {
    const onDownload = jest.fn();
    const user = userEvent.setup({ delay: null });

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
    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  it("does not render without files", () => {
    const { container } = render(
      <PupilLessonVideoAdditionalFilesCard
        filesCount={0}
        onDownload={() => undefined}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
