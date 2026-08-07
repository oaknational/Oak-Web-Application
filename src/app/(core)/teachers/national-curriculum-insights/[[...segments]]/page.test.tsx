/**
 * @jest-environment node
 */
import { draftMode } from "next/headers";

import NationalCurriculumInsightsPage from "./page";
import { localNationalCurriculumInsightsFixtures } from "./getNationalCurriculumInsightsData";

import CMSClient from "@/node-lib/cms";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  }),
}));
jest.mock("next/headers", () => ({ draftMode: jest.fn() }));
jest.mock("@/node-lib/cms", () => ({
  __esModule: true,
  default: {
    nationalCurriculumInsightsHub: jest.fn(),
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
    mockedDraftMode.mockResolvedValue(draftModeState(false));
    jest
      .mocked(CMSClient.nationalCurriculumInsightsHub)
      .mockResolvedValue(hub as never);
    jest
      .mocked(CMSClient.nationalCurriculumInsightsSubjectBySlug)
      .mockResolvedValue(science as never);
  });

  it("renders the subject overview at the subject root", async () => {
    const result = await NationalCurriculumInsightsPage({
      params: Promise.resolve({ segments: ["science"] }),
    });

    expect(result).toBeDefined();
    expect(
      CMSClient.nationalCurriculumInsightsSubjectBySlug,
    ).toHaveBeenCalledWith("science", { previewMode: false });
  });

  it("renders a configured phase beneath the subject", async () => {
    const result = await NationalCurriculumInsightsPage({
      params: Promise.resolve({ segments: ["science", "primary"] }),
    });

    expect(result).toBeDefined();
  });

  it("renders a configured key stage beneath its phase", async () => {
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
