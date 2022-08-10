import { GraphQLClient } from "graphql-request";

import config from "../../config";

import { getSdk } from "./generated/sdk";

const getGraphqlEndpoint = (opts: {
  projectId: string;
  dataset: string;
  datasetTag: string;
  useCDN: boolean;
}): string => {
  const subdomain = opts.useCDN ? `apicdn` : `api`;

  return `https://${opts.projectId}.${subdomain}.sanity.io/v1/graphql/${opts.dataset}/${opts.datasetTag}`;
};

const graphqlAPIUrl = getGraphqlEndpoint({
  projectId: config.get("sanityProjectId"),
  dataset: config.get("sanityDataset"),
  datasetTag: config.get("sanityDatasetTag"),
  useCDN: config.get("sanityUseCDN") === "true",
});

const client = new GraphQLClient(graphqlAPIUrl, {
  headers: { Authorization: `Bearer ${config.get("sanityGraphqlApiSecret")}` },
});

const sanityGraphqlApi = getSdk(client);

export default sanityGraphqlApi;
