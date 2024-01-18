import { describe, expect, it } from "vitest";

import sdk from "../../sdk";

import curriculumHeaderQuery from "./curriculumHeader.query";

describe("curriculumHeaderQuery", () => {
  it("throws an error if only subject is given", async () => {
    await expect(async () => {
      await curriculumHeaderQuery({
        ...sdk,
      })({ slug: "maths" });
    }).rejects.toThrow(`Resource not found`);
  });

  it("throws an error if only phase is given", async () => {
    await expect(async () => {
      await curriculumHeaderQuery({
        ...sdk,
      })({ slug: "-primary" });
    }).rejects.toThrow(`Resource not found`);
  });

  it("throws a not found error if no slug is found", async () => {
    await expect(async () => {
      await curriculumHeaderQuery({
        ...sdk,
      })({ slug: "" });
    }).rejects.toThrow(`Resource not found`);
  });

  it("tests if no exam board is passed in, then values are empty", async () => {
    const query = await curriculumHeaderQuery({
      ...sdk,
    })({ slug: "secondary-maths" });
    expect(query).toHaveProperty("examboard");
    expect(query.examboard).toBe("");
  });
});
