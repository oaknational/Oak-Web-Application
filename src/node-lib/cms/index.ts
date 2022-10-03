import getSanityClient from "./sanity-client";

export * from "./sanity-client/schemas";

const CMSClient = getSanityClient();
export default CMSClient;
