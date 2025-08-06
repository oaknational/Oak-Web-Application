import { createXmlIndexMap, getFlatUnits } from "./helper";

import { createUnit } from "@/fixtures/curriculum/unit";
import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";

describe("createXmlIndexMap", () => {
  it("should return XML and mapped keys/indexes", () => {
    const { xml, indexMap } = createXmlIndexMap({
      foo: "test1",
      bar: "test2",
    });
    expect(xml).toEqual("test1\ntest2");
    expect(indexMap).toEqual({ foo: "0", bar: "1" });
  });
});

describe("getFlatUnits", () => {
  test("with subject-category grouping", () => {
    const actions = {
      subject_category_actions: {
        group_by_subjectcategory: true,
      },
    };
    const subcat1 = createSubjectCategory({ id: 1, slug: "subcat1" });
    const subcat2 = createSubjectCategory({ id: 2, slug: "subcat1" });
    const units = [
      createUnit({ slug: "one", subjectcategories: [subcat1], actions }),
      createUnit({ slug: "two", subjectcategories: [subcat2], actions }),
      createUnit({ slug: "three", subjectcategories: [subcat1], actions }),
      createUnit({ slug: "four", subjectcategories: [subcat2], actions }),
    ];
    const flatUnits = getFlatUnits(units);
    expect(flatUnits).toEqual([
      { ...units[0], subjectCategory: subcat1, order: 1 },
      { ...units[2], subjectCategory: subcat1, order: 2 },
      { ...units[1], subjectCategory: subcat2, order: 1 },
      { ...units[3], subjectCategory: subcat2, order: 2 },
    ]);
  });

  test("without subject-category grouping", () => {
    const actions = {};
    const subcat1 = createSubjectCategory({ slug: "subcat1" });
    const subcat2 = createSubjectCategory({ slug: "subcat1" });
    const units = [
      createUnit({
        slug: "one",
        order: 1,
        subjectcategories: [subcat1],
        actions,
      }),
      createUnit({
        slug: "two",
        order: 2,
        subjectcategories: [subcat2],
        actions,
      }),
      createUnit({
        slug: "three",
        order: 3,
        subjectcategories: [subcat1],
        actions,
      }),
      createUnit({
        slug: "four",
        order: 4,
        subjectcategories: [subcat2],
        actions,
      }),
    ];
    const flatUnits = getFlatUnits(units);
    expect(flatUnits).toEqual([
      { ...units[0], order: 1 },
      { ...units[1], order: 2 },
      { ...units[2], order: 3 },
      { ...units[3], order: 4 },
    ]);
  });
});
