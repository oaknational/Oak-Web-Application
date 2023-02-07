import { useState } from "react";
import useSWR from "swr";

import OakError from "../../errors/OakError";

import { School } from "./SchoolPicker";

type useSchoolPickerReturnProps = {
  data: School[];
  error: Error;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
};

export default function useSchoolPicker(): useSchoolPickerReturnProps {
  const [inputValue, setInputValue] = useState("");

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
    data,
    error,
    setInputValue,
    inputValue,
  };
}
