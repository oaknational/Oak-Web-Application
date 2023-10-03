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
  const { id, type, legacy } = request.query;

  if (!id || !type) {
    return response.status(400).json(
      JSON.stringify({
        message: "Must provide an 'id' and a 'type' query parameter",
      }),
    );
  }

  if (Array.isArray(id) || Array.isArray(type)) {
    return response.status(400).json(
      JSON.stringify({
        message:
          "Must provide a single 'id' and a single 'type' query parameter",
      }),
    );
  }

  if (typeof legacy === "string" && legacy !== "true") {
    return response.status(400).json(
      JSON.stringify({
        message: "Query parameter 'legacy' must be true or not present",
      }),
    );
  }

  const baseOptions = legacy ? auth2020 : auth2023;

  let token;
  try {
    token = Mux.JWT.signPlaybackId(id, {
      ...baseOptions,
      type,
      expiration: "6h",
      // Probably only applies to thumbnails
      params: { time: "1" },
    });
  } catch (e) {
    console.error(e);
    response.status(500).json("Error generating token, see API route logs");
    return;
  }

  return response.json(JSON.stringify({ token }));
}
