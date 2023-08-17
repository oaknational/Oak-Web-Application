import curriculumUnitsQuery from "./curriculumUnits.query";

import sdk from "@/node-lib/curriculum-api-2023/sdk";

test("throws a not found error if no unit is found", async () => {
  await expect(async () => {
    await curriculumUnitsQuery({
      ...sdk,
    })({ slug: "" });
  }).rejects.toThrow(`Resource not found`);
});
