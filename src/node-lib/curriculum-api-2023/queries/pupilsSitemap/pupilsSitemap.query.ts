import { z } from "zod";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

const pupilsSitemapSchema = z.array(
  z.object({
    urls: z.string(),
  }),
);

export type PupilsSitemap = z.infer<typeof pupilsSitemapSchema>;

const pupilsSitemap = (sdk: Sdk) => async () => {
  const res = await sdk.pupilsSitemap();

  if (!res || res.pupilsSitemap.length === 0) {
    errorReporter("curriculum-api-2023::teachersSitemap")(
      new Error("Resource not found"),
      {
        severity: "warning",
        res,
      },
    );
    throw new OakError({ code: "curriculum-api/not-found" });
  }

  return pupilsSitemapSchema.parse(res.pupilsSitemap);
};

export default pupilsSitemap;
