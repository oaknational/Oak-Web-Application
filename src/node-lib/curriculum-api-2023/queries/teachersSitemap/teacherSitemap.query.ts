import { z } from "zod";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

const teachersSitemapSchema = z.array(
  z.object({
    urls: z.string(),
  }),
);

const teachersSitemap = (sdk: Sdk) => async (firstHalf: boolean) => {
  const res = await sdk.teachersSitemap();

  if (!res || res.teachersSitemap.length === 0) {
    errorReporter("curriculum-api-2023::teachersSitemap")(
      new Error("Resource not found"),
      {
        severity: "warning",
        res,
      },
    );
    throw new OakError({ code: "curriculum-api/not-found" });
  }

  const middleIndex = Math.floor(res.teachersSitemap.length / 2);
  const selectedHalf = firstHalf
    ? res.teachersSitemap.slice(0, middleIndex)
    : res.teachersSitemap.slice(middleIndex);

  return teachersSitemapSchema.parse(selectedHalf);
};

export default teachersSitemap;
