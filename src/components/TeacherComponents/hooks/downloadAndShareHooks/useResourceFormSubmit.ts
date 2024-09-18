import { useFeatureFlagEnabled } from "posthog-js/react";

import { getSubscriptionStatus } from "../../OnboardingForm/onboardingActions";
import { getContactDetails } from "../../helpers/downloadAndShareHelpers/getHubspotContact";

import useLocalStorageForDownloads from "./useLocalStorageForDownloads";

import type {
  DownloadResourceType,
  ResourceFormProps,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import downloadLessonResources from "@/components/SharedComponents/helpers/downloadAndShareHelpers/downloadLessonResources";
import { useFeatureFlaggedClerk } from "@/context/FeatureFlaggedClerk/FeatureFlaggedClerk";

type UseResourceFormProps = {
  onSubmit?: () => void;
  hasFullOnboarding: boolean;
} & ({ type: "share" } | { type: "download"; isLegacyDownload: boolean });

const useResourceFormSubmit = (props: UseResourceFormProps) => {
  const {
    setSchoolInLocalStorage,
    setEmailInLocalStorage,
    setTermsInLocalStorage,
  } = useLocalStorageForDownloads();

  // const auth = useFeatureFlaggedClerk().useAuth();
  const { useUser, useAuth } = useFeatureFlaggedClerk();
  const auth = useAuth();
  const { user } = useUser();
  const authFlagEnabled = useFeatureFlagEnabled("use-auth-owa") || false;

  const onSubmit = async (data: ResourceFormProps, slug: string) => {
    if (props.onSubmit) {
      props.onSubmit();
    }

    let email: string | undefined;
    let schoolId: string | undefined;
    let schoolName: string | undefined;
    let terms: boolean | undefined;

    // what do we want to do for share ??

    if (props.hasFullOnboarding && user?.primaryEmailAddress?.emailAddress) {
      // we fetch school and subscription status from hubspot

      email = user?.primaryEmailAddress?.emailAddress;

      const hubspotContact = await getContactDetails(email);
      const hubspotSubscriptionStatus = await getSubscriptionStatus(email);
      // console.log("hubspotSubscriptionStatus", hubspotContact);

      schoolId = hubspotContact.schoolId;
      schoolName = hubspotContact.schoolName;
      // schoolId = "hubspotContact.schoolId;";
      // schoolName = "hubspotContact.schoolName;";
      terms = hubspotSubscriptionStatus;
    } else {
      email = data?.email;
      schoolId = data?.school;
      schoolName = data?.schoolName;
      terms = data?.terms;
    }

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
      const accessToken = await auth.getToken();

      await downloadLessonResources(
        slug,
        downloads as DownloadResourceType[],
        props.isLegacyDownload,
        authFlagEnabled,
        accessToken,
      );
    }
  };
  console.log("ONSUBMIT");
  return { onSubmit };
};

export default useResourceFormSubmit;
