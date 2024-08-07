import refreshedMvTimeSchema from "./refreshedMvTime.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

const refreshedMVTimeQuery =
  (sdk: Sdk) => async (args: { viewName: string }) => {
    const { viewName } = args;
    if (!viewName) {
      throw new OakError({ code: "getRefreshedMVTime/params-incorrect" });
    }

    console.log({ viewName });
    const res = await sdk.refreshedMVTime({
      viewName,
    });

    return refreshedMvTimeSchema.parse(res);
  };

export default refreshedMVTimeQuery;
