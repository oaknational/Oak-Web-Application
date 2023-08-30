import sdk from "../../sdk";

import curriculumOverviewQuery from "./curriculumOverview.query";

test("throws a not found error if no unit is found", async () => {
  await expect(async () => {
    await curriculumOverviewQuery({
      ...sdk,
    })({ slug: "" });
  }).rejects.toThrow(`Resource not found`);
});
