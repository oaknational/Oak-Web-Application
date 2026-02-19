import { useLayoutEffect, useMemo, useState } from "react";

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

export function defaultValueWhenThrown<T = undefined>(
  throwableFn: () => T,
  dflt: T,
) {
  try {
    return throwableFn();
  } catch (_error) {
    return dflt;
  }
}

export function useDownloadsLocalStorage() {
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    if (globalThis.localStorage) {
      setIsLoading(false);
    }
  }, []);

  const data = useMemo(() => {
    if (isLoading) {
      return undefined;
    } else {
      const email = defaultValueWhenThrown(() => {
        return getLocalstorageWithSchema(
          LS_KEY_EMAIL,
          LS_KEY_EMAIL_SCHEMA.optional(),
        );
      }, undefined);
      const { schoolId, schoolName } = defaultValueWhenThrown(
        () => {
          return getLocalstorageWithSchema(LS_KEY_SCHOOL, LS_KEY_SCHOOL_SCHEMA);
        },
        { schoolId: undefined, schoolName: undefined },
      );
      const termsAndConditions = defaultValueWhenThrown(() => {
        return getLocalstorageWithSchema(LS_KEY_TERMS, LS_KEY_TERMS_SCHEMA);
      }, false);

      return parseFromLocalStorageData({
        email,
        schoolId,
        schoolName,
        termsAndConditions,
      });
    }
  }, [isLoading]);

  return { isLoading, data };
}
