import getSanityClient from "./sanity-client";

export * from "./types/client";
export * from "./types/base";
export * from "./types/documents";
export * from "./types/pages";

const CMSClient = getSanityClient();
export default CMSClient;
