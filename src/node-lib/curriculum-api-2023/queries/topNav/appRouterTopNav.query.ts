import { curriculumApiWithCache } from "@/node-lib/cache";

const appRouterTopNavQuery = () =>
  curriculumApiWithCache({
    queryKey: "topNav",
    args: [],
  });

export default appRouterTopNavQuery;
