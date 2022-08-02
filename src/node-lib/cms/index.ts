import getSanityClient from "./sanity-client";

export * from "./types/documents";
export * from "./types/client";
export * from "./types/base";

const CMSClient = getSanityClient();
export default CMSClient;
