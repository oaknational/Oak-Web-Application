import sdk from "../../sdk";

import overviewQuery from "./overview.query";

test("throws a not found error if no unit is found", async () => {
  await expect(async () => {
    await overviewQuery({
      ...sdk,
    })({ slug: "" });
  }).rejects.toThrow(`Resource not found`);
});

test("throws a not found error if only subject is found", async () => {
  await expect(async () => {
    await overviewQuery({
      ...sdk,
    })({ slug: "maths" });
  }).rejects.toThrow(`Resource not found`);
});
