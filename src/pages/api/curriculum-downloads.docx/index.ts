import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Buffer>,
) {
  const buffer = await (
    await fetch(
      "https://storage.googleapis.com/oak-curriculum-download/template-prefixed-fonts.docx",
    )
  ).arrayBuffer();
  res
    .setHeader("content-type", "application/msword")
    .status(200)
    .send(Buffer.from(buffer));
}
