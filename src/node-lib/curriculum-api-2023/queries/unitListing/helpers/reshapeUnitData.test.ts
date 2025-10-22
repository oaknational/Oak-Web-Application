import { syntheticUnitvariantsWithLessonIdsByKsFixture } from "@oaknational/oak-curriculum-schema";

import { UnitsCamel } from "../unitListing.schema";

import { reshapeUnitData } from "./reshapeUnitData";

import keysToCamelCase from "@/utils/snakeCaseConverter";

const camelCaseFixture = ({
  overrides,
}: {
  overrides?: Partial<UnitsCamel[number]>;
} = {}) => {
  const f = syntheticUnitvariantsWithLessonIdsByKsFixture();
  const fCamel = keysToCamelCase(f);
  return { ...fCamel, ...overrides };
};

const defaultUnitData = camelCaseFixture().unitData;

describe("reshapeUnitData", () => {
  it("keeps units with distinct titles separate", () => {
    const rawUnits = [
      camelCaseFixture({
        overrides: {
          unitSlug: "unit-slug-1",
          unitData: { ...defaultUnitData, title: "unit-title-1" },
        },
      }),
      camelCaseFixture({
        overrides: {
          unitSlug: "unit-slug-2",
          unitData: { ...defaultUnitData, title: "unit-title-2" },
        },
      }),
    ];

    const res = reshapeUnitData(rawUnits);
    expect(res).toHaveLength(2);
  });

  it("groups units with the same title but different optionality together", () => {
    const rawUnits = [
      camelCaseFixture({
        overrides: {
          unitSlug: "unit-slug-1",
          unitData: { ...defaultUnitData, title: "unit-title-1" },
          programmeFields: {
            ...camelCaseFixture().programmeFields,
            optionality: "Optional 1",
          },
        },
      }),
      camelCaseFixture({
        overrides: {
          unitSlug: "unit-slug-2",
          unitData: { ...defaultUnitData, title: "unit-title-1" },
          programmeFields: {
            ...camelCaseFixture().programmeFields,
            optionality: "Optional 2",
          },
        },
      }),
    ];
    const res = reshapeUnitData(rawUnits);
    expect(res).toHaveLength(1);
    expect(res[0]).toHaveLength(2);
    if (!res[0]) {
      throw new Error("No units found");
    }
    expect(res[0][0]?.title).toEqual("Optional 1");
    expect(res[0][1]?.title).toEqual("Optional 2");
  });

  it("sorts units by year and then by unit order", () => {
    const rawUnits = [
      camelCaseFixture({
        overrides: {
          unitSlug: "unit-slug-1",
          unitData: { ...defaultUnitData, title: "unit-title-1" },
          supplementaryData: { unitOrder: 2 },
          programmeFields: {
            ...camelCaseFixture().programmeFields,
            yearDisplayOrder: 2,
          },
        },
      }),
      camelCaseFixture({
        overrides: {
          unitSlug: "unit-slug-2",
          unitData: { ...defaultUnitData, title: "unit-title-2" },
          supplementaryData: { unitOrder: 1 },
          programmeFields: {
            ...camelCaseFixture().programmeFields,
            yearDisplayOrder: 1,
          },
        },
      }),
      camelCaseFixture({
        overrides: {
          unitSlug: "unit-slug-3",
          unitData: { ...defaultUnitData, title: "unit-title-3" },
          programmeFields: {
            ...camelCaseFixture().programmeFields,
            yearDisplayOrder: 2,
          },
          supplementaryData: { unitOrder: 1 },
        },
      }),
      camelCaseFixture({
        overrides: {
          unitSlug: "unit-slug-4",
          unitData: { ...defaultUnitData, title: "unit-title-4" },
          programmeFields: {
            ...camelCaseFixture().programmeFields,
            yearDisplayOrder: 1,
          },
          supplementaryData: { unitOrder: 2 },
        },
      }),
    ];

    const res = reshapeUnitData(rawUnits);
    expect(res).toHaveLength(4);
    const titles = res.map((unit) => unit[0]?.title);
    expect(titles).toEqual([
      "unit-title-2",
      "unit-title-4",
      "unit-title-3",
      "unit-title-1",
    ]);
  });

  it("sorts swimming units first", () => {
    const rawUnits = [
      camelCaseFixture({
        overrides: {
          unitSlug: "unit-slug-1",
          unitData: { ...defaultUnitData, title: "unit-title-1" },
          supplementaryData: { unitOrder: 2 },
          programmeFields: {
            ...camelCaseFixture().programmeFields,
            yearDisplayOrder: 2,
          },
        },
      }),
      camelCaseFixture({
        overrides: {
          unitSlug: "unit-slug-2",
          unitData: { ...defaultUnitData, title: "unit-title-2" },
          supplementaryData: { unitOrder: 1 },
          programmeFields: {
            ...camelCaseFixture().programmeFields,
            yearDisplayOrder: 1,
          },
          actions: { groupUnitsAs: "Swimming and water safety" },
        },
      }),
      camelCaseFixture({
        overrides: {
          unitSlug: "unit-slug-3",
          unitData: { ...defaultUnitData, title: "unit-title-3" },
          programmeFields: {
            ...camelCaseFixture().programmeFields,
            yearDisplayOrder: 2,
          },
          supplementaryData: { unitOrder: 1 },
          actions: { groupUnitsAs: "Swimming and water safety" },
        },
      }),
      camelCaseFixture({
        overrides: {
          unitSlug: "unit-slug-4",
          unitData: { ...defaultUnitData, title: "unit-title-4" },
          programmeFields: {
            ...camelCaseFixture().programmeFields,
            yearDisplayOrder: 1,
          },
          supplementaryData: { unitOrder: 2 },
        },
      }),
    ];

    const res = reshapeUnitData(rawUnits);
    expect(res).toHaveLength(4);
    const titles = res.map((unit) => unit[0]?.title);
    expect(titles).toEqual([
      "unit-title-1",
      "unit-title-3",
      "unit-title-4",
      "unit-title-2",
    ]);
  });
});
