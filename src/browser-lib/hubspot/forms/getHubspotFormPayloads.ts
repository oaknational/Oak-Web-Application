import { UtmParams } from "../../../hooks/useUtmParams";

import { HubspotPayload } from "./hubspotSubmitForm";

export const USER_ROLES = ["Teacher", "Parent", "Student", "Other"] as const;
export type UserRole = (typeof USER_ROLES)[number];
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
  data: infer T,
) => infer U
  ? U
  : never;
export type DownloadsHubspotFormData = {
  school: string;
  schoolName?: string | undefined;
  email?: string | undefined;
} & UtmParams & { oakUserId?: string };
export const getDownloadsSnakeCaseData = (data: DownloadsHubspotFormData) => {
  return {
    email: data.email,
    contact_school_name: data.schoolName,
    contact_school_urn:
      data.school === "homeschool" || data.school === "notListed"
        ? undefined
        : data.school.split("-")[0],
    oak_user_id: data.oakUserId,
    ...getUtmSnakeCaseData(data),
  };
};

export type DownloadsSnakeCaseData = typeof getDownloadsSnakeCaseData extends (
  data: infer T,
) => infer U
  ? U
  : never;

export const getPayload = (
  snakeCaseData: NewsletterSnakeCaseData | DownloadsSnakeCaseData,
  hutk?: string,
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

type OnboardingUKTeacherProps = {
  school: string;
  schoolName: string;
};
const isOnboardingUKTeacherProps = (
  u: unknown,
): u is OnboardingUKTeacherProps => {
  return (
    typeof u === "object" &&
    u !== null &&
    "school" in u &&
    "schoolName" in u &&
    typeof (u as OnboardingUKTeacherProps).school === "string" &&
    typeof (u as OnboardingUKTeacherProps).schoolName === "string"
  );
};
type OnboardingInternationalTeacherProps = {
  schoolAddress: string;
  schoolName: string;
};
const isOnboardingInternationalTeacherProps = (
  u: unknown,
): u is OnboardingInternationalTeacherProps => {
  return (
    typeof u === "object" &&
    u !== null &&
    "schoolAddress" in u &&
    "schoolName" in u &&
    typeof (u as OnboardingInternationalTeacherProps).schoolAddress ===
      "string" &&
    typeof (u as OnboardingInternationalTeacherProps).schoolName === "string"
  );
};
type OnboardingNonTeacherProps = {
  role: string;
  other?: string;
};
const isOnboardingNonTeacherProps = (
  u: unknown,
): u is OnboardingNonTeacherProps => {
  return (
    typeof u === "object" &&
    u !== null &&
    "role" in u &&
    typeof (u as OnboardingNonTeacherProps).role === "string" &&
    ((u as OnboardingNonTeacherProps).role === "other" ? "other" in u : true)
  );
};
export type OnboardingHubspotFormData = {
  email?: string;
  oakUserId: string | null;
  newsletterSignUp: boolean;
} & UtmParams &
  (
    | OnboardingUKTeacherProps
    | OnboardingInternationalTeacherProps
    | OnboardingNonTeacherProps
  );

export const getHubspotOnboardingFormPayload = (props: {
  data: OnboardingHubspotFormData;
  hutk?: string;
}): HubspotPayload => {
  const { hutk, data } = props;
  const isUkTeacher = isOnboardingUKTeacherProps(data);
  const isInternationalTeacher = isOnboardingInternationalTeacherProps(data);
  const isNonTeacher = isOnboardingNonTeacherProps(data);

  const snakeCaseData = {
    email: data.email,
    email_consent_on_account_creation: data.newsletterSignUp ? "Yes" : "No",
    do_you_work_in_a_school:
      isUkTeacher || isInternationalTeacher ? "Yes" : "No",
    contact_school_name:
      isUkTeacher || isInternationalTeacher ? data.schoolName : undefined,
    contact_school_urn: isUkTeacher ? data.school.split("-")[0] : undefined,
    manual_input_school_address: isInternationalTeacher
      ? data.schoolAddress
      : undefined,
    non_school_role_description: isNonTeacher ? data.role : undefined,
    non_school_role_description_freetext: isNonTeacher ? data.other : undefined,
    oak_user_id: data.oakUserId ?? undefined,
    ...getUtmSnakeCaseData(data),
  };

  const payload = getPayload(snakeCaseData, hutk);

  return payload;
};
