import { programmeFieldsFixture } from "@oaknational/oak-curriculum-schema";

import { getTeachersData } from "./getTeachersData";
import { TopNavResponse } from "./topNav.schema";

const mockResponseData: TopNavResponse = {
  teachers: [
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS1",
          keystage_slug: "ks1",
          phase_slug: "primary",
          subject: "Art and design",
          subject_slug: "art",
        },
      }),
      features: {},
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS2",
          keystage_slug: "ks2",
          phase_slug: "primary",
          subject: "Art and design",
          subject_slug: "art",
        },
      }),
      features: {},
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS3",
          keystage_slug: "ks3",
          phase_slug: "secondary",
          subject: "Art and design",
          subject_slug: "art",
        },
      }),
      features: {},
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS1",
          keystage_slug: "ks1",
          phase_slug: "primary",
          subject: "Financial education",
          subject_slug: "financial-education",
        },
      }),
      features: { non_curriculum: true },
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS2",
          keystage_slug: "ks2",
          phase_slug: "primary",
          subject: "Financial education",
          subject_slug: "financial-education",
        },
      }),
      features: { non_curriculum: true },
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS3",
          keystage_slug: "ks3",
          phase_slug: "secondary",
          subject: "Maths",
          subject_slug: "maths",
        },
      }),
      features: { non_curriculum: false },
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          keystage: "KS4",
          keystage_slug: "ks4",
          phase_slug: "secondary",
          subject: "Maths",
          subject_slug: "maths",
        },
      }),
      features: {},
    },
  ],
};

describe("getTeachersData", () => {
  it("gets primary data", () => {
    const result = getTeachersData(mockResponseData, "primary");
    expect(result.phaseTitle).toBe("Primary");
    expect(result.keystages).toHaveLength(2);
  });
  it("gets secondary data", () => {
    const result = getTeachersData(mockResponseData, "secondary");
    expect(result.phaseTitle).toBe("Secondary");
    expect(result.keystages).toHaveLength(2);
  });
  it("correctly identifies non curriculum subjects", () => {
    const result = getTeachersData(mockResponseData, "primary");
    const financialEducation = result.keystages[0]?.subjects.find(
      (s) => s.slug === "financial-education",
    );
    expect(financialEducation?.nonCurriculum).toBeTruthy();
  });
});
