import { getAccessLevelFromPathname } from "./getAccessLevelFromPathname";

describe("getAccessLevelFromPathname", () => {
  it.each([
    [
      "/teachers/programmes/biology-secondary-ks3/units/cells/lessons/lesson-1",
      "lesson",
    ],
    [
      "/teachers/programmes/biology-secondary-ks3/units/cells/lessons/lesson-1/downloads/success",
      "lesson",
    ],
    ["/teachers/lessons/lesson-1/media", "lesson"],
    ["/teachers/programmes/biology-secondary-ks3/units/cells/lessons", "unit"],
    ["/teachers/programmes/biology-secondary/units", "programme"],
    ["/teachers/search", "search"],
    ["/teachers/my-library", "my_library"],
    ["/teachers/teach-with-oak/downloads", "teach_with_oak"],
  ])("maps %s to %s", (pathname, expected) => {
    expect(getAccessLevelFromPathname(pathname)).toBe(expected);
  });

  it.each([null, undefined, "/", "/teachers/eyfs/maths", "/about-us"])(
    "returns undefined for %s",
    (pathname) => {
      expect(getAccessLevelFromPathname(pathname)).toBeUndefined();
    },
  );
});
