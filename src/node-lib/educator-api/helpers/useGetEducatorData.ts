import useSWR from "swr";

export const useGetEducatorData = (url: string) => {
  const { data, error, isLoading } = useSWR(url, async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err);
    }
    const data = await response.json();
    return data;
  });

  return {
    data,
    error,
    isLoading,
  };
};
