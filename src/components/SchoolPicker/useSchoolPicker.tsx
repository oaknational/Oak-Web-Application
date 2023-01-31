import useSWR from "swr";

import OakError from "../../errors/OakError";

export default function useSchoolPicker(value: string) {
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

  const queryUrl = `https://school-picker.thenational.academy/${value}`;

  const { data, error } = useSWR(queryUrl, fetcher);

  return {
    suggestions: data || [],
    isLoading: !error && !data,
    error,
  };
}
