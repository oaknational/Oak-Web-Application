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
