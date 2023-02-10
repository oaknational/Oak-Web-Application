import { useState } from "react";
import useSWR from "swr";

import OakError from "../../errors/OakError";

import { School } from "./SchoolPicker";

type useSchoolPickerReturnProps = {
  data: School[];
  error: Error | null;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<
    string | number
  > | null>;
};

export default function useSchoolPicker(): useSchoolPickerReturnProps {
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] =
    useState<React.Dispatch<React.SetStateAction<string | number> | null>>("");

  const fetcher = (queryUrl: string) =>
    fetch(queryUrl).then((res) => {
      if (res.ok) {
        return res.json();
      } else if (res.status === 404) {
        return [];
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

  const queryUrl = `https://school-picker.thenational.academy/${inputValue}`;

  const { data, error } = useSWR(queryUrl, fetcher);

  return {
    data: data || [],
    error,
    setInputValue,
    inputValue,
    selectedValue,
    setSelectedValue,
  };
}
