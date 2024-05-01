import { ParsedUrlQuery } from "querystring";

import { GetStaticPathsResult } from "next";

import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";

export const getStaticPaths = async <
  T extends ParsedUrlQuery = ParsedUrlQuery,
>() => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<T> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};
