#!/usr/bin/env ./node_modules/.bin/tsx
import { spawn } from "child_process";
import { mkdir, readFile } from "fs/promises";
import { relative } from "path";

import "dotenv/config";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import micromatch from "micromatch";

import { extractCommands, resultsSchema } from "./helper";

const outputDir = relative(process.cwd(), "reports");
const outputFile = relative(process.cwd(), "reports/test-results.json");

function colorByStatusText(text?: string) {
  if (text === "passed") {
    return chalk.green(text);
  }
  return chalk.gray(text ?? "");
}

yargs(hideBin(process.argv))
  .command(
    "timings-test",
    "run test and output timings",
    (yargs) => {
      return yargs;
    },
    async () => {
      await mkdir(outputDir, { recursive: true });
      const p = spawn(
        "npx",
        [
          "jest",
          "--runInBand",
          "--json",
          "--verbose",
          `--outputFile=${outputFile}`,
        ],
        {
          cwd: process.cwd(),
          stdio: "inherit",
        },
      );

      await new Promise((resolve) => {
        p.on("close", resolve);
      });
    },
  )
  .command(
    "timings-report",
    "report on timings",
    (yargs) => {
      return yargs
        .option("min", {
          type: "number",
          describe: "min number of ms",
          default: 0,
        })
        .option("path", {
          type: "string",
          describe: "glob path",
        });
    },
    async ({ min, path }) => {
      const raw = JSON.parse((await readFile(outputFile)).toString());
      const data = resultsSchema.parse(raw);
      let results = extractCommands(data, { min });

      if (path) {
        results = results.filter((result) => {
          return micromatch.isMatch(result.name, path, {
            contains: true,
            nocase: true,
          });
        });
      }

      for (const result of results) {
        if (result.assertions.length > 0) {
          console.log(`${chalk.green(result.name)} (${result.duration}ms)`);
          result.assertions.forEach((assertion) => {
            console.log(
              `  ${chalk.blue(assertion.duration + "ms")}: ${assertion.name} (${colorByStatusText(assertion.status)})`,
            );
          });
        }
      }
    },
  )
  .demand(1).argv;
