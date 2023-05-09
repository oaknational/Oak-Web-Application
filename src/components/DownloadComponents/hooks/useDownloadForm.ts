import { hubspotSubmitForm } from "../../../browser-lib/hubspot/forms";
import type {
  DownloadFormProps,
  DownloadResourceType,
} from "../../../components/DownloadComponents/downloads.types";
import downloadLessonResources from "../helpers/downloadLessonResources";
import useUtmParams from "../../../hooks/useUtmParams";
import getHubspotUserToken from "../../../browser-lib/hubspot/forms/getHubspotUserToken";
import { getHubspotDownloadsFormPayload } from "../../../browser-lib/hubspot/forms/getHubspotFormPayloads";
import config from "../../../config/browser";

import useLocalStorageForDownloads from "./useLocalStorageForDownloads";

const hubspotDownloadsFormId = config.get("hubspotDownloadsFormId");

type UseDownloadFormProps = {
  onSubmit?: () => void;
};

const useDownloadForm = (props: UseDownloadFormProps = {}) => {
  const {
    setSchoolInLocalStorage,
    setEmailInLocalStorage,
    setTermsInLocalStorage,
  } = useLocalStorageForDownloads();
  const utmParams = useUtmParams();

  const onSubmit = async (data: DownloadFormProps, slug: string) => {
    if (props.onSubmit) {
      props.onSubmit();
    }

    const hutk = getHubspotUserToken();
    const downloadsPayload = getHubspotDownloadsFormPayload({
      hutk,
      data: { ...data, ...utmParams },
    });

    const hubspotFormResponse = await hubspotSubmitForm({
      hubspotFormId: hubspotDownloadsFormId,
      payload: downloadsPayload,
    });

    const email = data?.email;
    const schoolId = data?.school;
    const schoolName = data?.schoolName;
    const terms = data?.terms;
    const downloads = data?.downloads;

    if (email) {
      setEmailInLocalStorage(email);
    }

    if (schoolId) {
      if (schoolId === "homeschool" || schoolId === "notListed") {
        setSchoolInLocalStorage({
          schoolId,
          schoolName: schoolId,
        });
      } else {
        if (schoolName && schoolId) {
          setSchoolInLocalStorage({ schoolId, schoolName });
        }
      }
    }

    if (terms) {
      setTermsInLocalStorage(terms);
    }

    await downloadLessonResources(slug, downloads as DownloadResourceType[]);
    return hubspotFormResponse;
  };

  return { onSubmit };
};

export default useDownloadForm;
