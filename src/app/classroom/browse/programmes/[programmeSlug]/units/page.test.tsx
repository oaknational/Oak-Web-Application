import React from "react";

import Page from "./page";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { extractBaseSlug } from "@/pages-helpers/pupil";
import { checkAndExcludeUnitsWithAgeRestrictedLessons } from "@/pages-helpers/pupil/units-page/units-page-helper";
import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";

type UnitsListingViewProps = {
  programmeSlug: string;
  programmeUnits: UnitListingBrowseData[number][][];
  programmeData: UnitListingBrowseData[number]["programmeFields"];
  unitsLessonListUrlTemplate: string;
  headerLeftSlot: React.ReactNode;
};

const unitsListingViewMock = jest.fn();

jest.mock("lodash", () => jest.requireActual("lodash"));

jest.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  },
}));

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  UnitsListingView: (props: never) => {
    unitsListingViewMock(props);
    return <div data-testid="units-view">Units</div>;
  },
  UnitCards: () => <div data-testid="unit-cards" />,
}));

jest.mock("@/node-lib/curriculum-api-2023");
jest.mock("@/pages-helpers/pupil");
jest.mock("@/pages-helpers/pupil/units-page/units-page-helper");

describe("src/app/classroom/browse/programmes/[programmeSlug]/units/page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (extractBaseSlug as jest.Mock).mockImplementation((slug: string) => slug);
    (
      checkAndExcludeUnitsWithAgeRestrictedLessons as jest.Mock
    ).mockImplementation((units) => units);
  });

  it("renders units listing sorted and grouped for optionality", async () => {
    const mockData = [
      {
        programmeSlug: "maths-h",
        unitSlug: "algebra-2-1",
        programmeFields: {
          yearSlug: "year-10",
          subjectSlug: "maths",
          optionality: true,
        },
        supplementaryData: { unitOrder: 2 },
      },
      {
        programmeSlug: "maths-h",
        unitSlug: "algebra-2-2",
        programmeFields: {
          yearSlug: "year-10",
          subjectSlug: "maths",
          optionality: true,
        },
        supplementaryData: { unitOrder: 1 },
      },
      {
        programmeSlug: "maths-h",
        unitSlug: "algebra-1",
        programmeFields: {
          yearSlug: "year-10",
          subjectSlug: "maths",
          optionality: false,
        },
        supplementaryData: { unitOrder: 3 },
      },
    ];
    (curriculumApi2023.pupilUnitListingQuery as jest.Mock).mockResolvedValue(
      mockData,
    );

    renderWithTheme(
      (await Page({
        params: Promise.resolve({ programmeSlug: "maths-h" }),
      })) ?? <></>,
    );

    expect(extractBaseSlug).toHaveBeenCalledWith("maths-h");
    expect(curriculumApi2023.pupilUnitListingQuery).toHaveBeenCalledWith({
      baseSlug: "maths-h",
    });
    expect(checkAndExcludeUnitsWithAgeRestrictedLessons).toHaveBeenCalledWith(
      mockData,
    );

    const props = unitsListingViewMock.mock
      .calls[0][0] as UnitsListingViewProps;
    expect(props.programmeUnits).toHaveLength(2);
    expect(props.programmeUnits[0]).toHaveLength(2);
    expect(
      props.programmeUnits[0]?.map((unit) =>
        unit.unitSlug.replace(/-\d+$/, ""),
      ),
    ).toEqual(["algebra-2", "algebra-2"]);
    expect(props.programmeUnits[1]?.map((unit) => unit.unitSlug)).toEqual([
      "algebra-1",
    ]);
    expect(props.programmeData.yearSlug).toBe("year-10");
    expect(props.headerLeftSlot).toBeTruthy();
  });

  it("returns 404 when no curriculum data", async () => {
    (curriculumApi2023.pupilUnitListingQuery as jest.Mock).mockResolvedValue(
      null,
    );

    await expect(
      Page({
        params: Promise.resolve({ programmeSlug: "nope" }),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });

  it("returns 404 when all units are filtered out", async () => {
    const mockData = [
      {
        programmeSlug: "maths-h",
        unitSlug: "algebra-1",
        programmeFields: {
          yearSlug: "year-10",
          subjectSlug: "maths",
          optionality: false,
        },
        supplementaryData: { unitOrder: 1 },
      },
    ];
    (curriculumApi2023.pupilUnitListingQuery as jest.Mock).mockResolvedValue(
      mockData,
    );
    (checkAndExcludeUnitsWithAgeRestrictedLessons as jest.Mock).mockReturnValue(
      [],
    );

    await expect(
      Page({
        params: Promise.resolve({ programmeSlug: "maths-h" }),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });

  it("returns 404 when selected programme cannot be found", async () => {
    const mockData = [
      {
        programmeSlug: 123,
        unitSlug: "algebra-1",
        programmeFields: {
          yearSlug: "year-10",
          subjectSlug: "maths",
          optionality: false,
        },
        supplementaryData: { unitOrder: 1 },
      },
    ];
    (curriculumApi2023.pupilUnitListingQuery as jest.Mock).mockResolvedValue(
      mockData,
    );

    await expect(
      Page({
        params: Promise.resolve({ programmeSlug: "123" }),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});
