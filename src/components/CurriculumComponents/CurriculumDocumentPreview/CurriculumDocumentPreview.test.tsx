import CurriculumDocumentPreview from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurriculumDocumentPreview", () => {
  test("component renders correctly", async () => {
    const { baseElement } = renderWithTheme(<CurriculumDocumentPreview />);

    expect(baseElement).toHaveTextContent("Document preview");
  });
});
