import { DownloadFormProps } from "../../../components/DownloadComponents/downloads.types";
import { UtmParams } from "../../../hooks/useUtmParams";

import { HubspotPayload } from "./hubspotSubmitForm";

export const getHubspotDownloadsFormPayload = (props: {
  data: DownloadFormProps & UtmParams;
  hutk?: string;
}): HubspotPayload => {
  const { hutk, data } = props;
  const snakeCaseData = {
    email: data.email,
    contact_school_name: data.schoolName,
    contact_school_urn: data.school.split("-")[0],
    latest_utm_campaign: data.utm_campaign,
    latest_utm_content: data.utm_content,
    latest_utm_medium: data.utm_medium,
    latest_utm_source: data.utm_source,
    latest_utm_term: data.utm_term,
    // TODO oak_user_id: data.oakUserId,
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
