import { useUser } from "@clerk/nextjs";
import useSWR, { SWRConfiguration } from "swr";

export const useGetEducatorData = <T>(
  url: string,
  config?: SWRConfiguration<T>,
) => {
  const { isSignedIn } = useUser();
  const { data, error, isLoading, mutate } = useSWR<T>(
    isSignedIn ? url : null,
    async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status !== 401) {
          const err = await response.json();
          throw new Error(err);
        }
      }
      const data = await response.json();
      return data;
    },
    config,
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
