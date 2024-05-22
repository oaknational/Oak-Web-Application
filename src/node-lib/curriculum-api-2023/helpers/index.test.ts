import { toSentenceCase, isTierValid } from "./index";

describe("toSentenceCase", () => {
  test("converts first character to uppercase and the rest to lowercase", () => {
    expect(toSentenceCase("hello world")).toBe("Hello world");
  });

  test("handles all-uppercase strings", () => {
    expect(toSentenceCase("HELLO WORLD")).toBe("Hello world");
  });

  test("handles all-lowercase strings", () => {
    expect(toSentenceCase("hello world")).toBe("Hello world");
  });

  test("handles empty string", () => {
    expect(toSentenceCase("")).toBe("");
  });

  test("handles strings with non-alphabetic characters", () => {
    expect(toSentenceCase("123 hello!")).toBe("123 hello!");
  });
});

describe("isTierValid", () => {
  test("it should return false if the keystage is not ks4", () => {
    expect(isTierValid(true, "core", "maths", "ks3")).toBe(false);
  });
  test("it should return false if the subject is not maths", () => {
    expect(isTierValid(true, "core", "english", "ks4")).toBe(false);
  });
  test("it should return false if it is not legacy", () => {
    expect(isTierValid(false, "core", "maths", "ks4")).toBe(false);
  });
  test("it should return true if the tier is not core", () => {
    expect(isTierValid(true, "foundation", "english", "ks4")).toBe(true);
  });
  test("it should return true if the tier is core and it is legacy, the subject is maths and the keystage is ks4", () => {
    expect(isTierValid(true, "core", "maths", "ks4")).toBe(true);
  });
});
