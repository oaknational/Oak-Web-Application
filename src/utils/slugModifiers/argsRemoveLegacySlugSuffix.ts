import { RequestOptions } from "graphql-request";

import removeLegacySlugSuffix from "./removeLegacySlugSuffix";

type GraphQLClientRequestHeaders = RequestOptions["requestHeaders"];

export interface VariablesType {
  programmeSlug?: string;
  subjectSlug?: string;
  [key: string]: string | undefined;
}

export type RequestHeadersType = GraphQLClientRequestHeaders | undefined;

// This function is used in the curriculum api to remove the legacy suffix
//  from the modified programme slug from the args variables before the request is made.

const argsRemoveLegacySlugSuffix = <T extends VariablesType>(
  args: [variables: T, requestHeaders?: RequestHeadersType],
): [variables: T, requestHeaders?: RequestHeadersType] => {
  const [variables, requestHeaders] = args;
  const modifiedProgrammeSlug = variables.programmeSlug
    ? removeLegacySlugSuffix(variables.programmeSlug)
    : undefined;
  const modifiedSubjectSlug = variables.subjectSlug
    ? removeLegacySlugSuffix(variables.subjectSlug)
    : undefined;
  const variablesWithModifiedProgrammeSlug: T = {
    ...variables,
    programmeSlug: modifiedProgrammeSlug,
    subjectSlug: modifiedSubjectSlug,
  };
  return [variablesWithModifiedProgrammeSlug, requestHeaders];
};

export default argsRemoveLegacySlugSuffix;
