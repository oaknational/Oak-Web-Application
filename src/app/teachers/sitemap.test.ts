import sitemap from "./sitemap";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import curriculumPhaseOptionsFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumPhaseOptions.fixture";
import { teachersSitemapDataFixtureCamelCase } from "@/node-lib/curriculum-api-2023/fixtures/teachersSiteMap.fixture";

const mockReportError = jest.fn();

jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: unknown[]) =>
      mockReportError(...args),
}));

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    teachersSitemap: jest.fn(),
    curriculumPhaseOptions: jest.fn(),
  },
}));

describe("teachers sitemap", () => {
  beforeEach(() => {
    process.env.SITEMAP_BASE_URL = "http://localhost:3000";
    mockReportError.mockReset();
    jest
      .mocked(curriculumApi2023.teachersSitemap)
      .mockResolvedValue(teachersSitemapDataFixtureCamelCase);
    jest
      .mocked(curriculumApi2023.curriculumPhaseOptions)
      .mockResolvedValue(curriculumPhaseOptionsFixture());
  });

  afterEach(() => {
    process.env.SITEMAP_BASE_URL = "";
  });

  it("returns integrated programme, unit, and lesson entries", async () => {
    const entries = await sitemap();

    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0]?.url).toContain("/programmes/");
    expect(curriculumApi2023.teachersSitemap).toHaveBeenCalled();
    expect(curriculumApi2023.curriculumPhaseOptions).toHaveBeenCalledWith({
      includeNonCurriculum: true,
    });
  });

  it("reports errors and rethrows", async () => {
    const apiError = new Error("sitemap API failed");
    jest.mocked(curriculumApi2023.teachersSitemap).mockRejectedValue(apiError);

    await expect(sitemap()).rejects.toThrow("sitemap API failed");

    expect(mockReportError).toHaveBeenCalledWith(apiError, {});
  });
});
