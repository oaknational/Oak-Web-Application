import sdk from "../../sdk";

import curriculumUnitsQuery from "./curriculumUnits.query";

test("throws a not found error if no slug is found", async () => {
  await expect(async () => {
    await curriculumUnitsQuery({
      ...sdk,
    })({ slug: "" });
  }).rejects.toThrow(`Resource not found`);
});
