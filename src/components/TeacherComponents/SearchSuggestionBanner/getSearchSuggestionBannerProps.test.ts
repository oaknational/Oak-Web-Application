import { getSearchSuggestionBannerProps } from "./getSearchSuggestionBannerProps";

import { SearchIntent } from "@/common-lib/schemas/search-intent";

describe("getSearchSuggestionBannerProps", () => {
  test("it returns no suggestion if no direct subject match", () => {
    const result = getSearchSuggestionBannerProps({
      directMatch: null,
      suggestedFilters: [],
    });
    expect(result).toBeNull();
  });
  test("it returns a subject and keystage if direct matches for both", () => {
    const searchIntent: SearchIntent = {
      directMatch: {
        subject: { slug: "maths", title: "Maths" },
        keyStage: { slug: "ks2", title: "Key stage 2" },
        examBoard: null,
        year: null,
      },
      suggestedFilters: [],
    };
    const result = getSearchSuggestionBannerProps(searchIntent);
    expect(result).toMatchObject({
      metadata: "Key stage 2",
      title: "Maths",
      body: "placeholder",
      links: [
        {
          keystageSlug: "ks2",
          keystageTitle: "Key stage 2",
        },
      ],
    });
  });
  test("it returns a subject and keystage link with examboard", () => {
    const searchIntent: SearchIntent = {
      directMatch: {
        subject: { slug: "maths", title: "Maths" },
        keyStage: null,
        examBoard: { slug: "aqa", title: "AQA" },
        year: null,
      },
      suggestedFilters: [],
    };
    const result = getSearchSuggestionBannerProps(searchIntent);
    expect(result).toMatchObject({
      metadata: "Key stage 4",
      title: "Maths",
      body: "placeholder",
      links: [
        {
          keystageSlug: "ks4",
          keystageTitle: "Key stage 4",
          examboardSlug: "aqa",
        },
      ],
    });
  });
  test("it returns a subject and keystage links from suggested filters", () => {
    const searchIntent: SearchIntent = {
      directMatch: {
        subject: { slug: "maths", title: "Maths" },
        keyStage: null,
        examBoard: null,
        year: null,
      },
      suggestedFilters: [
        {
          title: "Key stage 1",
          slug: "ks1",
          type: "key-stage",
        },
        {
          title: "Key stage 4",
          slug: "ks4",
          type: "key-stage",
        },
      ],
    };
    const result = getSearchSuggestionBannerProps(searchIntent);
    expect(result).toMatchObject({
      title: "Maths",
      body: "placeholder",
      links: [
        {
          keystageSlug: "ks1",
          keystageTitle: "Key stage 1",
        },
        {
          keystageSlug: "ks4",
          keystageTitle: "Key stage 4",
        },
      ],
    });
  });
  test("it returns a subject and keystage links with exam boards", () => {
    const searchIntent: SearchIntent = {
      directMatch: {
        subject: { slug: "maths", title: "Maths" },
        keyStage: null,
        examBoard: null,
        year: null,
      },
      suggestedFilters: [
        {
          title: "Key stage 1",
          slug: "ks1",
          type: "key-stage",
        },
        {
          title: "Key stage 4",
          slug: "ks4",
          type: "key-stage",
        },
        {
          title: "AQA",
          slug: "aqa",
          type: "exam-board",
        },
      ],
    };
    const result = getSearchSuggestionBannerProps(searchIntent);
    expect(result).toMatchObject({
      title: "Maths",
      body: "placeholder",
      links: [
        {
          keystageSlug: "ks1",
          keystageTitle: "Key stage 1",
        },
        {
          keystageSlug: "ks4",
          keystageTitle: "Key stage 4",
          examboardSlug: "aqa",
        },
      ],
    });
  });
});
