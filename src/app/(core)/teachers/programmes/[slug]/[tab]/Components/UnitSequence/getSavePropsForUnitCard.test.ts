import { getSavePropsForUnitCard } from "./getSavePropsForUnitCard";

import { createUnitOption } from "@/fixtures/curriculum/unitOption";
import { createTeacherProgrammeSlug } from "@/utils/curriculum/slugs";
import { createUnit } from "@/fixtures/curriculum/unit";

const unitWithOptions = createUnit({
  slug: "something-nice",
  unit_options: [
    createUnitOption({
      slug: "really-nice",
    }),
    createUnitOption({
      slug: "kind-of-nice",
    }),
  ],
});

const unitWithoutOptions = createUnit({
  slug: "something-nice",
  unit_options: [],
});

const unitWithoutOptionsProps = {
  slug: unitWithoutOptions.slug,
  title: unitWithoutOptions.title,
  programmeSlug: createTeacherProgrammeSlug(unitWithoutOptions),
  subject: unitWithoutOptions.subject,
  subjectSlug: unitWithoutOptions.subject_slug,
  keystageSlug: unitWithoutOptions.keystage_slug,
  isOptionalityUnit: false,
};

const unitWithOptionsProps = {
  slug: unitWithOptions.slug,
  title: unitWithOptions.title,
  programmeSlug: createTeacherProgrammeSlug(unitWithOptions),
  subject: unitWithOptions.subject,
  subjectSlug: unitWithOptions.subject_slug,
  keystageSlug: unitWithOptions.keystage_slug,
  isOptionalityUnit: true,
};

describe("getSavePropsForUnitCard", () => {
  it("returns valid save props when signed in", () => {
    const result = getSavePropsForUnitCard(unitWithoutOptionsProps);

    expect(result).toEqual({
      unitSlug: "something-nice",
      unitTitle: "Something nice",
      programmeSlug: "maths-primary-ks2",
      trackingProps: {
        savedFrom: "unit_listing_save_button",
        keyStageSlug: "ks2",
        keyStageTitle: "Key stage 2",
        subjectTitle: "Maths",
        subjectSlug: "maths",
      },
    });
  });
  it("should return undefined for optionality units", () => {
    const result = getSavePropsForUnitCard(unitWithOptionsProps);
    expect(result).toBeUndefined();
  });
});
