import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import HeaderListingCurriculumDownloadButton from "./HeaderListingCurriculumDownloadButton";
import downloadZip from "./helpers/downloadZip";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

vi.mock("./helpers/downloadZip");

const curriculumMapDownloaded = vi.fn();
vi.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      curriculumMapDownloaded: (...args: unknown[]) =>
        curriculumMapDownloaded(...args),
    },
  }),
}));

const render = renderWithProviders();

describe("HeaderListingCurriculumDownloadButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a download button link with href corresponding to passed in props", () => {
    const { getByRole } = render(
      <HeaderListingCurriculumDownloadButton
        keyStageSlug={"ks4"}
        keyStageTitle={"Key stage 4"}
        subjectSlug={"english"}
        subjectTitle="English"
      />,
    );

    const downloadLink = getByRole("link", {
      name: "Curriculum download (PDF)",
    });

    expect(downloadLink).toHaveAttribute(
      "href",
      `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/download-asset?type=curriculum-map&id=key-stage-4-english&extension=pdf`,
    );
  });

  test.only("calls tracking with correct parameters when a download zip link is clicked on a non tierred lesson page", async () => {
    render(
      <HeaderListingCurriculumDownloadButton
        keyStageTitle={"Key stage 4"}
        subjectTitle={"English"}
        keyStageSlug={"ks4"}
        subjectSlug={"english"}
      />,
    );

    const linkTitle = screen.getByText("Curriculum download (PDF)");

    const user = userEvent.setup();
    await user.click(linkTitle);

    expect(curriculumMapDownloaded).toHaveBeenCalledTimes(1);
    expect(curriculumMapDownloaded).toHaveBeenCalledWith(
      expect.objectContaining({
        analyticsUseCase: null,
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        subjectSlug: "english",
        subjectTitle: "English",
      }),
    );
  });

  it("renders a tiered download button link from unit page with tiers", () => {
    const { getByRole } = render(
      <HeaderListingCurriculumDownloadButton
        keyStageSlug={"ks4"}
        keyStageTitle={"Key stage 4"}
        subjectSlug={"maths"}
        subjectTitle={"Maths"}
        tier={"core"}
      />,
    );

    const downloadLink = getByRole("link", {
      name: "Core curriculum download (PDF)",
    });

    expect(downloadLink).toHaveAttribute(
      "href",
      `${process.env.NEXT_PUBLIC_VERCEL_API_URL}/api/download-asset?type=curriculum-map&id=key-stage-4-maths-core&extension=pdf`,
    );
  });

  it("renders a button to download a zip file when on a tiered lesson page", () => {
    render(
      <HeaderListingCurriculumDownloadButton
        keyStageTitle={"Key stage 4"}
        subjectTitle={"Maths"}
        keyStageSlug={"ks4"}
        subjectSlug={"maths"}
      />,
    );

    const buttonTitle = screen.getByText("Curriculum download (.zip)");
    expect(buttonTitle).toBeInTheDocument();
  });
  it("it downloads a zip when there are no tiers, ks4 and maths", async () => {
    render(
      <HeaderListingCurriculumDownloadButton
        keyStageTitle={"Key stage 4"}
        subjectTitle={"Maths"}
        keyStageSlug={"ks4"}
        subjectSlug={"maths"}
      />,
    );

    const buttonTitle = screen.getByText("Curriculum download (.zip)");

    const user = userEvent.setup();
    await user.click(buttonTitle);

    expect(downloadZip).toHaveBeenCalledTimes(1);
    expect(downloadZip).toHaveBeenCalledWith("4", "maths");
  });
  it("it downloads a pdf when there are tiers, ks4 and maths", async () => {
    render(
      <HeaderListingCurriculumDownloadButton
        keyStageTitle={"Key stage 4"}
        subjectTitle={"Maths"}
        keyStageSlug={"ks4"}
        subjectSlug={"maths"}
        tier={"core"}
      />,
    );

    const linkTitle = screen.getByText("Core curriculum download (PDF)");

    expect(linkTitle).toBeInTheDocument();
    expect(downloadZip).toHaveBeenCalledTimes(0);
  });
  it("calls tracking with correct parameters when a download zip button is clicked on a tierred lesson page", async () => {
    render(
      <HeaderListingCurriculumDownloadButton
        keyStageTitle={"Key stage 4"}
        subjectTitle={"Maths"}
        keyStageSlug={"ks4"}
        subjectSlug={"maths"}
      />,
    );

    const buttonTitle = screen.getByText("Curriculum download (.zip)");

    const user = userEvent.setup();
    await user.click(buttonTitle);

    expect(downloadZip).toHaveBeenCalledTimes(1);
    expect(downloadZip).toHaveBeenCalledWith("4", "maths");
    expect(curriculumMapDownloaded).toHaveBeenCalledTimes(1);
    expect(curriculumMapDownloaded).toHaveBeenCalledWith(
      expect.objectContaining({
        analyticsUseCase: null,
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        subjectSlug: "maths",
        subjectTitle: "Maths",
      }),
    );
  });
});
