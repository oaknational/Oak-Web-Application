import { programmeFieldsFixture } from "@oaknational/oak-curriculum-schema";

import sdk from "../../sdk";

import teachersUnitProgrammeQuery from "./teachersUnitProgramme.query";

describe("teachersUnitProgramme", () => {
  it("throws a not found error if nothing is returned", async () => {
    await expect(async () => {
      await teachersUnitProgrammeQuery({
        ...sdk,
        teachersUnitProgrammes: jest.fn(() =>
          Promise.resolve({ unitInProgrammes: [] }),
        ),
      })({
        unitSlug: "unit-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  it("throws an error if the response data is invalid", async () => {
    await expect(async () => {
      await teachersUnitProgrammeQuery({
        ...sdk,
        teachersUnitProgrammes: jest.fn(() =>
          Promise.resolve({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            unitInProgrammes: [{ programmeslug: "wrong" } as any],
          }),
        ),
      })({
        unitSlug: "unit-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  it("returns data in the correct shape", async () => {
    const res = await teachersUnitProgrammeQuery({
      ...sdk,
      teachersUnitProgrammes: jest.fn(() =>
        Promise.resolve({
          unitInProgrammes: [
            {
              programme_slug: "programme-1",
              programme_fields: programmeFieldsFixture(),
            },
          ],
        }),
      ),
    })({ unitSlug: "unit-slug" });

    expect(res).toHaveLength(1);
    expect(res[0]?.programme_slug).toEqual("programme-1");
  });
});
