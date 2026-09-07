/** @jest-environment node */
import { draftMode } from "next/headers";

import CurriculumChangeGuidancePage, { generateMetadata } from "./page";

import { getNationalCurriculumInsightsRouteData } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/getNationalCurriculumInsightsData";

jest.mock("next/headers", () => ({ draftMode: jest.fn() }));
jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("404");
  },
}));
jest.mock(
  "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/getNationalCurriculumInsightsData",
  () => ({ getNationalCurriculumInsightsRouteData: jest.fn() }),
);
jest.mock(
  "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/NationalCurriculumInsightsView",
  () => ({ NationalCurriculumInsightsView: () => null }),
);

describe("curriculum change guidance route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(draftMode).mockResolvedValue({
      isEnabled: false,
      enable: jest.fn(),
      disable: jest.fn(),
    });
  });
  it("uses the independent guidance route and canonical URL", async () => {
    jest
      .mocked(getNationalCurriculumInsightsRouteData)
      .mockResolvedValue({ hub: null } as never);
    expect(await CurriculumChangeGuidancePage()).toBeDefined();
    expect(getNationalCurriculumInsightsRouteData).toHaveBeenCalledWith(
      { kind: "guidance" },
      { previewMode: false },
    );
    expect((await generateMetadata()).alternates?.canonical).toBe(
      "/curriculum-change-explained/guidance",
    );
  });
  it("does not expose an unpublished guidance page", async () => {
    jest.mocked(getNationalCurriculumInsightsRouteData).mockResolvedValue(null);
    await expect(CurriculumChangeGuidancePage()).rejects.toThrow("404");
  });
  it("does not index authenticated draft previews", async () => {
    jest.mocked(draftMode).mockResolvedValue({
      isEnabled: true,
      enable: jest.fn(),
      disable: jest.fn(),
    });
    expect((await generateMetadata()).robots).toEqual({
      index: false,
      follow: false,
    });
  });
});
