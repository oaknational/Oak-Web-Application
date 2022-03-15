const { Octokit } = require("octokit");

const prFromSha = require("../pr_from_sha");
const branchFromSha = require("../branch_from_sha");

if (!process.env.GITHUB_TOKEN) {
  throw new Error("Need Github token");
}
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const repoInfo = {
  owner: "oaknational",
  repo: "samara",
};

// PR test
// Set this to the head commit on a branch in a PR, short SHAs are fine.
const prSha = "c6458f3";
prFromSha(octokit, repoInfo, prSha).then((pr) => {
  if (pr === null) {
    console.log("no pr found");
  } else {
    console.log(pr.head.ref);
  }
});

// branch test
const branchPr = "5c34737740d989b05d021769871dd1a365ded88d";
branchFromSha(octokit, repoInfo, branchPr).then((branch) => {
  if (branch === null) {
    console.log("no branch found");
  } else {
    console.log(branch);
  }
});
