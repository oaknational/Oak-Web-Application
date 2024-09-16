import { ParsedUrlQuery } from "querystring";

import { UseFormSetValue } from "react-hook-form";

import { UseOfOakFormProps } from "@/components/TeacherComponents/OnboardingForm/OnboardingForm.schema";

export const setQueryParamsInOnboardingForm = (
  query: ParsedUrlQuery,
  setValue: UseFormSetValue<UseOfOakFormProps>,
) => {
  const schoolName = query.schoolName;
  const school = query.school;
  const manualSchoolName = query.manualSchoolName;
  const schoolAddress = query.schoolAddress;
  const newsletterSignUp = query.newsletterSignUp;

  if (schoolName && typeof schoolName === "string") {
    setValue("schoolName", decodeURI(schoolName));
  }
  if (school && typeof school === "string") {
    setValue("school", decodeURI(school));
  }
  if (manualSchoolName && typeof manualSchoolName === "string") {
    setValue("manualSchoolName", decodeURI(manualSchoolName));
  }
  if (schoolAddress && typeof schoolAddress === "string") {
    setValue("schoolAddress", decodeURI(schoolAddress));
  }
  if (newsletterSignUp) {
    setValue("newsletterSignUp", newsletterSignUp === "true");
  }
};
