import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import CurriculumDownloadButton from "./CurriculumDownloadButton";
import downloadZip from "./helpers/downloadZip";

jest.mock("./helpers/downloadZip");

const curriculumMapDownloaded = jest.fn();
jest.mock("../../context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      curriculumMapDownloaded: (...args: unknown[]) =>
        curriculumMapDownloaded(...args),
    },
  }),
}));

describe("CurriculumDownloadButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  test("calls tracking with correct parameters when a download zip link is clicked on a non tierred lesson page", async () => {
    renderWithProviders(
      <CurriculumDownloadButton
        keyStageTitle={"Key stage 4"}
        subjectTitle={"English"}
        keyStageSlug={"ks4"}
        subjectSlug={"english"}
      />
    );

    const linkTitle = screen.getByText("Curriculum download (PDF)");

    const user = userEvent.setup();
    await user.click(linkTitle);

    expect(curriculumMapDownloaded).toHaveBeenCalledTimes(1);
    expect(curriculumMapDownloaded).toHaveBeenCalledWith({
      analyticsUseCase: ["Teacher"],
      keyStageSlug: "ks4",
      keyStageTitle: "Key stage 4",
      pageName: ["Unit Listing"],
      subjectSlug: "english",
      subjectTitle: "English",
    });
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

  test("renders a button to download a zip file when on a tiered lesson page", () => {
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

  test("calls tracking with correct parameters when a download zip button is clicked on a tierred lesson page", async () => {
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

    const user = userEvent.setup();
    await user.click(buttonTitle);

    expect(downloadZip).toHaveBeenCalledTimes(1);
    expect(downloadZip).toHaveBeenCalledWith("4", "maths");
    expect(curriculumMapDownloaded).toHaveBeenCalledTimes(1);
    expect(curriculumMapDownloaded).toHaveBeenCalledWith({
      analyticsUseCase: ["Teacher"],
      keyStageSlug: "ks4",
      keyStageTitle: "Key stage 4",
      pageName: ["Lesson Listing"],
      subjectSlug: "maths",
      subjectTitle: "Maths",
    });
  });
});
