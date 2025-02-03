import { Key, useState } from "react";
import useSWR from "swr";

import { School } from "./ResourcePageSchoolPicker";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

const reportError = errorReporter("SchoolPicker");

export const fetcher = async (queryUrl: string) => {
  const res = await fetch(queryUrl);
  if (res.ok) {
    return res.json();
  } else {
    // bug here
    const json = await res.json();
    const error = new OakError({
      code: "school-picker/fetch-suggestions",
      meta: {
        status: res.status,
        statusText: res.statusText,
        queryUrl,
        json,
      },
    });

    reportError(error);
    throw error;
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

  const { data, error } = useSWR(queryUrl, fetcher);

  const schoolsWithHomeschool = props.withHomeschool
    ? data?.concat([{ name: "Homeschool", urn: HOMESCHOOL_URN }])
    : data;

  const schoolsToReturn =
    schoolPickerInputValue.length > 2 && data ? schoolsWithHomeschool : [];

  return {
    schools: schoolsToReturn,
    error,
    setSchoolPickerInputValue,
    schoolPickerInputValue,
    selectedSchool,
    setSelectedSchool,
  };
}
