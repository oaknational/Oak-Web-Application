import useLocalStorageForDownloads from "../../hooks/downloadAndShareHooks/useLocalStorageForDownloads";
import { OnboardingFormProps } from "../OnboardingForm.schema";

import errorReporter from "@/common-lib/error-reporter";

export const reportError = errorReporter("setOnboardingLocalStorage");

interface OnboardingData {
  localStorageForDownloads: ReturnType<typeof useLocalStorageForDownloads>;
  userSubscribed: boolean;
  data: OnboardingFormProps;
  userEmail?: string;
}

export async function setOnboardingLocalStorage({
  localStorageForDownloads,
  data,
  userEmail,
  userSubscribed,
}: OnboardingData) {
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
  } else {
    localStorageForDownloads.setSchoolInLocalStorage({
      schoolName: "notListed",
      schoolId: "notListed",
    });
  }

  if (userEmail && userSubscribed) {
    localStorageForDownloads.setEmailInLocalStorage(userEmail);
  } else {
    localStorageForDownloads.setEmailInLocalStorage(""); // on download they subscribe by adding email, so this is empty if unsubscribed
  }

  localStorageForDownloads.setTermsInLocalStorage(true); // on sign up they are accepting terms so this is true
}
