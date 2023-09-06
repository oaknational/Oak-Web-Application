const { execSync } = require("child_process");

module.exports = {
  /**
   * Get the app version from the current Git commit message.
   *
   * @returns {string|undefined} The app version or undefined if it could not be determined.
   * @throws {TypeError} If the environment does not contain the required information.
   */
  getAppVersion: function () {
    const ref = process.env.BRANCH;
    if (!ref) {
      throw new TypeError("BRANCH was not defined, exiting.");
    }
    const isMain = ref === "main";

    // If we aren't on main there is no production app version.
    if (!isMain) {
      return;
    }

    const commitRef = process.env.COMMIT_REF;
    const commitRegex = /^([a-zA-Z0-9]){8,}$/;
    // We are going to run this string in a script, check it.
    if (!commitRegex.test(commitRef)) {
      throw new TypeError(`Invalid exec input: ${commitRef}`);
    }

    const netlifyCommitLog = execSync(
      `git show --no-patch --oneline ${commitRef}`,
      { encoding: "utf8" },
    );

    if (!netlifyCommitLog) {
      throw new TypeError("Could not determine commit message");
    }
    console.log(`commit log: ${netlifyCommitLog}`);

    // Release commit format defined in release.config.js
    const releaseCommitFormat = /build\(release ([vV]\d+\.\d+\.\d+)\):/;
    const isReleaseCommit = releaseCommitFormat.test(netlifyCommitLog);

    // If this isn't a release commit, there is no production app version
    if (!isReleaseCommit) {
      return;
    }

    const appVersionMatches = netlifyCommitLog.match(releaseCommitFormat);
    if (!Array.isArray(appVersionMatches)) {
      throw new TypeError(
        "Could not determine app version from commit message.",
      );
    }

    const appVersion = appVersionMatches[1];
    console.log(`Determined app version: ${appVersion}`);
    return appVersion;
  },
};
