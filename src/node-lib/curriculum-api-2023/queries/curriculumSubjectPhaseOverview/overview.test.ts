import sdk from "../../sdk";

import overviewQuery from "./overview.query";

test("throws a not found error if no unit is found", async () => {
  await expect(async () => {
    await overviewQuery({
      ...sdk,
    })({ subject: "", phase: "" });
  }).rejects.toThrow(`Resource not found`);
});
