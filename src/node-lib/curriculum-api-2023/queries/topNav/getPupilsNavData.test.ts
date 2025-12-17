import { programmeFieldsFixture } from "@oaknational/oak-curriculum-schema";

import { TopNavResponse } from "./topNav.schema";
import { getPupilsNavData } from "./getPupilsNavData";

const mockResponseData: TopNavResponse = {
  programmes: [
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-1",
          year_description: "Year 1",
          phase_slug: "primary",
        },
      }),
      features: {},
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-2",
          year_description: "Year 2",
          phase_slug: "primary",
        },
      }),
      features: {},
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-3",
          year_description: "Year 3",
          phase_slug: "primary",
        },
      }),
      features: {},
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-4",
          year_description: "Year 4",
          phase_slug: "primary",
        },
      }),
      features: {},
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-5",
          year_description: "Year 5",
          phase_slug: "primary",
        },
      }),
      features: {},
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-6",
          year_description: "Year 6",
          phase_slug: "primary",
        },
      }),
      features: {},
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-7",
          year_description: "Year 7",
          phase_slug: "secondary",
        },
      }),
      features: {},
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-8",
          year_description: "Year 8",
          phase_slug: "secondary",
        },
      }),
      features: {},
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-9",
          year_description: "Year 9",
          phase_slug: "secondary",
        },
      }),
      features: {},
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-10",
          year_description: "Year 10",
          phase_slug: "secondary",
        },
      }),
      features: {},
    },
    {
      programme_fields: programmeFieldsFixture({
        overrides: {
          year_slug: "year-11",
          year_description: "Year 11",
          phase_slug: "secondary",
        },
      }),
      features: {},
    },
  ],
};

describe("getPupilsNavData", () => {
  it("returns correct data for primary", () => {
    const result = getPupilsNavData(mockResponseData, "primary");
    expect(result.phaseTitle).toBe("Primary");
    expect(result.years).toHaveLength(6);
  });
  it("returns correct data for secondary", () => {
    const result = getPupilsNavData(mockResponseData, "secondary");
    expect(result.phaseTitle).toBe("Secondary");
    expect(result.years).toHaveLength(5);
  });
});
