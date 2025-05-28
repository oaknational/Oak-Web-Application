import { getUnitSeoFromYearData } from "./seo";

import { createYearData } from "@/fixtures/curriculum/yearData";
import { createUnit } from "@/fixtures/curriculum/unit";
import { createLesson } from "@/fixtures/curriculum/lesson";

describe("getUnitSeoFromYearData", () => {
  it("basic", () => {
    expect(
      getUnitSeoFromYearData({
        yearData: {
          "10": createYearData({
            units: [
              createUnit({
                slug: "foo",
                keystage_slug: "ks4",
                lessons: [createLesson({ slug: "test-lesson" })],
              }),
            ],
          }),
        },
        slug: "foo",
        ks4OptionSlug: "",
        tier: "",
      }),
    ).toEqual({
      canonicalURL:
        "NEXT_PUBLIC_SEO_APP_URL/teachers/programmes/transfiguration-primary-ks4/units/foo/lessons",
      noIndex: true,
    });
  });

  it("basic (without lessons", () => {
    expect(
      getUnitSeoFromYearData({
        yearData: {
          "10": createYearData({
            units: [
              createUnit({
                slug: "foo",
                keystage_slug: "ks4",
                lessons: [],
              }),
            ],
          }),
        },
        slug: "foo",
        ks4OptionSlug: "",
        tier: "",
      }),
    ).toEqual({
      noIndex: true,
    });
  });

  it("invalid slug", () => {
    expect(
      getUnitSeoFromYearData({
        yearData: {
          "10": createYearData({
            units: [
              createUnit({
                slug: "foo",
                keystage_slug: "ks4",
                lessons: [],
              }),
            ],
          }),
        },
        slug: "baz",
        ks4OptionSlug: "",
        tier: "",
      }),
    ).toEqual({
      noIndex: true,
    });
  });

  it("with tier", () => {
    expect(
      getUnitSeoFromYearData({
        yearData: {
          "10": createYearData({
            units: [
              createUnit({
                slug: "foo",
                tier: "Higher",
                keystage_slug: "ks4",
                tier_slug: "higher",
                lessons: [createLesson({ slug: "test-lesson" })],
              }),
            ],
          }),
        },
        slug: "foo",
        ks4OptionSlug: undefined,
        tier: "higher",
      }),
    ).toEqual({
      canonicalURL:
        "NEXT_PUBLIC_SEO_APP_URL/teachers/programmes/transfiguration-primary-ks4-higher/units/foo/lessons",
      noIndex: true,
    });
  });

  it("with ks4OptionSlug", () => {
    expect(
      getUnitSeoFromYearData({
        yearData: {
          "10": createYearData({
            units: [
              createUnit({
                slug: "foo",
                keystage_slug: "ks4",
                lessons: [createLesson({ slug: "test-lesson" })],
              }),
            ],
          }),
        },
        slug: "foo",
        ks4OptionSlug: "aqa",
        tier: undefined,
      }),
    ).toEqual({
      canonicalURL:
        "NEXT_PUBLIC_SEO_APP_URL/teachers/programmes/transfiguration-primary-ks4-aqa/units/foo/lessons",
      noIndex: true,
    });
  });

  it("with tier & ks4OptionSlug", () => {
    expect(
      getUnitSeoFromYearData({
        yearData: {
          "10": createYearData({
            units: [
              createUnit({
                slug: "foo",
                tier: "Higher",
                tier_slug: "higher",
                keystage_slug: "ks4",
                lessons: [createLesson({ slug: "test-lesson" })],
              }),
            ],
          }),
        },
        slug: "foo",
        ks4OptionSlug: "core",
        tier: "core",
      }),
    ).toEqual({
      canonicalURL:
        "NEXT_PUBLIC_SEO_APP_URL/teachers/programmes/transfiguration-primary-ks4-core/units/foo/lessons",
      noIndex: true,
    });
  });
});
