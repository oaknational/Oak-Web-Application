import sdk from "../../sdk";

import curriculumOverviewQuery from "./curriculumOverview.query";
describe("curriculum overview query", () => {
  test("throws params incorrect error if slugs are blank", async () => {
    expect(async () => {
      await curriculumOverviewQuery(sdk)({
        subjectSlug: "",
        phaseSlug: "",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("throws resource not found error if no rows are returned", async () => {
    await expect(async () => {
      await curriculumOverviewQuery(sdk)({
        subjectSlug: "alchemy",
        phaseSlug: "secondary",
      });
    }).rejects.toThrow(`Resource not found`);
  });
});
