const types_1 = require("@commitlint/types");
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      types_1.RuleConfigSeverity.Error,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
        "wip",
      ],
    ],
  },
};
