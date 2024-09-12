import { ParsedUrlQuery, encode } from "querystring";

import {
  ManualSchoolFormValues,
  SchoolSelectFormProps,
  UkSchoolFormValues,
} from "./OnboardingForm.schema";

export const getQueryParamsFromOnboardingFormData = (
  data: SchoolSelectFormProps,
  query: ParsedUrlQuery,
) => {
  const encodedQueryData = new URLSearchParams(encode(query));
  encodedQueryData.set("newsletterSignUp", data.newsletterSignUp.toString());

  const schoolName = (data as UkSchoolFormValues).schoolName;
  const school = (data as UkSchoolFormValues).school;
  const schoolAddress = (data as ManualSchoolFormValues).schoolAddress;
  const manualSchoolName = (data as ManualSchoolFormValues).manualSchoolName;
  if (schoolName) {
    encodedQueryData.set("schoolName", encodeURI(schoolName));
  }
  if (school) {
    encodedQueryData.set("school", encodeURI(school));
  }
  if (schoolAddress) {
    encodedQueryData.set("schoolAddress", encodeURI(schoolAddress));
  }
  if (manualSchoolName) {
    encodedQueryData.set("manualSchoolName", encodeURI(manualSchoolName));
  }

  return encodedQueryData.toString();
};
