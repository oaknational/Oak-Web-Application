/**
 * @jest-environment node
 */
import UnitPage, { generateMetadata } from "./page";

import teachersUnitOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersUnitOverview.fixture";

jest.mock("next/navigation", () => ({
  __esModule: true,
  notFound: () => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  },
}));

const mockTeachersUnitOverview = jest.fn();
const mockUnitProgramme = jest.fn();

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    teachersUnitOverview: (...args: unknown[]) =>
      mockTeachersUnitOverview(...args),
    teachersUnitProgramme: (...args: unknown[]) => mockUnitProgramme(...args),
  },
}));

const mockErrorReporter = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  initialiseBugsnag: jest.fn(),
  initialiseSentry: jest.fn(),
  default:
    () =>
    (...args: []) =>
      mockErrorReporter(...args),
}));

const defaultParams = {
  slug: "biology-primary-ks3",
  unitSlug: "cells",
};

describe("UnitPage", () => {
  beforeEach(() => {
    mockTeachersUnitOverview.mockResolvedValue(teachersUnitOverviewFixture());
    mockUnitProgramme.mockResolvedValue([
      { programme_slug: "biology-primary-ks3", programmeFields: {} },
    ]);
  });
  it("renders 404 when data is not found", async () => {
    mockTeachersUnitOverview.mockRejectedValue(
      new Error("NEXT_HTTP_ERROR_FALLBACK;404"),
    );

    await expect(
      UnitPage({
        params: Promise.resolve(defaultParams),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});

describe("generateMetadata", () => {
  it("returns empty object when fetch fails", async () => {
    mockTeachersUnitOverview.mockRejectedValue(new Error("Not found"));

    const result = await generateMetadata({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result).toEqual({});
  });

  it("generates metadata with correct title and description", async () => {
    mockTeachersUnitOverview.mockResolvedValue(teachersUnitOverviewFixture());

    const result = await generateMetadata({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result.title).toBe("Cells KS3 | Y7 Biology | Lesson Resources");
    expect(result.description).toBe(
      "Free lessons and teaching resources about cells",
    );
    expect(result.openGraph?.title).toBe(
      "Cells KS3 | Y7 Biology | Lesson Resources",
    );
    expect(result.twitter?.title).toBe(
      "Cells KS3 | Y7 Biology | Lesson Resources",
    );
  });
  it("generates metadata with ks4 options", async () => {
    mockTeachersUnitOverview.mockResolvedValue(
      teachersUnitOverviewFixture({
        tierTitle: "Higher",
        examBoardTitle: "Edexcel",
        pathwayTitle: "GCSE",
        year: "11",
        keyStageSlug: "ks4",
      }),
    );

    const result = await generateMetadata({
      params: Promise.resolve({
        slug: "maths-secondary-ks4-aqa",
        unitSlug: "geometry-abc123",
      }),
      searchParams: Promise.resolve({}),
    });

    expect(result.title).toEqual(
      "Cells GCSE | KS4 | Y11 Biology Higher Edexcel | Lesson Resources",
    );
  });
});
