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

  test("throws a not found error if no valid subject phase is found", async () => {
    await expect(async () => {
      await curriculumOverviewQuery({
        ...sdk,
        curriculumOverview: jest.fn(() =>
          Promise.resolve({ curriculumOverview: [] }),
        ),
      })({
        subjectSlug: "alchemy",
        phaseSlug: "secondary",
      });
    }).rejects.toThrow(`Resource not found`);
  });
});
