const { readFileSync, writeFileSync } = require("node:fs");
const path = require("node:path");

// eslint-disable-next-line import/no-unresolved
const { PropertiesEditor } = require("properties-file/editor");

const SONAR_PROJECT_PROPERTIES_FILE = path.join(
  __dirname,
  "../../sonar-project.properties",
);

const newVersion = process.argv[2];
if (!newVersion) {
  throw new Error("No version specified");
}
// Sanitise the version number.
const versionRegex = /^[vV]\d+\.\d+\.\d+$/;
if (!versionRegex.test(newVersion)) {
  throw new Error(`Version "${newVersion}" does not match ${versionRegex}`);
}

// Update the version in memory.
const properties = new PropertiesEditor(
  readFileSync(SONAR_PROJECT_PROPERTIES_FILE, "utf8"),
);
properties.update("sonar.projectVersion", {
  newValue: newVersion,
});

// Write the file back to disk.
try {
  writeFileSync(SONAR_PROJECT_PROPERTIES_FILE, properties.format());
  console.log(
    `Updating ${SONAR_PROJECT_PROPERTIES_FILE} to version: ${newVersion}`,
  );
} catch (error) {
  console.error(error);
  process.exit(1);
}
