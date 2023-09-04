// import sdk from "../../sdk";
import curriculumOverviewQuery from "./curriculumOverview.query";

import curriculumOverviewTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";

describe("curriculum overview query", () => {
  test("throws params incorrect error if slugs are blank", async () => {
    expect(async () => {
      await curriculumOverviewQuery()({
        // {
        //   ...sdk,
        //  curriculumOverview: jest.fn(() => Promise.resolve({ data: {} })),
        // }
        subjectSlug: "",
        phaseSlug: "",
        examboardSlug: null,
      });
    }).rejects.toThrow(`The params provided are incorrect`);
  });

  test("matches fixture", async () => {
    const result = await curriculumOverviewQuery()({
      // {
      //   ...sdk,
      //   curriculumOverview: jest.fn(() => Promise.resolve({ data: {} })),
      // }
      subjectSlug: "geography",
      phaseSlug: "primary",
      examboardSlug: null,
    });
    expect(result).toEqual(curriculumOverviewTabFixture());
  });
});
