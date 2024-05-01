import { useMemo } from "react";

import {
  LS_KEY_EMAIL,
  LS_KEY_SCHOOL,
  LS_KEY_TERMS,
} from "@/config/localStorageKeys";
import {
  LS_KEY_EMAIL_SCHEMA,
  LS_KEY_SCHOOL_SCHEMA,
  LS_KEY_TERMS_SCHEMA,
} from "@/config/localStorageSchemas";
import {
  getLocalstorageWithSchema,
  setLocalstorageWithSchema,
} from "@/utils/localstorage";


type LocalStorageDownloadData = {
  schoolId: string;
  schoolName: string;
  schoolNotListed: boolean;
  email: string;
  termsAndConditions: boolean;
};
export function saveDownloadsDataToLocalStorage(
  data: LocalStorageDownloadData,
) {
  setLocalstorageWithSchema(LS_KEY_EMAIL, LS_KEY_EMAIL_SCHEMA, data.email);
  setLocalstorageWithSchema(LS_KEY_SCHOOL, LS_KEY_SCHOOL_SCHEMA, {
    schoolId: data.schoolNotListed ? "notListed" : data.schoolId,
    schoolName: data.schoolNotListed ? "notListed" : data.schoolName,
  });
  setLocalstorageWithSchema(
    LS_KEY_TERMS,
    LS_KEY_TERMS_SCHEMA,
    data.termsAndConditions,
  );
}

type parseFromLocalStorageDataOpts = {
  email?: string;
  schoolId?: string;
  schoolName?: string;
  termsAndConditions: boolean;
};
export function parseFromLocalStorageData({
  schoolId,
  email,
  termsAndConditions,
  schoolName,
}: parseFromLocalStorageDataOpts) {
  const isComplete =
    (Boolean(schoolId?.length) || Boolean(email?.length)) && termsAndConditions;
  const stripNotInList = (v: string | undefined) =>
    v === "notListed" ? undefined : v;

  return {
    isComplete: isComplete,
    schoolId: stripNotInList(schoolId),
    schoolName: stripNotInList(schoolName),
    schoolNotListed: schoolId === "notListed",
    email: email,
    termsAndConditions: termsAndConditions,
  };
}

export function useDownloadsLocalStorage() {
  return useMemo(() => {
    const email = getLocalstorageWithSchema(
      LS_KEY_EMAIL,
      LS_KEY_EMAIL_SCHEMA.optional(),
      { dflt: undefined },
    );
    const { schoolId, schoolName } = getLocalstorageWithSchema(
      LS_KEY_SCHOOL,
      LS_KEY_SCHOOL_SCHEMA,
      { dflt: { schoolId: undefined, schoolName: undefined } },
    );
    const termsAndConditions = getLocalstorageWithSchema(
      LS_KEY_TERMS,
      LS_KEY_TERMS_SCHEMA,
      { dflt: false },
    );

    return parseFromLocalStorageData({
      email,
      schoolId,
      schoolName,
      termsAndConditions,
    });
  }, []);
}
