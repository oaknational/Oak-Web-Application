import curriculumDownloadsQuery from "./curriculumDownloads.query";

import curriculumDownloadsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumDownloads.fixture";

describe("curriculum Downloads query", () => {
  test("throws params incorrect error if slugs are blank", async () => {
    await expect(async () => {
      await curriculumDownloadsQuery()({
        subjectSlug: "",
        phaseSlug: "",
        ks4OptionSlug: null,
      });
    }).rejects.toThrow(`The params provided are incorrect`);
  });

  test("matches fixture", async () => {
    const result = await curriculumDownloadsQuery()({
      subjectSlug: "geography",
      phaseSlug: "primary",
      ks4OptionSlug: null,
    });
    expect(result).toEqual(curriculumDownloadsTabFixture());
  });
});
