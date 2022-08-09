import type { NextApiHandler } from "next";

const exit: NextApiHandler = async (_, res) => {
  res.clearPreviewData();
  res.writeHead(307, { Location: "/" });
  res.end();
};

export default exit;
