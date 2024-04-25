import { z } from "zod";

// import errorReporter from "../../../../common-lib/error-reporter";
import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

const teachersSitemapSchema = z.array(
  z.object({
    urls: z.string(),
  }),
);

const teachersSitemap = (sdk: Sdk) => async () => {
  const res = await sdk.teachersSitemap();

  if (!res.teachersSitemap) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }

  return teachersSitemapSchema.parse(res.teachersSitemap);
};

export default teachersSitemap;
