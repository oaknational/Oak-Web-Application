#!/usr/bin/env ./node_modules/.bin/tsx
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import "dotenv/config";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import "../helper/load-env";
import { createClient } from "@sanity/client";

function getClient({ dataset }: { dataset: string }) {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: dataset,
    apiVersion: "2026-07-16",
    useCdn: false,
    token: process.env.SANITY_AUTH_SECRET,
  });
}

yargs(hideBin(process.argv))
  .command(
    "query <dataset> <groq_file>",
    "run a query against the Sanity dataset with the current environment variables",
    (yargs) => {
      return yargs
        .positional("dataset", {
          type: "string",
          describe: "dataset to query",
          required: true,
        })
        .positional("groq_file", {
          type: "string",
          describe: "file with query to run",
          required: true,
        });
    },
    async ({ dataset, groq_file }) => {
      if (dataset === undefined || groq_file === undefined) {
        console.error("dataset and query are required");
        process.exit(1);
      }
      const client = getClient({ dataset });
      const queryString = await readFile(
        join(process.cwd(), groq_file),
        "utf-8",
      );
      const res = await client.fetch(queryString, {});
      console.log(JSON.stringify(res, null, 2));
      console.error(res.length + " results");
    },
  )
  .demand(1).argv;
