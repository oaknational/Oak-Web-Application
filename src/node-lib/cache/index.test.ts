/**
 * @jest-environment node
 */
import { cacheLife, cacheTag } from "next/cache";

import { cmsWithCache, curriculumApiWithCache } from ".";

import CMSClient from "@/node-lib/cms";
import curriculumApi from "@/node-lib/curriculum-api-2023";

jest.mock("next/cache", () => ({
  cacheLife: jest.fn(),
  cacheTag: jest.fn(),
}));

jest.mock("@/node-lib/cms", () => ({
  __esModule: true,
  default: {
    homepage: jest.fn(),
    programmePageBySlug: jest.fn(),
    implementationGuides: jest.fn(),
  },
}));

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    curriculumOverview: jest.fn(),
    topNav: jest.fn(),
  },
}));

const mockCacheLife = jest.mocked(cacheLife);
const mockCacheTag = jest.mocked(cacheTag);
const mockTopNav = jest.mocked(curriculumApi.topNav);
const mockCurriculumOverview = jest.mocked(curriculumApi.curriculumOverview);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("applyCurriculumQueryCachePolicy", () => {
  it("runs a query without arguments and returns its response", async () => {
    const response = { teachers: null, pupils: null };
    mockTopNav.mockResolvedValueOnce(response);

    const result = await curriculumApiWithCache({
      queryKey: "topNav",
      args: [],
    });

    expect(result).toBe(response);
    expect(mockTopNav).toHaveBeenCalledTimes(1);
    expect(mockTopNav).toHaveBeenCalledWith();
    expect(mockCacheLife).toHaveBeenCalledWith("curriculum");
    expect(mockCacheTag).toHaveBeenCalledWith("curriculum-api");
  });

  it("passes query arguments and preserves additional tags", async () => {
    const args = {
      phaseSlug: "primary",
      subjectSlug: "maths",
      includeNonCurriculum: true,
    };

    await curriculumApiWithCache({
      queryKey: "curriculumOverview",
      args: [args],
      tags: ["programme-page-data"],
    });

    expect(mockCurriculumOverview).toHaveBeenCalledTimes(1);
    expect(mockCurriculumOverview).toHaveBeenCalledWith(args);
    expect(mockTopNav).not.toHaveBeenCalled();
    expect(mockCacheLife).toHaveBeenCalledWith("curriculum");
    expect(mockCacheTag).toHaveBeenCalledWith(
      "curriculum-api",
      "programme-page-data",
    );
  });

  it("applies the global tag when additional tags are empty", async () => {
    await curriculumApiWithCache({
      queryKey: "topNav",
      args: [],
      tags: [],
    });

    expect(mockCacheTag).toHaveBeenCalledWith("curriculum-api");
  });

  it("propagates query errors", async () => {
    const error = new Error("Curriculum query failed");
    mockTopNav.mockRejectedValueOnce(error);

    await expect(
      curriculumApiWithCache({ queryKey: "topNav", args: [] }),
    ).rejects.toBe(error);
  });
});

describe("cmsWithCache", () => {
  it("runs a query without arguments and returns its nullable result", async () => {
    jest.mocked(CMSClient.homepage).mockResolvedValueOnce(null);

    const result = await cmsWithCache({ queryKey: "homepage", args: [] });

    expect(result).toBeNull();
    expect(CMSClient.homepage).toHaveBeenCalledTimes(1);
    expect(CMSClient.homepage).toHaveBeenCalledWith();
    expect(mockCacheLife).toHaveBeenCalledWith("cms");
    expect(mockCacheTag).toHaveBeenCalledWith("cms");
  });

  it("passes multiple arguments and additional tags", async () => {
    await cmsWithCache({
      queryKey: "programmePageBySlug",
      args: ["maths-primary", { previewMode: false }],
      tags: ["programme-page-data"],
    });

    expect(CMSClient.programmePageBySlug).toHaveBeenCalledWith(
      "maths-primary",
      { previewMode: false },
    );
    expect(mockCacheLife).toHaveBeenCalledWith("cms");
    expect(mockCacheTag).toHaveBeenCalledWith("cms", "programme-page-data");
  });

  it("returns the query response", async () => {
    const response: Awaited<ReturnType<typeof CMSClient.implementationGuides>> =
      {};
    jest.mocked(CMSClient.implementationGuides).mockResolvedValueOnce(response);

    const result = await cmsWithCache({
      queryKey: "implementationGuides",
      args: [{ subjectTitle: "Maths", phaseSlug: "primary" }],
      tags: [],
    });

    expect(result).toBe(response);
    expect(mockCacheTag).toHaveBeenCalledWith("cms");
  });

  it("propagates CMS errors", async () => {
    const error = new Error("CMS query failed");
    jest.mocked(CMSClient.homepage).mockRejectedValueOnce(error);

    await expect(cmsWithCache({ queryKey: "homepage", args: [] })).rejects.toBe(
      error,
    );
  });
});
