import GviewEmbed from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("GviewEmbed", () => {
  test("component renders with correctly", async () => {
    const docUrl =
      "https://msopenspecs.azureedge.net/files/MS-DOCX/%5bMS-DOCX%5d-240416.docx";
    const { baseElement } = renderWithTheme(<GviewEmbed url={docUrl} />);
    expect(baseElement.querySelector("iframe")).toHaveAttribute(
      "src",
      `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
        docUrl,
      )}`,
    );
  });
});
