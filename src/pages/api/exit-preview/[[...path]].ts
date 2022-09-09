import type { NextApiHandler } from "next";
import { z } from "zod";

import errorReporter from "../../../common-lib/error-reporter";
import OakError from "../../../errors/OakError";
import { slugStringSchema } from "../preview/[[...path]]";

const reportError = errorReporter("/api/exit-preview/[[...path]]");

const preview: NextApiHandler = async (req, res) => {
  try {
    const redirectLocation = z
      .array(slugStringSchema)
      .transform((segments) => {
        return `/${segments.join("/")}`;
      })
      .parse(req.query.path);

    res.clearPreviewData();

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
