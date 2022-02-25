/**
 * Given repo info and a sha, get the pull request that sha is the current head of, or null.
 *
 * @param {Object} octokit a pre-authed instance of Octokit
 * @param {Object} repoInfo repo information
 * @param {string} sha commit sha
 *
 * @returns {Object|null} The matched PR, or null.
 */
async function prFromSha(octokit, repoInfo, sha) {
  const { data: pullRequests } = await octokit.rest.pulls.list(repoInfo);

  return (
    pullRequests.find((pr) => {
      const prHeadSha = pr.head.sha;
      if (typeof prHeadSha !== "string") {
        return false;
      }
      return prHeadSha.startsWith(sha);
    }) || null
  );
}

module.exports = prFromSha;
