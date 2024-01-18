import { describe, expect, it } from "vitest";

import curriculumDownloadsQuery from "./curriculumDownloads.query";

import curriculumDownloadsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumDownloads.fixture";

describe("curriculum Downloads query", () => {
  it("throws params incorrect error if slugs are blank", async () => {
    await expect(async () => {
      await curriculumDownloadsQuery()({
        subjectSlug: "",
        phaseSlug: "",
        examboardSlug: null,
      });
    }).rejects.toThrow(`The params provided are incorrect`);
  });

  it("matches fixture", async () => {
    const result = await curriculumDownloadsQuery()({
      subjectSlug: "geography",
      phaseSlug: "primary",
      examboardSlug: null,
    });
    expect(result).toEqual(curriculumDownloadsTabFixture());
  });
});
