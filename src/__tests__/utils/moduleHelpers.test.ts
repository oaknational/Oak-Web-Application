import { getFilename, getDirname } from "./moduleHelpers";
import path from "path";

describe("moduleHelpers", () => {
  test("getDirname should return the current directory", () => {
    const dirname = getDirname(import.meta.url);
    expect(dirname).toContain("src/__tests__/utils");
  });

  test("getFilename should return the current file path", () => {
    const filename = getFilename(import.meta.url);
    expect(filename).toContain("src/__tests__/utils");
  });

  test("demonstration of how to use as direct replacements", () => {
    // Instead of using __dirname directly (which doesn't exist in ES modules)
    // Use this pattern:
    const __dirname = getDirname(import.meta.url);
    const __filename = getFilename(import.meta.url);

    // Now you can use __dirname and __filename as you would in CommonJS
    const someFilePath = path.join(__dirname, "../fixtures/someFile.json");

    // Just verifying the values make sense
    expect(__dirname).toContain("src/__tests__/utils");
    expect(__filename).toContain("src/__tests__/utils");
    expect(someFilePath).toContain("src/__tests__/fixtures/someFile.json");
  });
});
