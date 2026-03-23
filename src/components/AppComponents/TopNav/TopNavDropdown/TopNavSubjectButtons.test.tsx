import { getSubjectLinkHref } from "./TopNavSubjectButtons";

describe("TopNavSubjectButtons - Link Generation", () => {
  describe("getSubjectLinkHref", () => {
    describe("EYFS subjects", () => {
      it("should generate EYFS route for single word EYFS programmes", () => {
        const href = getSubjectLinkHref({
          programmeCount: 1,
          subjectSlug: "maths",
          programmeSlug: "maths-foundation-early-years-foundation-stage-l",
          keyStageSlug: "early-years-foundation-stage",
        });

        expect(href).toBe("/teachers/eyfs/maths");
      });

      it("should generate EYFS route for multi-word EYFS programmes", () => {
        const href = getSubjectLinkHref({
          programmeCount: 1,
          subjectSlug: "communication-and-language",
          programmeSlug:
            "communication-and-language-foundation-early-years-foundation-stage-l",
          keyStageSlug: "early-years-foundation-stage",
        });

        expect(href).toBe("/teachers/eyfs/communication-and-language");
      });
    });

    describe("non-EYFS subjects with multiple programmes", () => {
      it("should link to programme-index when programmeCount > 1", () => {
        const href = getSubjectLinkHref({
          programmeCount: 2,
          subjectSlug: "maths",
          programmeSlug: "maths-primary-ks1",
          keyStageSlug: "ks1",
        });

        expect(href).toBe("/teachers/key-stages/ks1/subjects/maths/programmes");
      });

      it("should link to programme-index for secondary subject with multiple programmes", () => {
        const href = getSubjectLinkHref({
          programmeCount: 3,
          subjectSlug: "science",
          programmeSlug: "science-secondary-ks4",
          keyStageSlug: "ks4",
        });

        expect(href).toBe(
          "/teachers/key-stages/ks4/subjects/science/programmes",
        );
      });
    });

    describe("non-EYFS subjects with single programme", () => {
      it("should link to unit-index when programmeCount is 1", () => {
        const href = getSubjectLinkHref({
          programmeCount: 1,
          subjectSlug: "history",
          programmeSlug: "history-primary-ks2",
          keyStageSlug: "ks2",
        });

        expect(href).toBe("/teachers/programmes/history-primary-ks2/units");
      });

      it("should link to unit-index for secondary subject with single programme", () => {
        const href = getSubjectLinkHref({
          programmeCount: 1,
          subjectSlug: "geography",
          programmeSlug: "geography-secondary-ks3",
          keyStageSlug: "ks3",
        });

        expect(href).toBe("/teachers/programmes/geography-secondary-ks3/units");
      });

      it("should link to unit-index when keyStageSlug is not provided", () => {
        const href = getSubjectLinkHref({
          programmeCount: 1,
          subjectSlug: "english",
          programmeSlug: "english-primary-ks1",
        });

        expect(href).toBe("/teachers/programmes/english-primary-ks1/units");
      });
    });
  });
});
