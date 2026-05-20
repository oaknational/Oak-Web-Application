import { PupilLessonIntroAdditionalFileItem } from "./PupilLessonIntroAdditionalFileItem";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonIntroAdditionalFileItem", () => {
  it("renders the display name, file size and extension", () => {
    render(
      <PupilLessonIntroAdditionalFileItem
        displayName="Worksheet"
        bytes={13456325}
        url="https://example.com/worksheet.pdf"
      />,
    );

    expect(document.body).toHaveTextContent("Worksheet");
    expect(document.body).toHaveTextContent("12.83 MB (PDF)");
  });
});
