import type { NextApiHandler } from "next";
import { z } from "zod";

import config from "../../../config";
import errorReporter from "../../../common-lib/error-reporter";
import OakError from "../../../errors/OakError";

export const slugStringSchema = z.string().regex(/^\w+(?:[-_]\w+)*$/);

const reportError = errorReporter("/api/preview/[[...path]]");

const preview: NextApiHandler = async (req, res) => {
  /**
   * Next's example [1] suggests passing slug as a query and fetching
   * the related blog post and then doing an explicit redirect to a
   * known URL to avoid an open redirect vulnerability
   *
   * Using the [[...path]] naming and some validation we can skip
   * the lookup and having to be aware of every possible previewable
   * path within the app
   *
   * [1]: https://github.com/vercel/next.js/blob/canary/examples/cms-sanity/pages/api/preview.js
   */
  try {
    if (req.query.secret !== config.get("sanityPreviewSecret")) {
      throw new OakError({
        code: "preview/invalid-token",
      });
    }

    const redirectLocation = z
      .array(slugStringSchema)
      .transform((segments) => {
        return `/${segments.join("/")}`;
      })
      .parse(req.query.path);

    res.setPreviewData({ previewMode: "on" });

    res.writeHead(307, { Location: redirectLocation });
    res.end();
  } catch (error) {
    reportError(error);

    if (error instanceof OakError) {
      return res.status(error.config.responseStatusCode || 500).json({
        code: error.code,
      });
    }

    return res.status(500).json({
      code: "misc/unknown",
    });
  }
};

export default preview;
