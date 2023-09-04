// import sdk from "../../sdk";
import curriculumDownloadsQuery from "./curriculumDownloads.query";

import curriculumDownloadsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumDownloads.fixture";

describe("curriculum Downloads query", () => {
  test("throws params incorrect error if slugs are blank", async () => {
    await expect(async () => {
      await curriculumDownloadsQuery()({
        // {
        //   ...sdk,
        //  curriculumDownloads: jest.fn(() => Promise.resolve({ urls: [] })),
        // }
        subjectSlug: "",
        phaseSlug: "",
        examboardSlug: null,
      });
    }).rejects.toThrow(`The params provided are incorrect`);
  });

  test("matches fixture", async () => {
    const result = await curriculumDownloadsQuery()({
      // {
      //   ...sdk,
      //   curriculumOverview: jest.fn(() => Promise.resolve({ data: {} })),
      // }
      subjectSlug: "geography",
      phaseSlug: "primary",
      examboardSlug: null,
    });
    expect(result).toEqual(curriculumDownloadsTabFixture());
  });
});
