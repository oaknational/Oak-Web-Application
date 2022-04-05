module.exports = {
  branches: ["main"],
  plugins: [
    // Analyse commits.
    "@semantic-release/commit-analyzer",
    // Create release notes.
    "@semantic-release/release-notes-generator",

    // Add the release notes to a change log.
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGE_LOG.md",
      },
    ],
    // Update the package.json version.
    [
      "@semantic-release/npm",
      {
        npmPublish: false,
      },
    ],
    // Update the package.json version and commit the change log.
    // Note the `[skip ci]` part of the message, to avoid running pointless checks.
    [
      "@semantic-release/git",
      {
        assets: ["CHANGE_LOG.md", "package.json"],
        message:
          "build(release v${nextRelease.version}): set package.json version to ${nextRelease.version} [skip ci]\n\nSee CHANGE_LOG.md",
      },
    ],

    // Generate the Github release.
    // https://github.com/semantic-release/github
    "@semantic-release/github",
  ],
};
