import sdk from "../../sdk";

import curriculumOverviewQuery from "./curriculumOverview.query";

import { curriculumOverviewMVFixture } from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";

describe("curriculum overview query", () => {
  test("throws params incorrect error if slugs are blank", async () => {
    expect(async () => {
      await curriculumOverviewQuery(sdk)({
        subjectSlug: "",
        phaseSlug: "",
        examboardSlug: null,
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("matches fixture", async () => {
    const result = await curriculumOverviewQuery(sdk)({
      subjectSlug: "maths",
      phaseSlug: "secondary",
      examboardSlug: null,
    });
    expect(result).toEqual(curriculumOverviewMVFixture());
  });
});
