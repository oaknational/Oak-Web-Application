module.exports = {
  branches: ["main"],
  plugins: [
    // Analyse commits.
    // https://github.com/semantic-release/commit-analyzer/#rules-definition
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "angular",
        releaseRules: [
          { type: "feat", release: "minor" },
          { type: "fix", release: "patch" },
          { type: "perf", release: "patch" },
          { type: "revert", release: "patch" },
          { type: "docs", release: "patch" },
          { type: "style", release: "patch" },
          { type: "refactor", release: "patch" },
          { type: "chore", release: "patch" },
          // test, ci and wip are accepted by commitlint but don't trigger a release.
          { type: "test", release: null },
          { type: "ci", release: null },
          { type: "wip", release: null },
        ],
      },
    ],
    // Create release notes.
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "angular",
        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"],
        },
        writerOpts: {
          commitsSort: ["subject", "scope"],
          types: [
            { type: "feat", section: "Features" },
            { type: "fix", section: "Bug fixes" },
            { type: "perf", section: "Performance improvements" },
            { type: "revert", section: "Reverts" },
            { type: "docs", section: "Documentation" },
            { type: "style", section: "Styles" },
            { type: "refactor", section: "Changes" },
            { type: "chore", section: "Changes" },
            { type: "test", section: "Tests" },
            { type: "ci", section: "Continuous integration" },
          ],
        },
      },
    ],

    // Add the release notes to a change log.
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGE_LOG.md",
      },
    ],
    // Bump the version number in the sonar-project.properties file.
    [
      "@semantic-release/exec",
      {
        prepareCmd:
          "node ./scripts/release/change_sonarcloud_project_version.js v${nextRelease.version}",
      },
    ],
    // Commit the change log and the updated SonarCloud project version number.
    [
      "@semantic-release/git",
      {
        assets: ["CHANGE_LOG.md", "sonar-project.properties"],
        // Note, this isn't a string literal, it's a Mustache-style template.
        message: "build(release v${nextRelease.version}): See CHANGE_LOG.md",
      },
    ],

    // Generate the Github release.
    // https://github.com/semantic-release/github
    "@semantic-release/github",
  ],
};
