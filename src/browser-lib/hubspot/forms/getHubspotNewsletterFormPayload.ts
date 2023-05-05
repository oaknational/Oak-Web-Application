import { UtmParams } from "../../../hooks/useUtmParams";

export const USER_ROLES = ["Teacher", "Parent", "Student", "Other"] as const;
export type UserRole = typeof USER_ROLES[number];
export type NewsletterHubspotFormData = {
  // when sending email to 'fallback' form
  emailTextOnly?: string;
  email?: string;
  oakUserId?: string;
  name: string;
  /**
   * allow "" for userRole as it's easier [than null/undefined] to use as a
   * form value. It is stripped out in getHubspotFormPayload.
   */
  userRole: UserRole | "";
} & UtmParams;

const getHubspotNewsletterPayload = (props: {
  data: NewsletterHubspotFormData;
  hutk?: string;
}) => {
  const { hutk, data } = props;
  const snakeCaseData = {
    email: data.email,
    email_text_only: data.emailTextOnly,
    full_name: data.name,
    user_type: data.userRole,
    oak_user_id: data.oakUserId,
    latest_utm_campaign: data.utm_campaign,
    latest_utm_content: data.utm_content,
    latest_utm_medium: data.utm_medium,
    latest_utm_source: data.utm_source,
    latest_utm_term: data.utm_term,
  };

  const payload = {
    fields: Object.entries(snakeCaseData)
      .map(([name, value]) => {
        return {
          name,
          value,
        };
      })
      .filter((field) => field.value)
      .sort((a, b) => (a.name < b.name ? -1 : 1)),
    context: {
      // hutk param should only be sent if it exists
      ...(hutk ? { hutk } : {}),
      pageUri: document.location.href,
      pageName: document.title,
    },
  };

  return payload;
};

export default getHubspotNewsletterPayload;
