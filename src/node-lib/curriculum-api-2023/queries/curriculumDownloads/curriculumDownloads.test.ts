import sdk from "../../sdk";

import curriculumDownloadsQuery from "./curriculumDownloads.query";
test("throws a not found error if no slug is found", async () => {
  await expect(async () => {
    await curriculumDownloadsQuery({
      ...sdk,
    })({ slug: "" });
  }).rejects.toThrow(`Resource not found`);
});
