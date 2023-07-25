import { CurriculumHomePageData } from "..";

const curriculumHomePageFixture = (
  partial?: Partial<CurriculumHomePageData>
): CurriculumHomePageData => {
  return {
    programmes: [
      {
        programme_id: 1,
        programme_fields: {
          year: 1,
          optionality: "",
          phase: "primary",
          phase_description: "Primary",
          subject: "English",
          subject_slug: "english",
          subject_description: "English",
          subject_display_order: "1",
          tier_description: "core",
        },
      },
    ],
    ...partial,
  };
};

export default curriculumHomePageFixture;
