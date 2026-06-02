import { getTeachersSubjectNavHref } from "./getTeachersNavHrefs";

import type { CurriculumPhaseOptions } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.query";

const curriculumPhaseOptionsSubjects: CurriculumPhaseOptions = [
  {
    title: "History",
    slug: "history",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    ks4_options: [
      { title: "AQA", slug: "aqa" },
      { title: "Edexcel", slug: "edexcel" },
    ],
  },
  {
    title: "Citizenship",
    slug: "citizenship",
    phases: [{ title: "Secondary", slug: "secondary" }],
    ks4_options: [{ title: "GCSE", slug: "gcse" }],
  },
  {
    title: "Design and technology",
    slug: "design-technology",
    phases: [{ title: "Secondary", slug: "secondary" }],
    ks4_options: [],
  },
];

describe("getTeachersSubjectNavHref", () => {
  describe("EYFS subjects", () => {
    it("generates EYFS route for single word EYFS programmes", () => {
      const href = getTeachersSubjectNavHref({
        subject: {
          slug: "maths",
          pathwaySlug: null,
          programmeSlug: "maths-foundation-early-years-foundation-stage-l",
        },
        keyStageSlug: "early-years-foundation-stage",
        phaseSlug: "primary",
        curriculumPhaseOptionsSubjects,
      });

      expect(href).toBe("/teachers/eyfs/maths");
    });
  });

  describe("all other subjects", () => {
    it("links to teacher-programme with keystage query", () => {
      const href = getTeachersSubjectNavHref({
        subject: {
          slug: "history",
          pathwaySlug: null,
          programmeSlug: "history-primary-ks2",
        },
        keyStageSlug: "ks2",
        phaseSlug: "primary",
        curriculumPhaseOptionsSubjects,
      });

      expect(href).toBe(
        "/teachers/programmes/history-primary/units?keystages=ks2",
      );
    });

    it("includes default ks4 option from phase options when slug is incomplete", () => {
      const href = getTeachersSubjectNavHref({
        subject: {
          slug: "history",
          pathwaySlug: null,
          programmeSlug: "history-secondary-ks3",
        },
        keyStageSlug: "ks3",
        phaseSlug: "secondary",
        curriculumPhaseOptionsSubjects,
      });

      expect(href).toBe(
        "/teachers/programmes/history-secondary-edexcel/units?keystages=ks3",
      );
    });

    it("includes gcse for citizenship", () => {
      const href = getTeachersSubjectNavHref({
        subject: {
          slug: "citizenship",
          pathwaySlug: null,
          programmeSlug: "citizenship-secondary-ks4-gcse",
        },
        keyStageSlug: "ks4",
        phaseSlug: "secondary",
        curriculumPhaseOptionsSubjects,
      });

      expect(href).toBe(
        "/teachers/programmes/citizenship-secondary-gcse/units?keystages=ks4",
      );
    });

    it("does not append ks4 option when phase options omit ks4_options", () => {
      const href = getTeachersSubjectNavHref({
        subject: {
          slug: "design-technology",
          pathwaySlug: null,
          programmeSlug: "design-technology-secondary-ks3",
        },
        keyStageSlug: "ks3",
        phaseSlug: "secondary",
        curriculumPhaseOptionsSubjects,
      });

      expect(href).toBe(
        "/teachers/programmes/design-technology-secondary/units?keystages=ks3",
      );
    });

    it("preserves pathway slug segments like core", () => {
      const href = getTeachersSubjectNavHref({
        subject: {
          slug: "citizenship",
          pathwaySlug: "core",
          programmeSlug: "citizenship-secondary-ks4-core",
        },
        keyStageSlug: "ks4",
        phaseSlug: "secondary",
        curriculumPhaseOptionsSubjects,
      });

      expect(href).toBe(
        "/teachers/programmes/citizenship-secondary-core/units?keystages=ks4",
      );
    });
  });
});
