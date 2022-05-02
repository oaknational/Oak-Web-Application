import { z } from "zod";

import useOakFetch from "./useOakFetch";

const useApi = () => {
  const oakFetch = useOakFetch();

  return {
    "/user": ({ accessToken }: { accessToken: string }) =>
      oakFetch({
        url: "/api/user",
        method: "POST",
        responseDataSchema: z.object({
          id: z.string(),
          email: z.string(),
        }),
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      }),
  };
};

export default useApi;
