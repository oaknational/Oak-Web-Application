import { NextApiRequest, NextApiResponse } from "next";

const allowedHostnames = [
  "identitytoolkit.googleapis.com",
  "securetoken.googleapis.com",
];

/**
 *
 * Takes a route of the form /api/proxy/{hostname}/some/external/api/route?q
 * and forwards the url to: https://{hostname}/some/external/api/route?q,
 * passing through the response.
 *
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const slugs = req.query.slugs;
  if (!Array.isArray(slugs)) {
    throw new Error("Expected req.query.slugs to be Array");
  }
  if (!req.url) {
    throw new Error("No url in req object");
  }

  const [newHostname] = slugs;

  if (typeof newHostname !== "string") {
    throw new Error("No hostname param");
  }

  if (!allowedHostnames.includes(newHostname)) {
    throw new Error("Hostname now allowed");
  }

  const reqUrl = req.url.split(newHostname)[1];

  const url = new URL(`https://${newHostname}${reqUrl}`);

  const response = await fetch(url.toString(), {
    method: req.method,
    body: JSON.stringify(req.body),
  });

  if (!response.ok) {
    // console.log(response.status, response.statusText);
    // res.writeHead(response.status, response.headers);
    // res.end()
    /**
     * @todo pass through error etc/ or just use cloudflare
     */
    throw new Error("Failed")
  }

  const json = await response.json();

  res.json(json);
}
