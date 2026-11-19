/** @jest-environment node */
import { draftMode } from "next/headers";

import CurriculumChangeGuidancePage, {
  dynamic,
  generateMetadata,
} from "./page";

import { localNationalCurriculumInsightsFixtures } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/__fixtures__/nationalCurriculumInsights";
import { getNationalCurriculumInsightsRouteData } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/helpers/getRouteData";

jest.mock("next/headers", () => ({ draftMode: jest.fn() }));
jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("404");
  },
}));
jest.mock(
  "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/helpers/getRouteData",
  () => ({ getNationalCurriculumInsightsRouteData: jest.fn() }),
);
jest.mock(
  "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/components/View",
  () => ({ NationalCurriculumInsightsView: () => null }),
);

describe("curriculum change guidance route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(getNationalCurriculumInsightsRouteData).mockResolvedValue(null);
    jest.mocked(draftMode).mockResolvedValue({
      isEnabled: false,
      enable: jest.fn(),
      disable: jest.fn(),
    });
  });

  it("renders at request time without a loading page", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("uses the independent guidance route and its Sanity metadata", async () => {
    const page =
      (await localNationalCurriculumInsightsFixtures.reader.nationalCurriculumInsightsGuidancePage())!;
    const title = "Guidance for the refreshed curriculum";
    const description = page.summary;
    jest.mocked(getNationalCurriculumInsightsRouteData).mockResolvedValue({
      hub: null,
      route: { kind: "guidance" },
      subjects: [],
      subject: null,
      page: { ...page, seo: { title, description: " " } },
      activeTab: null,
      activeKeyStage: null,
    });
    expect(await CurriculumChangeGuidancePage()).toBeDefined();
    expect(getNationalCurriculumInsightsRouteData).toHaveBeenCalledWith(
      { kind: "guidance" },
      { previewMode: false },
    );
    expect(await generateMetadata()).toMatchObject({
      alternates: { canonical: "/curriculum-change-explained/guidance" },
      title,
      description,
      openGraph: { title, description },
      twitter: { title, description },
    });
  });
  it("does not expose an unpublished guidance page", async () => {
    jest.mocked(getNationalCurriculumInsightsRouteData).mockResolvedValue(null);
    await expect(CurriculumChangeGuidancePage()).rejects.toThrow("404");
  });
  it("keeps the guidance page out of search indexes", async () => {
    expect((await generateMetadata()).robots).toEqual({
      index: false,
      follow: false,
    });
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
    expect(getNationalCurriculumInsightsRouteData).toHaveBeenCalledWith(
      { kind: "guidance" },
      { previewMode: true },
    );
  });
});
