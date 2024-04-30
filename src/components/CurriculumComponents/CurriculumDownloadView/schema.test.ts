import { SafeParseError } from "zod";

import { submitSchema } from "./schema";

describe("CurriculumDownloadView / schema", () => {
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
    expect(error.errors[0]!.path).toEqual(["school"]);
  });
});
