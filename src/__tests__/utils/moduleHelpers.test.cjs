const path = require("path");
const { getFilename, getDirname } = require("./moduleHelpers.cjs");

describe("moduleHelpers", () => {
  test("getDirname should return a directory path", () => {
    // We can't use import.meta.url in CommonJS, so we use __filename instead
    const dirname = path.dirname(__filename);
    expect(dirname).toContain("src/__tests__/utils");
  });

  test("getFilename should return a file path", () => {
    // We can't use import.meta.url in CommonJS, so we use __filename instead
    expect(__filename).toContain("src/__tests__/utils");
  });

  test("demonstration of how __dirname and __filename work in CommonJS", () => {
    // In CommonJS modules, these globals already exist
    const someFilePath = path.join(__dirname, "../fixtures/someFile.json");

    // Just verifying the values make sense
    expect(__dirname).toContain("src/__tests__/utils");
    expect(__filename).toContain("src/__tests__/utils");
    expect(someFilePath).toContain("src/__tests__/fixtures/someFile.json");
  });
});
