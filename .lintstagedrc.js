const path = require("path");

module.exports = {
  "*.{js,jsx,ts,tsx}": [
    "npm run format:precommit",
    "eslint --fix",
    "npm run lint:styles:precommit",
  ],
};
