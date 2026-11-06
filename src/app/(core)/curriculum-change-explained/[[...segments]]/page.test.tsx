/** @jest-environment node */
import { draftMode } from "next/headers";

import CurriculumChangeExplainedPage, {
  dynamic,
  generateMetadata,
} from "./page";

import { localNationalCurriculumInsightsFixtures } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/__fixtures__/nationalCurriculumInsights";
import CMSClient from "@/node-lib/cms";

jest.mock("next/headers", () => ({ draftMode: jest.fn() }));
jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("404");
  },
}));
jest.mock("@/node-lib/cms", () => ({
  __esModule: true,
  default: {
    nationalCurriculumInsightsHub: jest.fn(),
    nationalCurriculumInsightsGuidancePage: jest.fn(),
    nationalCurriculumInsightsSubjectBySlug: jest.fn(),
  },
}));
jest.mock(
  "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/components/View",
  () => ({ NationalCurriculumInsightsView: () => null }),
);

const { hub, subjects } = localNationalCurriculumInsightsFixtures;
const mockedDraftMode = jest.mocked(draftMode);
const props = (segments?: string[]) => ({
  params: Promise.resolve({ segments }),
});

describe("curriculum change explained routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedDraftMode.mockResolvedValue({
      isEnabled: false,
      enable: jest.fn(),
      disable: jest.fn(),
    });
    jest.mocked(CMSClient.nationalCurriculumInsightsHub).mockResolvedValue(hub);
    jest
      .mocked(CMSClient.nationalCurriculumInsightsSubjectBySlug)
      .mockResolvedValue(subjects[0]!);
  });

  it("renders at request time", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it.each([
    { segments: undefined, kind: "hub" },
    { segments: ["science"], kind: "subject" },
    { segments: ["science", "primary"], kind: "subjectPhase" },
    { segments: ["science", "primary", "ks1"], kind: "subjectPhaseKeyStage" },
    { segments: ["science", "secondary", "ks4"], kind: "subjectPhaseKeyStage" },
  ])(
    "renders configured published content at $segments",
    async ({ segments, kind }) => {
      const page = await CurriculumChangeExplainedPage(props(segments));
      expect(page.props.data.route.kind).toBe(kind);
      expect(CMSClient.nationalCurriculumInsightsHub).toHaveBeenCalledWith({
        previewMode: false,
      });
      if (kind !== "hub") {
        expect(
          CMSClient.nationalCurriculumInsightsSubjectBySlug,
        ).toHaveBeenCalledWith("science", { previewMode: false });
      }
    },
  );

  it.each(
    [
      undefined,
      ["science"],
      ["science", "primary"],
      ["science", "primary", "ks1"],
    ].map((segments) => ({ segments })),
  )("does not expose draft-only content at $segments", async ({ segments }) => {
    jest
      .mocked(CMSClient.nationalCurriculumInsightsHub)
      .mockResolvedValue(null);

    await expect(
      CurriculumChangeExplainedPage(props(segments)),
    ).rejects.toThrow("404");
    expect(
      CMSClient.nationalCurriculumInsightsSubjectBySlug,
    ).not.toHaveBeenCalled();
  });

  it("does not expose an unpublished subject in a published hub", async () => {
    jest
      .mocked(CMSClient.nationalCurriculumInsightsSubjectBySlug)
      .mockResolvedValue(null);

    await expect(
      CurriculumChangeExplainedPage(props(["science"])),
    ).rejects.toThrow("404");
    expect(
      CMSClient.nationalCurriculumInsightsSubjectBySlug,
    ).toHaveBeenCalledWith("science", { previewMode: false });
  });

  it("does not expose unpublished phase and key-stage pages", async () => {
    jest
      .mocked(CMSClient.nationalCurriculumInsightsSubjectBySlug)
      .mockResolvedValue({ ...subjects[0]!, tabs: [] });

    await expect(
      CurriculumChangeExplainedPage(props(["science", "primary"])),
    ).rejects.toThrow("404");
    await expect(
      CurriculumChangeExplainedPage(props(["science", "primary", "ks1"])),
    ).rejects.toThrow("404");
  });

  it("allows authenticated draft previews", async () => {
    mockedDraftMode.mockResolvedValue({
      isEnabled: true,
      enable: jest.fn(),
      disable: jest.fn(),
    });

    expect(
      await CurriculumChangeExplainedPage(props(["science", "primary", "ks1"])),
    ).toBeDefined();
    expect(CMSClient.nationalCurriculumInsightsHub).toHaveBeenCalledWith({
      previewMode: true,
    });
    expect(
      CMSClient.nationalCurriculumInsightsSubjectBySlug,
    ).toHaveBeenCalledWith("science", { previewMode: true });
  });

  it.each(
    [
      ["unknown-subject"],
      ["science", "primary", "ks3"],
      ["science", "primary", "key-stage-1"],
      ["science", "primary", "ks1", "extra"],
      ["%"],
    ].map((segments) => ({ segments })),
  )(
    "uses not-found for unavailable or malformed content $segments",
    async ({ segments }) => {
      await expect(
        CurriculumChangeExplainedPage(props(segments)),
      ).rejects.toThrow("404");
    },
  );

  it("has a canonical short key-stage URL and stays out of indexing before launch", async () => {
    const metadata = await generateMetadata(
      props(["science", "primary", "ks1"]),
    );

    expect(metadata.alternates?.canonical).toBe(
      "/curriculum-change-explained/science/primary/ks1",
    );
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
