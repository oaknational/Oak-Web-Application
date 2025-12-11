import { newsletterSignupRoleSchema } from "./CampaignNewsletterSignup.schema";

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
