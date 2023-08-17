import sdk from "../../sdk";

import curriculumHeaderQuery from "./curriculumHeader.query";

test("throws a not found error if no slug is found", async () => {
  await expect(async () => {
    await curriculumHeaderQuery({
      ...sdk,
    })({ slug: "" });
  }).rejects.toThrow(`Resource not found`);
});
