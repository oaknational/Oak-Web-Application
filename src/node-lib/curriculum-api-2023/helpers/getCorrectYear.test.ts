import { programmeFieldsFixture } from "@oaknational/oak-curriculum-schema";

import { getCorrectYear } from "./getCorrectYear";

describe("getCorrectYear", () => {
  it("should return the lower year whilst leaving the rest of the programmeFields unchanged", () => {
    const programmeSlugByYear = [
      "physical-education-primary-year-6-l",
      "physical-education-primary-year-4-l",
      "physical-education-primary-year-5-l",
    ];
    const pf = programmeFieldsFixture({
      overrides: {
        year_slug: "year-6",
        year_description: "Year 6",
        subject_slug: "physical-education",
      },
    });

    const result = getCorrectYear({ programmeSlugByYear, programmeFields: pf });

    expect(result).toMatchObject({
      year_slug: "year-4",
      year_description: "Year 4",
      subject_slug: "physical-education",
    });
  });

  it("should return the same year if the year slug is 'all-years'", () => {
    const programmeSlugByYear = [
      "physical-education-primary-year-6-l",
      "physical-education-primary-year-4-l",
      "physical-education-primary-year-5-l",
    ];
    const pf = programmeFieldsFixture({
      overrides: {
        year_slug: "all-years",
        year_description: "All years",
        subject_slug: "physical-education",
      },
    });

    const result = getCorrectYear({ programmeSlugByYear, programmeFields: pf });

    expect(result).toMatchObject({
      year_slug: "all-years",
      year_description: "All years",
      subject_slug: "physical-education",
    });
  });
});
