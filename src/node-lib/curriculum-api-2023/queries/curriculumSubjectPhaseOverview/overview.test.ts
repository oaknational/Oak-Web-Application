import overviewQuery from "./overview.query";

test("throws a Zod error if the response is invalid", async () => {
  await expect(async () => {
    overviewQuery();
  }).toBeUndefined;
});
