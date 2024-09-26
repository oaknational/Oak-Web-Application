import useLocalStorageForDownloads from "../hooks/downloadAndShareHooks/useLocalStorageForDownloads";

import { SchoolSelectFormProps } from "./OnboardingForm.schema";

export function setOnboardingLocalStorage(
  localStorageForDownloads: ReturnType<typeof useLocalStorageForDownloads>,
  newsletterSignUp: boolean,
  data: SchoolSelectFormProps,
  userEmail?: string,
  userSubscribedInHubspot?: boolean,
) {
  if ("school" in data) {
    localStorageForDownloads.setSchoolInLocalStorage({
      schoolName: data.schoolName || data.school,
      schoolId: data.school,
    });
  } else if ("manualSchoolName" in data) {
    localStorageForDownloads.setSchoolInLocalStorage({
      schoolName: data.manualSchoolName,
      schoolId: data.manualSchoolName,
    });
  }

  userEmail &&
    (userSubscribedInHubspot ?? newsletterSignUp) &&
    localStorageForDownloads.setEmailInLocalStorage(userEmail); // adding email to the details form on download/share is the same as accepting the newsletter sigh up in onboarding

  localStorageForDownloads.setTermsInLocalStorage(true); // on sign up they are accepting terms so this is true
}
