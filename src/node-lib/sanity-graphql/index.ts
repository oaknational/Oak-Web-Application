import { GraphQLClient } from "graphql-request";

import errorReporter from "../../common-lib/error-reporter";
import getServerConfig from "../getServerConfig";

import {
  getSdk,
  SdkFunctionWrapper,
  // AllBlogPostsQuery,
  // AllWebinarsQuery,
} from "./generated/sdk";

const reportError = errorReporter("sanity-graphql.ts");

export const sanityConfig = {
  projectId: getServerConfig("sanityProjectId"),
  dataset: getServerConfig("sanityDataset"),
  datasetTag: getServerConfig("sanityDatasetTag"),
  useCDN: getServerConfig("sanityUseCDN") === "true",
};

const getGraphqlEndpoint = (opts: {
  projectId: string;
  dataset: string;
  datasetTag: string;
  useCDN: boolean;
}): string => {
  const subdomain = opts.useCDN ? `apicdn` : `api`;

  return `https://${opts.projectId}.${subdomain}.sanity.io/v1/graphql/${opts.dataset}/${opts.datasetTag}`;
};

const graphqlAPIUrl = getGraphqlEndpoint(sanityConfig);

export const sanityGraphqlClient = new GraphQLClient(graphqlAPIUrl, {
  headers: {
    Authorization: `Bearer ${getServerConfig("sanityGraphqlApiSecret")}`,
  },
});

/**
 * Call fixtureGenerationWrapper from requestWithLogging to have fixtures
 * automatically generated for each API operation
 *
 * n.b Make sure tests aren't running when this happens as it will
 * continuously re-render
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

export const requestWithLogging: SdkFunctionWrapper = async (
  action,
  operationName
) => {
  try {
    // Swap these lines to generate fixtures locally for use testing
    // const response = await fixtureGenerationWrapper(action, operationName)
    const response = await action();

    return response;
  } catch (err) {
    console.log(
      `Failed to fetch graphql query operationName=${operationName}, graphqlAPIUrl=${graphqlAPIUrl}`
    );

    reportError(err, {
      graphqlOperationName: operationName,
      graphqlAPIUrl,
    });
    throw err;
  }
};

const sanityGraphqlApi = getSdk(sanityGraphqlClient, requestWithLogging);

export default sanityGraphqlApi;
