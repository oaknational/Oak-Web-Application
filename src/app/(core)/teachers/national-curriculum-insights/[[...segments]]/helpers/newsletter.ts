/** The curriculum campaign has its own destination, separate from the global newsletter. */
export const INSIGHTS_NEWSLETTER_FORM_ID =
  "8ac9e587-6033-4519-a373-1852b635c43e";
export const INSIGHTS_NEWSLETTER_PORTAL_ID = "19961797";

/** Keep the familiar role labels while sending the campaign form's option values. */
export const insightsNewsletterRoleValue = (role: string): string => {
  switch (role) {
    case "Head of Dept/Year":
      return "Head of Department";
    case "Teacher/Subject Specialist":
      return "Subject Specialist";
    default:
      return role;
  }
};
