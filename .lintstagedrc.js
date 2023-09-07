module.exports = {
  "*.{js,jsx,ts,tsx}": [
    "npm run format:precommit",
    "npm run lint:precommit",
    "npm run lint:styles:precommit",
  ],
};
