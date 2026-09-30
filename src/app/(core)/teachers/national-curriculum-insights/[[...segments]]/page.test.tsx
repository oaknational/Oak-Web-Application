/**
 * @jest-environment node
 */

import { draftMode } from "next/headers";
import { permanentRedirect, redirect } from "next/navigation";

import { localNationalCurriculumInsightsFixtures } from "./__fixtures__/nationalCurriculumInsights";
import NationalCurriculumInsightsPage from "./page";

import CMSClient from "@/node-lib/cms";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  }),
  permanentRedirect: jest.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
  redirect: jest.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));
jest.mock("next/headers", () => ({ draftMode: jest.fn() }));
jest.mock("@/node-lib/cms", () => ({
  __esModule: true,
  default: {
    nationalCurriculumInsightsHub: jest.fn(),
    nationalCurriculumInsightsGuidancePage: jest.fn(),
    nationalCurriculumInsightsSubjectBySlug: jest.fn(),
  },
}));

const mockedDraftMode = jest.mocked(draftMode);
const hub = localNationalCurriculumInsightsFixtures.hub;
const science = localNationalCurriculumInsightsFixtures.subjects[0]!;
const draftModeState = (isEnabled: boolean) => ({
  isEnabled,
  enable: jest.fn(),
  disable: jest.fn(),
});

describe("National Curriculum Insights page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedDraftMode.mockResolvedValue(draftModeState(true));
    jest
      .mocked(CMSClient.nationalCurriculumInsightsHub)
      .mockResolvedValue(hub as never);
    jest
      .mocked(CMSClient.nationalCurriculumInsightsSubjectBySlug)
      .mockResolvedValue(science as never);
  });

  it.each([
    { segments: undefined },
    { segments: [] },
    { segments: ["science"] },
    { segments: ["science", "primary"] },
    { segments: ["science", "primary", "key-stage-1"] },
    { segments: ["science", "secondary", "key-stage-4"] },
  ])(
    "temporarily redirects public Insights routes before reading unpublished content: $segments",
    async ({ segments }) => {
      mockedDraftMode.mockResolvedValue(draftModeState(false));
      jest
        .mocked(CMSClient.nationalCurriculumInsightsHub)
        .mockResolvedValue(null);

      const href =
        "/curriculum-change-explained/guidance?utm_source=newsletter&tag=one&tag=two";
      await expect(
        NationalCurriculumInsightsPage({
          params: Promise.resolve({ segments }),
          searchParams: Promise.resolve({
            utm_source: "newsletter",
            tag: ["one", "two"],
          }),
        }),
      ).rejects.toThrow(`REDIRECT:${href}`);

      expect(redirect).toHaveBeenCalledWith(href);
      expect(permanentRedirect).not.toHaveBeenCalled();
      expect(CMSClient.nationalCurriculumInsightsHub).not.toHaveBeenCalled();
      expect(
        CMSClient.nationalCurriculumInsightsSubjectBySlug,
      ).not.toHaveBeenCalled();
      expect(
        CMSClient.nationalCurriculumInsightsGuidancePage,
      ).not.toHaveBeenCalled();
    },
  );

  it.each<{
    searchParams?: Record<string, string | string[] | undefined>;
    suffix: string;
  }>([
    { suffix: "" },
    { searchParams: {}, suffix: "" },
    {
      searchParams: { utm_source: "newsletter", tag: ["one", "two"] },
      suffix: "?utm_source=newsletter&tag=one&tag=two",
    },
    {
      searchParams: {
        missing: undefined,
        tags: [],
        q: "",
        topic: "science & maths",
      },
      suffix: "?q=&topic=science+%26+maths",
    },
  ])(
    "preserves query parameters in the guidance redirect: $suffix",
    async ({ searchParams, suffix }) => {
      mockedDraftMode.mockResolvedValue(draftModeState(false));
      jest
        .mocked(CMSClient.nationalCurriculumInsightsGuidancePage)
        .mockResolvedValue(
          await localNationalCurriculumInsightsFixtures.reader.nationalCurriculumInsightsGuidancePage(),
        );
      await expect(
        NationalCurriculumInsightsPage({
          params: Promise.resolve({ segments: ["guidance"] }),
          searchParams: searchParams
            ? Promise.resolve(searchParams)
            : undefined,
        }),
      ).rejects.toThrow(
        `REDIRECT:/curriculum-change-explained/guidance${suffix}`,
      );
      expect(permanentRedirect).toHaveBeenCalledWith(
        `/curriculum-change-explained/guidance${suffix}`,
      );
      expect(redirect).not.toHaveBeenCalled();
    },
  );

  it("keeps unpublished guidance unavailable at its previous URL", async () => {
    mockedDraftMode.mockResolvedValue(draftModeState(false));
    jest
      .mocked(CMSClient.nationalCurriculumInsightsGuidancePage)
      .mockResolvedValue(null);

    await expect(
      NationalCurriculumInsightsPage({
        params: Promise.resolve({ segments: ["guidance"] }),
        searchParams: Promise.resolve({ utm_source: "newsletter" }),
      }),
    ).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });

  it("renders the subject overview in draft preview", async () => {
    const result = await NationalCurriculumInsightsPage({
      params: Promise.resolve({ segments: ["science"] }),
    });

    expect(result).toBeDefined();
    expect(
      CMSClient.nationalCurriculumInsightsSubjectBySlug,
    ).toHaveBeenCalledWith("science", { previewMode: true });
  });

  it("renders a configured phase in draft preview", async () => {
    const result = await NationalCurriculumInsightsPage({
      params: Promise.resolve({ segments: ["science", "primary"] }),
    });

    expect(result).toBeDefined();
  });

  it("renders a configured key stage in draft preview", async () => {
    const result = await NationalCurriculumInsightsPage({
      params: Promise.resolve({
        segments: ["science", "primary", "key-stage-1"],
      }),
    });

    expect(result).toBeDefined();
  });

  it("passes Next draft mode to both CMS reads", async () => {
    mockedDraftMode.mockResolvedValue(draftModeState(true));

    await NationalCurriculumInsightsPage({
      params: Promise.resolve({ segments: ["science", "secondary"] }),
    });

    expect(CMSClient.nationalCurriculumInsightsHub).toHaveBeenCalledWith({
      previewMode: true,
    });
    expect(
      CMSClient.nationalCurriculumInsightsSubjectBySlug,
    ).toHaveBeenCalledWith("science", { previewMode: true });
  });

  it("uses not-found for malformed and unavailable routes", async () => {
    await expect(
      NationalCurriculumInsightsPage({
        params: Promise.resolve({ segments: ["primary", "science"] }),
      }),
    ).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    await expect(
      NationalCurriculumInsightsPage({
        params: Promise.resolve({
          segments: ["science", "primary", "key-stage-3"],
        }),
      }),
    ).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");

    jest
      .mocked(CMSClient.nationalCurriculumInsightsSubjectBySlug)
      .mockResolvedValue(null as never);
    await expect(
      NationalCurriculumInsightsPage({
        params: Promise.resolve({ segments: ["science", "primary"] }),
      }),
    ).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  });
});
