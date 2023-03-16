import { Key, useState } from "react";
import useSWR from "swr";

import errorReporter from "../../common-lib/error-reporter";
import OakError from "../../errors/OakError";

import { School } from "./SchoolPicker";
const reportError = errorReporter("SchoolPicker");

export const fetcher = (queryUrl: string) =>
  fetch(queryUrl).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      const error = new OakError({
        code: "school-picker/fetch-suggestions",
        meta: {
          status: res.status,
          statusText: res.statusText,
          queryUrl,
          json: res.json,
        },
      });

      reportError(error);
      throw error;
    }
  });

export type UseSchoolPickerReturnProps = {
  schools: School[];
  error: Error | null;
  schoolPickerInputValue: string;
  setSchoolPickerInputValue: React.Dispatch<React.SetStateAction<string>>;
  selectedSchool: Key | undefined;
  setSelectedSchool: React.Dispatch<React.SetStateAction<Key | undefined>>;
};

export default function useSchoolPicker(): UseSchoolPickerReturnProps {
  const [schoolPickerInputValue, setSchoolPickerInputValue] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<Key | undefined>();

  const queryUrl = `https://school-picker.thenational.academy/${schoolPickerInputValue}`;

  const { data, error } = useSWR(queryUrl, fetcher);

  return {
    schools: data || [],
    error,
    setSchoolPickerInputValue,
    schoolPickerInputValue,
    selectedSchool,
    setSelectedSchool,
  };
}
