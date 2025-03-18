import path from "path";
import { getDirname } from "./moduleHelpers";

// Get the directory name of the current file
const thisFile = import.meta.url;
const dirname = getDirname(thisFile);

describe("example usage", () => {
  test("can load a fixture file using the dirname helper", () => {
    // Create a path to a hypothetical fixture file
    const fixtureFilePath = path.join(dirname, "../fixtures/example-data.json");

    // Log the path for demonstration
    console.log("Fixture file path:", fixtureFilePath);

    // You could then use this path to load a fixture file
    // const fixtureData = JSON.parse(fs.readFileSync(fixtureFilePath, 'utf8'));

    // For the test, we'll just verify the path looks correct
    expect(fixtureFilePath).toContain(
      "src/__tests__/fixtures/example-data.json",
    );
  });

  test("can resolve paths relative to the current file", () => {
    // Create paths relative to the current test file
    const parentDir = path.join(dirname, "..");
    const siblingFile = path.join(dirname, "another-file.ts");

    // Verify paths look correct
    expect(parentDir).toContain("src/__tests__");
    expect(siblingFile).toContain("src/__tests__/utils/another-file.ts");
  });
});
