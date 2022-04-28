import { NextApiRequest } from "next";

const allowedHostnames = [
  "identitytoolkit.googleapis.com",
  "securetoken.googleapis.com",
];

export default async function handler(req: NextApiRequest) {
  const slugs = req.query.slugs;
  if (!Array.isArray(slugs)) {
    throw new Error("Expected req.query.slugs to be Array");
  }
  if (!req.url) {
    throw new Error("No url in req object");
  }
  console.log(">>>>>>>.", slugs);
  console.log(">>>>>>>.", req.url);
  const [newHostname] = slugs;

  if (typeof newHostname !== "string") {
    throw new Error("No hostname param");
  }

  if (!allowedHostnames.includes(newHostname)) {
    throw new Error("Hostname now allowed");
  }

  const reqUrl = req.url.split(newHostname)[1];

  console.log("reqUrl,__________", reqUrl);

  const url = new URL(`https://${newHostname}${reqUrl}`);

  console.log(url);

  // url.hostname = newHostname;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return fetch(url.toString(), req);
}
