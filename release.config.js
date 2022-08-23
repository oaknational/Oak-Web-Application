module.exports = {
  branches: ["main"],
  plugins: [
    // Analyse commits.
    // https://github.com/semantic-release/commit-analyzer/#rules-definition
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "angular",
        releaseRules: [{ type: "chore", release: "patch" }],
      },
    ],
    // Create release notes.
    "@semantic-release/release-notes-generator",

    // Add the release notes to a change log.
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGE_LOG.md",
      },
    ],
    // Commit the change log.
    // Note the `[skip ci]` part of the message, to avoid running pointless checks.
    [
      "@semantic-release/git",
      {
        assets: ["CHANGE_LOG.md"],
        message:
          "build(release v${nextRelease.version}): set package.json version to ${nextRelease.version} [skip ci]\n\nSee CHANGE_LOG.md",
      },
    ],

    // Generate the Github release.
    // https://github.com/semantic-release/github
    "@semantic-release/github",
  ],
};
