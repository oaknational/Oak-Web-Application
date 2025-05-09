import useSWR from "swr";

export const useGetEducatorData = (url: string) => {
  const { data, error, isLoading } = useSWR(url, async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  });

  return {
    data,
    error,
    isLoading,
  };
};
