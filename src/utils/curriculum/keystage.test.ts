import { byKeyStageSlug, presentAtKeyStageSlugs } from "./keystage";

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
        {
          id: 3,
          title: "test1",
        },
        {
          id: 4,
          title: "test2",
        },
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
        {
          id: 3,
          title: "test1",
        },
        {
          id: 4,
          title: "test2",
        },
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
        {
          id: 3,
          title: "test1",
        },
        {
          id: 4,
          title: "test2",
        },
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
