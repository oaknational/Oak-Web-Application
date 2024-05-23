import { SyntheticUnitvariantLessons } from "@oaknational/oak-curriculum-schema";

import { processLessons } from "./processLesson";

describe("processLessons", () => {
  it("should process lessons correctly", () => {
    const lessons = [
      {
        programme_fields: {
          subject: "Combined science",
          subject_slug: "combined-science",
          tier_slug: "foundation",
          year_slug: "year-10",
          keystage_slug: "ks4",
          keystage_description: "Key Stage 4",
          phase_slug: "secondary",
          examboard_slug: null,
        },
        unit_data: {
          unit_id: 1,
        },
        unit_slug: "atomic-structure-and-the-periodic-table-u68nqqc",
        programme_slug: "combined-science-secondary-ks4-foundation-l",
        lesson_slug: "chemical-formulae-and-conservation-of-mass-jeab35",
        is_legacy: true,
      },
      {
        programme_fields: {
          subject: "Combined science",
          subject_slug: "combined-science",
          tier_slug: "foundation",
          year_slug: "year-10",
          keystage_slug: "ks4",
          keystage_description: "Key Stage 4",
          phase_slug: "secondary",
          examboard_slug: null,
        },
        unit_data: {
          unit_id: 12,
        },
        unit_slug: "cells-biology-3p8njnj",
        programme_slug: "combined-science-secondary-ks4-foundation-l",
        lesson_slug: "prokaryotic-and-eukaryotic-cells-b9qqye",
        is_legacy: true,
      },
      {
        programme_fields: {
          subject: "Biology",
          subject_slug: "biology",
          tier_slug: "higher",
          year_slug: "year-11",
          keystage_slug: "ks4",
          keystage_description: "Key Stage 4",
          phase_slug: "secondary",
          examboard_slug: "ocr",
        },
        unit_data: {
          unit_id: 2,
        },
        unit_slug: "classification-in-modern-biology",
        programme_slug: "biology-secondary-ks4-higher-ocr",
        lesson_slug: "classifying-organisms-as-eukaryotic-or-prokaryotic",
        is_legacy: false,
      },
      {
        programme_fields: {
          subject: "Biology",
          subject_slug: "biology",
          tier_slug: "higher",
          year_slug: "year-11",
          keystage_slug: "ks4",
          keystage_description: "Key Stage 4",
          phase_slug: "secondary",
          examboard_slug: "ocr",
        },
        unit_data: {
          unit_id: 2,
        },
        unit_slug: "classification-in-modern-biology",
        programme_slug: "biology-secondary-ks4-higher-aqa",
        lesson_slug:
          "electron-microscopy-and-the-size-and-scale-of-cells-including-standard-form",
        is_legacy: false,
      },
    ] as SyntheticUnitvariantLessons[];

    const result = processLessons(lessons);
    expect(result).toEqual([
      {
        subjectTitle: "Combined science",
        subjectSlug: "combined-science",
        programmeSlug: "combined-science-secondary-ks4",
        unitCount: 2,
        lessonCount: 2,
        programmeCount: 1,
      },
      {
        subjectTitle: "Biology",
        subjectSlug: "biology",
        programmeSlug: "biology-secondary-ks4",
        unitCount: 1,
        lessonCount: 2,
        programmeCount: 2,
      },
    ]);
  });
});
