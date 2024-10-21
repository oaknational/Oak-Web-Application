import {
  getKs4RedirectSlug,
  isValidSubjectPhaseSlug,
  KS4_EXAMBOARD_PREFERENCE,
  parseSubjectPhaseSlug,
} from "./slugs";

import { SubjectPhaseOptions } from "@/node-lib/curriculum-api-2023/queries/subjectPhaseOptions/subjectPhaseOptions.query";

describe("parseSubjectPhaseSlug", () => {
  it("should extract from a valid slug", () => {
    const slug = "english-secondary-aqa";
    const parsed = parseSubjectPhaseSlug(slug);
    expect(parsed).toEqual({
      subjectSlug: "english",
      phaseSlug: "secondary",
      ks4OptionSlug: "aqa",
    });
  });

  it("should reject an invalid slug", () => {
    const slug = "not_a_valid_slug";
    const parsed = parseSubjectPhaseSlug(slug);
    expect(parsed).toEqual(undefined);
  });
});

const testSubjectPhaseOptions: SubjectPhaseOptions = [
  {
    title: "English",
    slug: "english",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    ks4_options: [
      { title: "AQA", slug: "aqa" },
      { title: "Edexcel", slug: "edexcel" },
    ],
    keystages: [
      { title: "KS1", slug: "ks1" },
      { title: "KS3", slug: "ks3" },
    ],
    cycle: "1",
  },
];

describe("isValidSubjectPhaseSlug", () => {
  it("valid to return true", () => {
    expect(
      isValidSubjectPhaseSlug(testSubjectPhaseOptions, {
        phaseSlug: "primary",
        subjectSlug: "english",
        ks4OptionSlug: null,
      }),
    ).toEqual(true);

    expect(
      isValidSubjectPhaseSlug(testSubjectPhaseOptions, {
        phaseSlug: "secondary",
        subjectSlug: "english",
        ks4OptionSlug: "aqa",
      }),
    ).toEqual(true);
  });

  it("invalid to return false", () => {
    expect(
      isValidSubjectPhaseSlug(testSubjectPhaseOptions, {
        phaseSlug: "foo",
        subjectSlug: "english",
        ks4OptionSlug: null,
      }),
    ).toEqual(false);

    expect(
      isValidSubjectPhaseSlug(testSubjectPhaseOptions, {
        phaseSlug: "secondary",
        subjectSlug: "english",
        ks4OptionSlug: null,
      }),
    ).toEqual(false);
  });
});

describe("getKs4RedirectSlug", () => {
  it("return undefined if ks4OptionSlug specified", () => {
    expect(
      getKs4RedirectSlug(testSubjectPhaseOptions, {
        subjectSlug: "english",
        phaseSlug: "secondary",
        ks4OptionSlug: "aqa",
      }),
    ).toEqual(undefined);
  });

  it("return undefined if no match", () => {
    expect(
      getKs4RedirectSlug(testSubjectPhaseOptions, {
        subjectSlug: "test",
        phaseSlug: "secondary",
        ks4OptionSlug: null,
      }),
    ).toEqual(undefined);
  });

  it("return correct default when specified", () => {
    expect(
      getKs4RedirectSlug(testSubjectPhaseOptions, {
        subjectSlug: "english",
        phaseSlug: "secondary",
        ks4OptionSlug: null,
      }),
    ).toEqual({
      subjectSlug: "english",
      phaseSlug: "secondary",
      ks4OptionSlug: KS4_EXAMBOARD_PREFERENCE["english"],
    });
  });
});
