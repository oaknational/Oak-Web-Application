import { ZodSafeParseError } from "zod";

import {
  emailSchema,
  schoolIdSchema,
  submitSchema,
  termsAndConditionsSchema,
} from "./schema";

describe("CurriculumDownloadView / schema", () => {
  test("schoolIdSchema", () => {
    const out = schoolIdSchema.safeParse("");
    const error = (out as ZodSafeParseError<unknown>).error;
    expect(error).toBeDefined();
    expect(error.message).toEqual(
      "Select school, type ‘homeschool’ or tick ‘My school isn’t listed’",
    );
  });
  test("emailSchema", () => {
    const out = emailSchema.safeParse("foobar");
    const error = (out as ZodSafeParseError<unknown>).error;
    expect(error).toBeDefined();
    expect(error.message).toEqual("Please enter a valid email address");
  });
  test("termsAndConditionsSchema", () => {
    const out = termsAndConditionsSchema.safeParse(false);
    const error = (out as ZodSafeParseError<unknown>).error;
    expect(error).toBeDefined();
    expect(error.message).toEqual("Accept terms and conditions to continue");
  });
  test("submitSchema", () => {
    const out = submitSchema.safeParse({
      schoolId: undefined,
      schoolNotListed: false,
      email: "test@example.com",
      termsAndConditions: true,
    });
    expect(out.success).toEqual(false);
    const error = (out as ZodSafeParseError<unknown>).error;
    expect(error).toBeDefined();
    expect(error.message).toEqual(
      "Select school, type ‘homeschool’ or tick ‘My school isn’t listed’",
    );
  });

  test("submitSchema invalid schoolId", () => {
    const out = submitSchema.safeParse({
      schoolId: "",
      schoolNotListed: false,
      email: "test@example.com",
      termsAndConditions: true,
    });
    expect(out.success).toEqual(false);
    const error = (out as ZodSafeParseError<unknown>).error;
    expect(error).toBeDefined();
    expect(error.message).toEqual(
      "Select school, type ‘homeschool’ or tick ‘My school isn’t listed’",
    );
  });
});
