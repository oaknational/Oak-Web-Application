import { z } from "zod";

import useOakFetch from "./useOakFetch";

const useApi = () => {
  const oakFetch = useOakFetch();

  return {
    "/login": () =>
      oakFetch({
        url: "/api/login",
        method: "POST",
        responseDataSchema: z.object({
          id: z.number(),
          email: z.string(),
        }),
      }),
  };
};

export default useApi;
