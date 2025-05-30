import { useUser } from "@clerk/nextjs";
import useSWR from "swr";

export const useGetEducatorData = <T>(url: string) => {
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
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
