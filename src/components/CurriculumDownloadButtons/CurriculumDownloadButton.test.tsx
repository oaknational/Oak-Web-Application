import { screen } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import CurriculumDownloadButton from "./CurriculumDownloadButton";

describe("CurriculumDownloadButton", () => {
  test("renders a download button link with href corresponding to passed in props", () => {
    const { getByRole } = renderWithProviders(
      <CurriculumDownloadButton
        keyStageSlug={"ks4"}
        keyStageTitle={"Key stage 4"}
        subjectSlug={"english"}
        subjectTitle="English"
      />
    );

    const downloadLink = getByRole("link", {
      name: "Curriculum download (PDF)",
    });

    expect(downloadLink).toHaveAttribute(
      "href",
      `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/download-asset?type=curriculum-map&id=key-stage-4-english&extension=pdf`
    );
  });

  test("renders a tiered download button link from unit page with tiers", () => {
    const { getByRole } = renderWithProviders(
      <CurriculumDownloadButton
        keyStageSlug={"ks4"}
        keyStageTitle={"Key stage 4"}
        subjectSlug={"maths"}
        subjectTitle={"Maths"}
        tier={"core"}
      />
    );

    const downloadLink = getByRole("link", {
      name: "Core curriculum download (PDF)",
    });

    expect(downloadLink).toHaveAttribute(
      "href",
      `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/download-asset?type=curriculum-map&id=key-stage-4-maths-core&extension=pdf`
    );
  });

  test("renders a link to a zip file when on a tiered lesson page", () => {
    renderWithProviders(
      <CurriculumDownloadButton
        keyStageTitle={"Key stage 4"}
        subjectTitle={"Maths"}
        keyStageSlug={"ks4"}
        subjectSlug={"maths"}
        lessonPage={true}
      />
    );

    const buttonTitle = screen.getByText("Curriculum download (.zip)");
    expect(buttonTitle).toBeInTheDocument();
  });
});
