/** The curriculum campaign has its own destination, separate from the global newsletter. */
export const INSIGHTS_NEWSLETTER_FORM_ID =
  "8ac9e587-6033-4519-a373-1852b635c43e";
export const INSIGHTS_NEWSLETTER_PORTAL_ID = "19961797";

/** Map role labels to existing HubSpot values for the dedicated curriculum form. */
export const insightsNewsletterRoleValue = (role: string): string => {
  switch (role) {
    case "Subject lead or head of department":
      return "Head of Department";
    case "Classroom teacher":
      return "Subject Specialist";
    case "Senior leader":
      return "Deputy/SLT";
    case "Headteacher or principal":
      return "Headteacher";
    case "Trust leader":
      return "MAT Principal/CEO";
    case "Teaching assistant or support staff":
      return "Teaching Assistant";
    case "Trainee teacher":
      return "Trainee Teacher";
    default:
      return role;
  }
};
