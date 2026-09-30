import { renderHook } from "@testing-library/react";

import useCurriculumDownload from "./useCurriculumDownload";

import { downloadFileFromUrl } from "@/components/SharedComponents/helpers/downloadFileFromUrl";
import type { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";
import type { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { createCurriculumDownloadsUrl } from "@/utils/curriculum/urls";

jest.mock("@/components/SharedComponents/helpers/downloadFileFromUrl", () => ({
  downloadFileFromUrl: jest.fn(),
}));
jest.mock("@/utils/curriculum/urls", () => ({
  createCurriculumDownloadsUrl: jest.fn(() => "/download.zip"),
}));
const mockPersistResourceFormDetails = jest.fn();
jest.mock("./usePersistResourceFormDetails", () => () => ({
  persistResourceFormDetails: mockPersistResourceFormDetails,
}));

describe("useCurriculumDownload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("builds and downloads the selected curriculum resources", async () => {
    const { result } = renderHook(() => useCurriculumDownload());
    const slugs: CurriculumSelectionSlugs = {
      subjectSlug: "maths",
      phaseSlug: "secondary",
      ks4OptionSlug: "foundation",
    };

    const data: ResourceFormValues = {
      school: "homeschool",
      terms: true,
      resources: ["lesson-plans"],
    };

    await result.current.onSubmit({
      data,
      mvRefreshTime: 123,
      slugs,
      tierSlug: "foundation",
      childSubjectSlug: null,
    });

    expect(createCurriculumDownloadsUrl).toHaveBeenCalledWith(
      ["lesson-plans"],
      "published",
      123,
      "maths",
      "secondary",
      "foundation",
      "foundation",
      null,
    );
    expect(mockPersistResourceFormDetails).toHaveBeenCalledWith(data);
    expect(downloadFileFromUrl).toHaveBeenCalledWith("/download.zip");
  });
});
