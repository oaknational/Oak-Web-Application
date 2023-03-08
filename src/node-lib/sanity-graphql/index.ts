import { GraphQLClient } from "graphql-request";

import serverConfig from "../../config/server";

import {
  // AllBlogPostsQuery,
  // AllWebinarsQuery,
  getSdk,
  // SdkFunctionWrapper,
} from "./generated/sdk";

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
  projectId: serverConfig.get("sanityProjectId"),
  dataset: serverConfig.get("sanityDataset"),
  datasetTag: serverConfig.get("sanityDatasetTag"),
  useCDN: serverConfig.get("sanityUseCDN") === "true",
});

export const sanityGraphqlClient = new GraphQLClient(graphqlAPIUrl, {
  headers: {
    Authorization: `Bearer ${serverConfig.get("sanityGraphqlApiSecret")}`,
  },
});

/**
 * Pass fixtureGenerationWrapper as a second argument to getSdk to have fixtures
 * automatically generated for each API operation
 *
 * n.b Make sure tests aren't running when this happens
 */
// const fixtureGenerationWrapper: SdkFunctionWrapper = async (
//   action,
//   operationName
// ) => {
//   const response = await action();

//   let trimmedResponse = response;

//   // Bit of a hack to keep fixture size down
//   if ("allWebinar" in response) {
//     trimmedResponse = {
//       allWebinar: (response as AllWebinarsQuery).allWebinar
//         .slice(0, 2)
//         .map((webinar) => {
//           return {
//             ...webinar,
//             summaryPortableText: webinar.summaryPortableText.slice(0, 3),
//           };
//         }),
//     };
//   } else if ("allNewsPost" in response) {
//     trimmedResponse = {
//       allNewsPost: (response as AllBlogPostsQuery).allNewsPost.slice(0, 2),
//     };
//   }

//   import("fs").then((fs) => {
//     fs.writeFileSync(
//       `./src/node-lib/sanity-graphql/fixtures/${operationName}.json`,
//       JSON.stringify(trimmedResponse, null, 2)
//     );
//   });

//   return response;
// };

const sanityGraphqlApi = getSdk(
  sanityGraphqlClient /*, fixtureGenerationWrapper */
);

export default sanityGraphqlApi;
