const { Octokit } = require("octokit");

const prFromSha = require("./pr_from_sha");

if (!process.env.GITHUB_TOKEN) {
  throw new Error("Need Github token");
}
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const repoInfo = {
  owner: "oaknational",
  repo: "samara",
};

// Set this to the head commit on a branch in a PR
const sha = "c6458f3";

prFromSha(octokit, repoInfo, sha).then((pr) => {
  if (pr === null) {
    console.log("no pr found");
  } else {
    console.log(pr.head.ref);
  }
});
