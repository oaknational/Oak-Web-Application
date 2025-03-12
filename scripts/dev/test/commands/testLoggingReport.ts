import { spawn } from "child_process";
import { mkdir, writeFile } from "fs/promises";
import { dirname } from "path";

import escapeHtml from "escape-html";

const TEST_REGEXP = /^(PASS|FAIL) (.*)$/;
const OUTPUT_REPORT_HTML = process.cwd() + "/reports/jest-logging-issues.html";

type TestReport = {
  file: string;
  status: string;
  logs?: string;
};

async function processData(data: string) {
  const lines = data.split("\n");
  const tests: TestReport[] = [];

  let onTest = false;
  let logLines: string[] = [];
  let inLogging = false;

  const finishLogs = () => {
    if (tests.length > 0 && logLines.length > 0) {
      tests.at(-1)!.logs = logLines.join("\n");
    }
    logLines = [];
  };

  for (const line of lines) {
    if (line.match(TEST_REGEXP)) {
      finishLogs();
      inLogging = false;
      onTest = true;
      const matches = line.match(TEST_REGEXP);
      tests.push({
        status: matches![1]!.toLowerCase(),
        file: matches![2]!,
      });
    } else if (onTest && (inLogging || line.match(/ {2}/))) {
      logLines.push(line);
      inLogging = true;
    } else {
      finishLogs();
      onTest = false;
    }
  }

  finishLogs();

  return tests;
}

const STATUS_COLOR = {
  pass: "green",
  fail: "red",
};

function wrapColor(status: string) {
  const color =
    status in STATUS_COLOR
      ? STATUS_COLOR[status as keyof typeof STATUS_COLOR]
      : "gray";
  return `<span style="color: ${color}">${status}</span>`;
}

function wrapFilename(test: TestReport) {
  return `
        <span style="color: ${test.logs ? "" : "#aaa"};">
            ${test.file}
        </span>
    `;
}

function totalWithLogs(tests: TestReport[]) {
  let count = 0;
  for (const test of tests) {
    if (test.logs) {
      count += 1;
    }
  }
  return count;
}

// <https://stackoverflow.com/a/16348977>
const stringToColour = (str: string) => {
  let hash = 0;
  str.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, "0");
  }
  return colour;
};

function findTags(logs?: string) {
  const tags: string[] = [];

  if (logs) {
    if (logs.match(/Support for defaultProps will be removed/)) {
      tags.push("default-props");
    }
    if (logs.match(/cannot appear as a descendant of/)) {
      tags.push("dom-descendant");
    }
    if (logs.match(/Each child in a list should have a unique/)) {
      tags.push("unique-key");
    }
    if (logs.match(/React does not recognize the/)) {
      tags.push("react-dom-attr");
    }
    if (logs.match(/Invalid DOM property/)) {
      tags.push("invalid-dom");
    }
    if (logs.match(/uncontrolled input to be controlled/)) {
      tags.push("uncontrolled-to-controlled");
    }
    if (logs.match(/uncontrolled to controlled/)) {
      tags.push("uncontrolled-to-controlled");
    }
    if (logs.match(/invalid format ZodError/)) {
      tags.push("zod-error");
    }
    if (logs.match(/test was not wrapped in act\(\.\.\.\)/)) {
      tags.push("react-act");
    }
    if (logs.match(/not configured to support act\(\.\.\.\)/)) {
      tags.push("react-act");
    }
    if (
      logs.match(
        /prop on a DOM element\. If you intentionally want it to appear in the DOM/,
      )
    ) {
      tags.push("invalid-dom");
    }
    if (logs.match(/Encountered two children with the same key/)) {
      tags.push("unique-key");
    }
    if (logs.match(/Error: Not implemented: /)) {
      tags.push("jsdom-not-implemented");
    }
    if (
      logs.match(
        /You may see this warning because you've called styled inside another component/,
      )
    ) {
      tags.push("styled-components");
    }
    if (logs.match(/is deprecated in favor of `React.act`/)) {
      tags.push("react-act");
    }
    if (logs.match(/Avo Inspector not provided/)) {
      tags.push("avo");
    }
    if (logs.match(/OakError: Resource not found/)) {
      tags.push("oak-error");
    }
    if (logs.match(/called outside of .* provider/)) {
      tags.push("content-provider");
    }

    if (tags.length < 1) {
      tags.push("other");
    }
  }

  return tags;
}

async function renderData(tests: TestReport[]) {
  let html = `
        <h1>Tests with logging report</h1>
        <p>
            There are <span style="color: red;">${totalWithLogs(tests)}</span>/${tests.length} test files logging to stdout.
        </p>
        <p>
            Note that test files have multiple tests/assertions so you may need to fix more than one thing per file. 
        </p>
    `;
  for (const test of tests) {
    const tags = findTags(test.logs);
    html += `
            <details>
                <summary style="
                    margin-bottom: 4px;
                ">
                    ${wrapColor(test.status)}: ${wrapFilename(test)}
                    ${tags
                      .map((tag) => {
                        return `
                            <span
                                style="
                                    background: ${stringToColour(tag) + "4a"};
                                    margin-right: 4px;
                                    border: solid 1px ${stringToColour(tag) + "ff"};
                                    padding: 0 2px;
                                "
                            >${tag}</span>
                        `;
                      })
                      .join("")}
                </summary>
                <pre style="
                    background: #fafafa;
                    padding: 12px;
                    border: solid 1px #ddd;
                "><code>${escapeHtml(test.logs ?? "all good!")}</code></pre>
            </details>
        `;
  }

  await mkdir(dirname(OUTPUT_REPORT_HTML), { recursive: true });

  await writeFile(OUTPUT_REPORT_HTML, html);
  console.log(`📄 file written to: ${OUTPUT_REPORT_HTML}`);
}

export async function testLoggingReport() {
  const p = spawn(
    "npx",
    [
      "jest",
      // Run a single test at a time so we can collect the output logged
      // to the terminal
      "--runInBand",
      // spawn doesn't set terminal column width, so the coverage table
      // formatting  get's messed up.
      "--coverage=false",
    ],
    {
      cwd: process.cwd(),
    },
  );

  // Collect the logging, whilst also logging to stdout/stderr
  let data: string = "";
  p.stdout?.on("data", (str) => {
    process.stdout.write(str);
    data += str;
  });
  p.stderr?.on("data", (str) => {
    process.stderr.write(str);
    data += str;
  });

  await new Promise((resolve) => {
    p.on("close", resolve);
  });

  await renderData(await processData(data));
}
