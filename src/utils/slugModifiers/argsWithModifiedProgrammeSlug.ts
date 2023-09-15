import { GraphQLClientRequestHeaders } from "graphql-request/build/cjs/types";

import programmeSlugWithoutL from "./programmeSlugWithoutL";

export type VariablesType = {
  programmeSlug: string;
  [key: string]: string;
};

export type RequestHeadersType = GraphQLClientRequestHeaders | undefined;

// This function is used in the curriculum api to remove the legacy suffix
//  from the modified programme slug from the args variables before the request is made.

const argsWithModifiedProgrammeSlug = <T extends VariablesType>(
  args: [variables: T, requestHeaders?: RequestHeadersType],
): [variables: T, requestHeaders?: RequestHeadersType] => {
  const [variables, requestHeaders] = args;
  const modifiedProgrammeSlug = programmeSlugWithoutL(variables.programmeSlug);
  const variablesWithModifiedProgrammeSlug: T = {
    ...variables,
    programmeSlug: modifiedProgrammeSlug,
  };
  return [variablesWithModifiedProgrammeSlug, requestHeaders];
};

export default argsWithModifiedProgrammeSlug;
