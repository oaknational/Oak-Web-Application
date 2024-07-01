import useSWR from "swr";

import OakError, { ErrorInfo } from "@/errors/OakError";

/*
 * Wraps and reports errors in an OakError object
 */
export function useFetch<T>(url: string, errorCode: ErrorInfo["code"]) {
  const { data, error, isLoading } = useSWR<T, OakError>(
    url,
    (queryUrl: string) => {
      return fetch(queryUrl)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            const error = new OakError({
              code: errorCode,
              meta: {
                status: res.status,
                statusText: res.statusText,
                queryUrl,
              },
            });

            // TODO: Where should I be reporting
            // reportError(error);
            throw error;
          }
        })
        .catch((err) => {
          const error = new OakError({
            code: errorCode,
            originalError: err,
          });

          // TODO: Where should I be reporting
          // reportError(error);
          throw error;
        });
    },
  );
  return { data, error, isLoading } as const;
}
