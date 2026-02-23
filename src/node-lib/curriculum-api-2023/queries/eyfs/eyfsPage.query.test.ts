import {
  lessonDataFixture,
  programmeFieldsFixture,
  unitDataFixture,
} from "@oaknational/oak-curriculum-schema";

import sdk from "../../sdk";

import eyfsPageQuery from "./eyfsPage.query";

describe("eyfs page query", () => {
  it("throws a not found error if no lessons are found", async () => {
    await expect(async () => {
      await eyfsPageQuery({
        ...sdk,
        eyfsPage: jest.fn(() => Promise.resolve({ lessons: [], subjects: [] })),
      })({
        subjectSlug: "slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  it("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await eyfsPageQuery({
        ...sdk,
        eyfsPage: jest.fn(() =>
          Promise.resolve({
            lessons: [
              {
                programme_slug: "programme-slug",
                lesson_slug: null,
                lesson_data: lessonDataFixture(),
                programme_fields: programmeFieldsFixture(),
                unit_data: unitDataFixture(),
                features: {},
                order_in_unit: 1,
              },
            ],
            subjects: [],
          }),
        ),
      })({
        subjectSlug: "maths",
      });
    }).rejects.toThrow("lesson_slug");
  });
});
