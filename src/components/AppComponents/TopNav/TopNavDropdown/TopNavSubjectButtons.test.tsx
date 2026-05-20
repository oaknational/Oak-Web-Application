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
          phaseSlug: "primary",
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
          phaseSlug: "primary",
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
          phaseSlug: "primary",
        });

        expect(href).toBe(
          "/teachers/key-stages/ks1/subjects/maths/programmes?keystages=ks1",
        );
      });

      it("should link to programme-index for secondary subject with multiple programmes", () => {
        const href = getSubjectLinkHref({
          programmeCount: 3,
          subjectSlug: "science",
          programmeSlug: "science-secondary-ks4",
          keyStageSlug: "ks4",
          phaseSlug: "secondary",
        });

        expect(href).toBe(
          "/teachers/key-stages/ks4/subjects/science/programmes?keystages=ks4",
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
          phaseSlug: "primary",
        });

        expect(href).toBe("/programmes/history-primary/units?keystages=ks2");
      });

      it("should link to unit-index for secondary subject with single programme", () => {
        const href = getSubjectLinkHref({
          programmeCount: 1,
          subjectSlug: "geography",
          programmeSlug: "geography-secondary-ks3",
          keyStageSlug: "ks3",
          phaseSlug: "secondary",
        });

        expect(href).toBe(
          "/programmes/geography-secondary/units?keystages=ks3",
        );
      });

      it("should link to unit-index when keyStageSlug is not provided", () => {
        const href = getSubjectLinkHref({
          programmeCount: 1,
          subjectSlug: "english",
          programmeSlug: "english-primary-ks1",
          keyStageSlug: "ks1",
          phaseSlug: "primary",
        });

        expect(href).toBe("/programmes/english-primary/units?keystages=ks1");
      });

      it("should preserve ks4 option slug segments like core", () => {
        const href = getSubjectLinkHref({
          programmeCount: 1,
          subjectSlug: "citizenship",
          programmeSlug: "citizenship-secondary-ks4-core",
          keyStageSlug: "ks4",
          phaseSlug: "secondary",
        });

        expect(href).toBe(
          "/programmes/citizenship-secondary-core/units?keystages=ks4",
        );
      });

      it("should preserve option and examboard segments after ks4", () => {
        const href = getSubjectLinkHref({
          programmeCount: 1,
          subjectSlug: "biology",
          programmeSlug: "biology-secondary-ks4-higher-aqa",
          keyStageSlug: "ks4",
          phaseSlug: "secondary",
        });

        expect(href).toBe(
          "/programmes/biology-secondary-higher-aqa/units?keystages=ks4",
        );
      });
    });
  });
});
