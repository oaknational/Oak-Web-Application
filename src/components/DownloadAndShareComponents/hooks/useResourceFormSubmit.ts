import hubspotSubmitForm from "../../../browser-lib/hubspot/forms/hubspotSubmitForm";
import type {
  DownloadResourceType,
  ResourceFormProps,
} from "../downloadAndShare.types";
import downloadLessonResources from "../helpers/downloadLessonResources";
import useUtmParams from "../../../hooks/useUtmParams";
import getHubspotUserToken from "../../../browser-lib/hubspot/forms/getHubspotUserToken";
import { getHubspotDownloadsFormPayload } from "../../../browser-lib/hubspot/forms/getHubspotFormPayloads";
import useAnalytics from "../../../context/Analytics/useAnalytics";
import getBrowserConfig from "../../../browser-lib/getBrowserConfig";

import useLocalStorageForDownloads from "./useLocalStorageForDownloads";

const hubspotDownloadsFormId = getBrowserConfig("hubspotDownloadsFormId");

type UseResourceFormProps = {
  onSubmit?: () => void;
} & ({ type: "share" } | { type: "download"; isLegacyDownload: boolean });

const useResourceFormSubmit = (props: UseResourceFormProps) => {
  const {
    setSchoolInLocalStorage,
    setEmailInLocalStorage,
    setTermsInLocalStorage,
  } = useLocalStorageForDownloads();
  const utmParams = useUtmParams();
  const { posthogDistinctId } = useAnalytics();

  const onSubmit = async (data: ResourceFormProps, slug: string) => {
    if (props.onSubmit) {
      props.onSubmit();
    }

    const hutk = getHubspotUserToken();

    const email = data?.email;
    const schoolId = data?.school;
    const schoolName = data?.schoolName;
    const terms = data?.terms;
    const downloads = data?.resources;

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
    if (props.type === "download") {
      const downloadsPayload = getHubspotDownloadsFormPayload({
        hutk,
        data: {
          ...data,
          ...utmParams,
          oakUserId: posthogDistinctId ? posthogDistinctId : undefined,
          schoolName:
            schoolId === "homeschool" || schoolId === "notListed"
              ? schoolId
              : schoolName,
        },
      });
      const hubspotFormResponse = await hubspotSubmitForm({
        hubspotFormId: hubspotDownloadsFormId,
        payload: downloadsPayload,
      });

      await downloadLessonResources(
        slug,
        downloads as DownloadResourceType[],
        props.isLegacyDownload,
      );
      return hubspotFormResponse;
    }
  };

  return { onSubmit };
};

export default useResourceFormSubmit;
