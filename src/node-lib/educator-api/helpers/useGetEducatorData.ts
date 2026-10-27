import { useUser } from "@clerk/nextjs";
import useSWR, { SWRConfiguration } from "swr";

export const useGetEducatorData = <T>(
  url: string,
  config?: SWRConfiguration<T>,
) => {
  const { isSignedIn, user } = useUser();
  const { data, error, isLoading, mutate } = useSWR<T>(
    isSignedIn && user?.id ? [url, user.id] : null,
    async ([requestUrl]: [string, string]) => {
      const response = await fetch(requestUrl);
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
