/**
 * API route to generate a token for a signed URL for a Mux video or thumbnail.
 * Add key twenty_twenty=true to use the 2020 signing details.
 *
 * e.g. /api/video/signed_url?id=abc&type=video
 * e.g. /api/video/signed_url?id=old_video_id&type=video&twenty_twenty=true
 *
 * See https://www.npmjs.com/package/@mux/mux-node
 */

import Mux from "@mux/mux-node";
import type { NextApiRequest, NextApiResponse } from "next";

import getServerConfig from "@/node-lib/getServerConfig";

type Data = string;

// Set some base options we can use for a few different signing types
// 2020 content
const auth2020 = {
  keyId: getServerConfig("muxSigningKey2020"),
  keySecret: getServerConfig("muxSigningSecret2020"),
};
// 2023 content
const auth2023 = {
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
  const { id, type, twenty_twenty } = request.query;

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

  const use2020 = twenty_twenty === "true";
  const baseOptions = use2020 ? auth2020 : auth2023;

  const token = Mux.JWT.signPlaybackId(id, {
    ...baseOptions,
    type,
    expiration: "6h",
    // Probably only applies to thumbnails
    params: { time: "1" },
  });

  response.json(JSON.stringify({ token }));
}
