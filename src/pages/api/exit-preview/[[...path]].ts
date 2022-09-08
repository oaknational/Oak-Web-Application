import type { NextApiHandler } from "next";
import { z } from "zod";

import { slugStringSchema } from "../preview/[[...path]]";

const preview: NextApiHandler = async (req, res) => {
  const redirectLocation = z
    .array(slugStringSchema)
    .transform((segments) => {
      return `/${segments.join("/")}`;
    })
    .parse(req.query.path || []);

  res.clearPreviewData();

  res.writeHead(307, { Location: redirectLocation });
  res.end();
};

export default preview;
