import {
  INSIGHTS_NEWSLETTER_FORM_ID,
  insightsNewsletterRoleValue,
} from "./newsletter";

import { getHubspotNewsletterPayload } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";

describe("Insights newsletter destination", () => {
  it("uses the dedicated curriculum form", () => {
    expect(INSIGHTS_NEWSLETTER_FORM_ID).toBe(
      "8ac9e587-6033-4519-a373-1852b635c43e",
    );
  });

  it.each([
    ["Senior leader", "Deputy/SLT"],
    ["Headteacher or principal", "Headteacher"],
    ["Trust leader", "MAT Principal/CEO"],
    ["Teaching assistant or support staff", "Teaching Assistant"],
    ["Trainee teacher", "Trainee Teacher"],
  ])("sends %s as %s to HubSpot", (label, value) => {
    expect(insightsNewsletterRoleValue(label)).toBe(value);
  });

  it("includes the campaign fields without a school URN or generic user type", () => {
    const data = {
      name: "Example Teacher",
      email: "teacher@example.com",
      userRole: "" as const,
      eduRole: insightsNewsletterRoleValue(
        "Subject lead or head of department",
      ),
      schoolName: "Example School",
      utm_campaign: "curriculum",
    };
    const payload = getHubspotNewsletterPayload({ data, hutk: undefined });
    expect(payload.fields).toEqual(
      expect.arrayContaining([
        { name: "full_name", value: "Example Teacher" },
        { name: "email", value: "teacher@example.com" },
        { name: "edu_user_role_type", value: "Head of Department" },
        { name: "contact_school_name", value: "Example School" },
        { name: "latest_utm_campaign", value: "curriculum" },
      ]),
    );
    expect(payload.fields.map((field) => field.name)).not.toEqual(
      expect.arrayContaining(["contact_school_urn", "user_type"]),
    );
  });
});
