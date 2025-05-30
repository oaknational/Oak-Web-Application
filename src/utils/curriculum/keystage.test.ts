import {
  byKeyStageSlug,
  keystageFromYear,
  presentAtKeyStageSlugs,
} from "./keystage";

import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";

test("byKeyStageSlug", () => {
  const output = byKeyStageSlug({
    "7": {
      tiers: [
        { tier: "Higher", tier_slug: "higher" },
        { tier: "Foundation", tier_slug: "foundation" },
      ],
      childSubjects: [],
      subjectCategories: [],
    },
    "8": {
      tiers: [],
      childSubjects: [],
      subjectCategories: [
        createSubjectCategory({
          id: 3,
          slug: "test1",
        }),
        createSubjectCategory({
          id: 4,
          slug: "test2",
        }),
      ],
    },
    "9": {
      tiers: [],
      childSubjects: [],
      subjectCategories: [],
    },
    "10": {
      tiers: [],
      childSubjects: [
        {
          subject: "english",
          subject_slug: "English",
        },
        {
          subject: "geography",
          subject_slug: "Geography",
        },
      ],
      subjectCategories: [],
    },
    "11": {
      tiers: [
        { tier: "Higher", tier_slug: "higher" },
        { tier: "Foundation", tier_slug: "foundation" },
      ],
      childSubjects: [],
      subjectCategories: [],
    },
  });

  expect(output).toEqual({
    ks1: {
      tiers: [],
      childSubjects: [],
      subjectCategories: [],
    },
    ks2: {
      tiers: [],
      childSubjects: [],
      subjectCategories: [],
    },
    ks3: {
      tiers: [
        { tier: "Higher", tier_slug: "higher" },
        { tier: "Foundation", tier_slug: "foundation" },
      ],
      childSubjects: [],
      subjectCategories: [
        createSubjectCategory({
          id: 3,
          slug: "test1",
        }),
        createSubjectCategory({
          id: 4,
          slug: "test2",
        }),
      ],
    },
    ks4: {
      tiers: [
        { tier: "Higher", tier_slug: "higher" },
        { tier: "Foundation", tier_slug: "foundation" },
      ],
      childSubjects: [
        {
          subject: "english",
          subject_slug: "English",
        },
        {
          subject: "geography",
          subject_slug: "Geography",
        },
      ],
      subjectCategories: [],
    },
  });
});

test("presentAtKeyStageSlugs", () => {
  const definition = {
    ks1: {
      tiers: [],
      childSubjects: [],
      subjectCategories: [],
    },
    ks2: {
      tiers: [],
      childSubjects: [],
      subjectCategories: [
        createSubjectCategory({
          id: 3,
          slug: "test1",
        }),
        createSubjectCategory({
          id: 4,
          slug: "test2",
        }),
      ],
    },
    ks3: {
      tiers: [],
      childSubjects: [
        {
          subject: "english",
          subject_slug: "English",
        },
        {
          subject: "geography",
          subject_slug: "Geography",
        },
      ],
      subjectCategories: [],
    },
    ks4: {
      tiers: [
        { tier: "Higher", tier_slug: "higher" },
        { tier: "Foundation", tier_slug: "foundation" },
      ],
      childSubjects: [],
      subjectCategories: [],
    },
  };
  expect(presentAtKeyStageSlugs(definition, "tiers")).toEqual(["ks4"]);
  expect(presentAtKeyStageSlugs(definition, "childSubjects")).toEqual(["ks3"]);
  expect(presentAtKeyStageSlugs(definition, "subjectCategories")).toEqual([
    "ks2",
  ]);
});

it("keystageFromYear", () => {
  expect(keystageFromYear("1")).toEqual("ks1");
  expect(keystageFromYear("2")).toEqual("ks1");
  expect(keystageFromYear("3")).toEqual("ks2");
  expect(keystageFromYear("4")).toEqual("ks2");
  expect(keystageFromYear("5")).toEqual("ks2");
  expect(keystageFromYear("6")).toEqual("ks2");
  expect(keystageFromYear("7")).toEqual("ks3");
  expect(keystageFromYear("8")).toEqual("ks3");
  expect(keystageFromYear("9")).toEqual("ks3");
  expect(keystageFromYear("10")).toEqual("ks4");
  expect(keystageFromYear("11")).toEqual("ks4");
});
