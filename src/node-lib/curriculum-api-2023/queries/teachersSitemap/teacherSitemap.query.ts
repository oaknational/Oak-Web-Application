import { z } from "zod";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

const teachersSitemapSchema = z.array(
  z.object({
    urls: z.string(),
  }),
);

export type TeachersSitemap = z.infer<typeof teachersSitemapSchema>;

const teachersSitemap = (sdk: Sdk) => async () => {
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

  return teachersSitemapSchema.parse(res.teachersSitemap);
};

export default teachersSitemap;
