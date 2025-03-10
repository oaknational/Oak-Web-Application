import path from "path";
import { getFilename, getDirname } from "./moduleHelpers";

// In a Jest environment, these will be CommonJS-style globals already
describe("moduleHelpers", () => {
  test("getDirname returns directory path", () => {
    const thisFile = import.meta.url;
    const dirname = getDirname(thisFile);
    expect(dirname).toContain("src/__tests__/utils");
  });

  test("getFilename returns file path", () => {
    const thisFile = import.meta.url;
    const filename = getFilename(thisFile);
    expect(filename).toContain("src/__tests__/utils/moduleHelpers.test.ts");
  });

  test("paths from getDirname can be used with path.join", () => {
    const thisFile = import.meta.url;
    const dirname = getDirname(thisFile);
    const pathToFixture = path.join(dirname, "../fixtures/someFile.json");

    expect(pathToFixture).toContain("src/__tests__/fixtures/someFile.json");
  });
});
