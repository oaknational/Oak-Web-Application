import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import CurriculumDownloadButton from "./CurriculumDownloadButton";

describe("CurriculumDownloadButton", () => {
  test("renders a download button link with href corresponding to passed in props", () => {
    const { getByRole } = renderWithProviders(
      <CurriculumDownloadButton keyStage={"ks4"} subject={"english"} />
    );

    const downloadLink = getByRole("link", {
      name: "Curriculum download (PDF)",
    });

    expect(downloadLink).toHaveAttribute(
      "href",
      `/${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/download-asset?type=curriculum-map&id=key-stage-4-english&extension=pdf`
    );
  });

  test("renders a tiered download button link from unit page with tiers", () => {
    const { getByRole } = renderWithProviders(
      <CurriculumDownloadButton
        keyStage={"ks4"}
        subject={"maths"}
        tier={"core"}
      />
    );

    const downloadLink = getByRole("link", {
      name: "Core curriculum download (PDF)",
    });

    expect(downloadLink).toHaveAttribute(
      "href",
      `/${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/download-asset?type=curriculum-map&id=key-stage-4-maths-core&extension=pdf`
    );
  });
});
