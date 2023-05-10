import { DownloadFormProps } from "../../../components/DownloadComponents/downloads.types";
import { UtmParams } from "../../../hooks/useUtmParams";

import { HubspotPayload } from "./hubspotSubmitForm";

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

export const getUtmSnakeCaseData = (data: UtmParams) => {
  return {
    latest_utm_campaign: data.utm_campaign,
    latest_utm_content: data.utm_content,
    latest_utm_medium: data.utm_medium,
    latest_utm_source: data.utm_source,
    latest_utm_term: data.utm_term,
  };
};

export const getSnakeCaseData = (data: NewsletterHubspotFormData) => {
  return {
    email: data.email,
    email_text_only: data.emailTextOnly,
    full_name: data.name,
    user_type: data.userRole,
    oak_user_id: data.oakUserId,
    ...getUtmSnakeCaseData(data),
  };
};

export type NewsletterSnakeCaseData = typeof getSnakeCaseData extends (
  data: infer T
) => infer U
  ? U
  : never;
export type DownloadsHubspotFormData = DownloadFormProps & UtmParams;
export const getDownloadsSnakeCaseData = (data: DownloadsHubspotFormData) => {
  return {
    email: data.email,
    contact_school_name: data.schoolName,
    contact_school_urn: data.school.split("-")[0],
    ...getUtmSnakeCaseData(data),
  };
};

export type DownloadsSnakeCaseData = typeof getDownloadsSnakeCaseData extends (
  data: infer T
) => infer U
  ? U
  : never;

export const getPayload = (
  snakeCaseData: NewsletterSnakeCaseData | DownloadsSnakeCaseData,
  hutk?: string
) => {
  return {
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
};

export const getHubspotNewsletterPayload = (props: {
  data: NewsletterHubspotFormData;
  hutk?: string;
}) => {
  const { hutk, data } = props;
  const snakeCaseData = getSnakeCaseData(data);

  const payload = getPayload(snakeCaseData, hutk);

  return payload;
};

export const getHubspotDownloadsFormPayload = (props: {
  data: DownloadsHubspotFormData;
  hutk?: string;
}): HubspotPayload => {
  const { hutk, data } = props;
  const snakeCaseData = getDownloadsSnakeCaseData(data);

  const payload = getPayload(snakeCaseData, hutk);

  return payload;
};
