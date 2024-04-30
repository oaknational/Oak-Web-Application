import { SafeParseError } from "zod";

import {
  emailSchema,
  schoolSchema,
  submitSchema,
  termsAndConditionsSchema,
} from "./schema";

describe("CurriculumDownloadView / schema", () => {
  test("schoolSchema", () => {
    const out = schoolSchema.safeParse("");
    const error = (out as SafeParseError<unknown>).error;
    expect(error).toBeDefined();
    expect(error.errors).toHaveLength(1);
    expect(error.errors[0]!.message).toEqual(
      "Select school, type ‘homeschool’ or tick ‘My school isn’t listed’",
    );
  });
  test("emailSchema", () => {
    const out = emailSchema.safeParse("foobar");
    const error = (out as SafeParseError<unknown>).error;
    expect(error).toBeDefined();
    expect(error.errors).toHaveLength(1);
    expect(error.errors[0]!.message).toEqual(
      "Please enter a valid email address",
    );
  });
  test("termsAndConditionsSchema", () => {
    const out = termsAndConditionsSchema.safeParse(false);
    const error = (out as SafeParseError<unknown>).error;
    expect(error).toBeDefined();
    expect(error.errors).toHaveLength(1);
    expect(error.errors[0]!.message).toEqual(
      "Accept terms and conditions to continue",
    );
  });
  test("submitSchema", () => {
    const out = submitSchema.safeParse({
      school: undefined,
      schoolIsntListed: false,
      email: "test@example.com",
      termsAndConditionsSchema: true,
    });
    expect(out.success).toEqual(false);
    const error = (out as SafeParseError<unknown>).error;
    expect(error).toBeDefined();
    expect(error.errors).toHaveLength(1);
    expect(error.errors[0]!.message).toEqual(
      "Select school, type ‘homeschool’ or tick ‘My school isn’t listed’",
    );
  });
});
