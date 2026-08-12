import {
  emailRequiredSchema,
  newsletterSignupRoleSchema,
  schoolIdSchema,
  nameInputSchema,
} from "./CampaignNewsletterSignup.schema";

describe("emailRequiredSchema", () => {
  test("valid email", () => {
    const result = emailRequiredSchema.safeParse("teacher@example.com");
    expect(result.success).toEqual(true);
  });

  test("error if empty string", () => {
    const result = emailRequiredSchema.safeParse("");
    expect(result.success).toEqual(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Please enter a valid email address",
      );
    }
  });

  test("error if email is missing (undefined)", () => {
    const result = emailRequiredSchema.safeParse(undefined);
    expect(result.success).toEqual(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Please enter a valid email address",
      );
    }
  });

  test("error if email format is invalid", () => {
    const result = emailRequiredSchema.safeParse("not-an-email");
    expect(result.success).toEqual(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Please enter a valid email address",
      );
    }
  });
});

describe("schoolIdSchema", () => {
  test("valid schoolId", () => {
    const result = schoolIdSchema.safeParse("school-123");
    expect(result.success).toEqual(true);
  });

  test("error if empty string", () => {
    const result = schoolIdSchema.safeParse("");
    expect(result.success).toEqual(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Select school, type ‘homeschool’ or tick ‘My school isn’t listed’",
      );
    }
  });

  test("error if schoolId is missing (undefined)", () => {
    const result = schoolIdSchema.safeParse(undefined);
    expect(result.success).toEqual(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Select school, type ‘homeschool’ or tick ‘My school isn’t listed’",
      );
    }
  });
});

describe("nameInputSchema", () => {
  test("valid name", () => {
    const result = nameInputSchema.safeParse("Niko Bellic");
    expect(result.success).toEqual(true);
  });

  test("error if empty string", () => {
    const result = nameInputSchema.safeParse("");
    expect(result.success).toEqual(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Please enter your name");
    }
  });

  test("error if name is missing (undefined)", () => {
    const result = nameInputSchema.safeParse(undefined);
    expect(result.success).toEqual(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Please enter your name");
    }
  });
});

describe("newsletterSignupRoleSchema", () => {
  test("valid", () => {
    const result = newsletterSignupRoleSchema.safeParse({ eduRole: "testing" });
    expect(result.success).toEqual(true);
  });

  test("valid", () => {
    const result = newsletterSignupRoleSchema.safeParse({ eduRole: 123 });
    expect(result.success).toEqual(false);
  });

  test("error if less than 1 char", () => {
    const result = newsletterSignupRoleSchema.safeParse({ eduRole: "" });
    expect(result.success).toEqual(false);
  });
});
