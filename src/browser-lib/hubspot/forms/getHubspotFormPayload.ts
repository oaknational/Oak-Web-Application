import { HubspotFormData } from "./hubspotSubmitForm";

const getHubspotFormPayload = (props: {
  data: HubspotFormData;
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

export default getHubspotFormPayload;
