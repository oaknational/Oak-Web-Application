/**
 * API route to generate a token for a signed URL for a Mux video or thumbnail.
 *
 * e.g. /api/video/signed_url?id=abc&type=video
 *
 * See https://www.npmjs.com/package/@mux/mux-node
 */

import Mux from "@mux/mux-node";
import type { NextApiRequest, NextApiResponse } from "next";

import getServerConfig from "@/node-lib/getServerConfig";

type Data = string;

// Set some base options we can use for a few different signing types
const baseOptions = {
  keyId: getServerConfig("muxSigningKey"),
  keySecret: getServerConfig("muxSigningSecret"),
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  return handleRequest(req, res);
}

async function handleRequest(
  request: NextApiRequest,
  response: NextApiResponse<Data>,
) {
  const { id, type } = request.query;

  if (!id || !type) {
    response.status(400).json("Must provide an id and a type query parameter");
    return;
  }

  if (Array.isArray(id) || Array.isArray(type)) {
    response
      .status(400)
      .json("Must provide a single id and a single type query parameter");
    return;
  }

  const token = Mux.JWT.signPlaybackId(id, {
    ...baseOptions,
    type,
    expiration: "6h",
    // Probably only applies to thumbnails
    params: { time: "1" },
  });

  response.json(JSON.stringify({ token }));
}
