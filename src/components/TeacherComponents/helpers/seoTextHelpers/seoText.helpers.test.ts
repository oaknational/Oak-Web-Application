import { getPhase, formatSubjectName } from "./seoText.helpers";

describe("seoText helpers", () => {
  describe("getPhase", () => {
    it("should return primary for a year below 7", () => {
      const phase = getPhase("Year 5");

      expect(phase).toEqual("primary");
    });

    it("should return secondary for a year above 7", () => {
      const phase = getPhase("Year 10");

      expect(phase).toEqual("secondary");
    });
  });

  describe("formatSubjectName", () => {
    it("should return a subject name in lower case for non-excluded subjects", () => {
      const subject = formatSubjectName("History");

      expect(subject).toEqual("history");
    });

    it("should return original subject name for excluded subjects", () => {
      const subject = formatSubjectName("English");

      expect(subject).toEqual("English");
    });
  });
});
