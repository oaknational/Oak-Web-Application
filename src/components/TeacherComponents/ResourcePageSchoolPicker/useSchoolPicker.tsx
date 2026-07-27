import { Key, useState } from "react";
import useSWR from "swr";

import { School } from "./ResourcePageSchoolPicker";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

const reportError = errorReporter("SchoolPicker");

export const fetcher = async (queryUrl: string) => {
  try {
    const res = await fetch(queryUrl);
    if (!res.ok) {
      if (res.status !== 400) {
        // Don't report bad request errors due to invalid input characters ie. 400 response
        throw new Error(
          new OakError({
            code: "school-picker/fetch-suggestions",
            meta: {
              queryUrl,
              status: res.status,
              statusText: res.statusText,
              json: await res.json(),
            },
          }),
        );
      }
    }
    return res.json();
  } catch (err) {
    let oakError = err;
    if (!(err instanceof OakError)) {
      oakError = new OakError({
        code: "school-picker/fetch-suggestions",
        originalError: err,
        meta: {
          queryUrl,
        },
      });
    }

    reportError(oakError);
    throw oakError;
  }
};

export const HOMESCHOOL_URN = "homeschool";

export type UseSchoolPickerReturnProps = {
  schools: School[];
  error: Error | null;
  schoolPickerInputValue: string;
  setSchoolPickerInputValue: React.Dispatch<React.SetStateAction<string>>;
  selectedSchool: Key | undefined;
  setSelectedSchool: React.Dispatch<React.SetStateAction<Key | undefined>>;
};

export default function useSchoolPicker(props: {
  withHomeschool: boolean;
}): UseSchoolPickerReturnProps {
  const [schoolPickerInputValue, setSchoolPickerInputValue] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<Key | undefined>();

  const queryUrl = `https://school-picker.thenational.academy/${schoolPickerInputValue}`;
  const shouldFetchSchools = schoolPickerInputValue.length > 2;

  const { data, error } = useSWR(shouldFetchSchools ? queryUrl : null, fetcher);

  const schoolsWithHomeschool = props.withHomeschool
    ? data?.concat([{ name: "Homeschool", urn: HOMESCHOOL_URN }])
    : data;

  const schoolsToReturn =
    shouldFetchSchools && data ? schoolsWithHomeschool : [];

  return {
    schools: schoolsToReturn,
    error,
    setSchoolPickerInputValue,
    schoolPickerInputValue,
    selectedSchool,
    setSelectedSchool,
  };
}
