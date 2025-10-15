import { getSearchSuggestionBannerProps } from "./getSearchSuggestionBannerProps";

import { OAK_SUBJECTS } from "@/context/Search/suggestions/oakCurriculumData";
import { SearchIntent } from "@/common-lib/schemas/search-intent";

const mathsDescription = OAK_SUBJECTS.find(
  (s) => s.slug == "maths",
)?.description;
const citizenshipDescription = OAK_SUBJECTS.find(
  (s) => s.slug == "citizenship",
)?.description;

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
      body: mathsDescription,
      links: [
        {
          keystageSlug: "ks2",
          keystageTitle: "Key stage 2",
        },
      ],
    });
  });
  test("it returns a subject and keystage link", () => {
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
      body: mathsDescription,
      links: [
        {
          keystageSlug: "ks4",
          keystageTitle: "Key stage 4",
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
      body: mathsDescription,
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
  test("it returns a subject and keystage links", () => {
    const searchIntent: SearchIntent = {
      directMatch: {
        subject: { slug: "maths", title: "Maths" },
        keyStage: null,
        examBoard: null,
        year: null,
      },
      suggestedFilters: [
        {
          title: "Key Stage 1",
          slug: "ks1",
          type: "key-stage",
        },
        {
          title: "Key Stage 4",
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
      body: mathsDescription,
      links: [
        {
          keystageSlug: "ks1",
          keystageTitle: "Key Stage 1",
        },
        {
          keystageSlug: "ks4",
          keystageTitle: "Key Stage 4",
        },
      ],
    });
  });
  test("it returns valid keystages for the subject", () => {
    const searchIntent: SearchIntent = {
      directMatch: {
        subject: { slug: "citizenship", title: "Citizenship" },
        keyStage: { slug: "ks1", title: "Key Stage 1" },
        examBoard: null,
        year: null,
      },
      suggestedFilters: [
        {
          title: "Key Stage 1",
          slug: "ks1",
          type: "key-stage",
        },
      ],
    };
    const result = getSearchSuggestionBannerProps(searchIntent);
    expect(result).toMatchObject({
      title: "Citizenship",
      body: citizenshipDescription,
      links: [
        {
          keystageSlug: "ks3",
          keystageTitle: "Key Stage 3",
        },
        {
          keystageSlug: "ks4",
          keystageTitle: "Key Stage 4",
        },
      ],
    });
  });
  test("it returns valid keystages for direct matches without suggestions", () => {
    const searchIntent: SearchIntent = {
      directMatch: {
        subject: { slug: "maths", title: "Maths" },
        keyStage: null,
        examBoard: null,
        year: { slug: "year-1", title: "Year 1" },
      },
      suggestedFilters: [],
    };
    const result = getSearchSuggestionBannerProps(searchIntent);
    expect(result).toMatchObject({
      title: "Maths",
      body: mathsDescription,
      links: [
        {
          keystageSlug: "ks1",
          keystageTitle: "Key Stage 1",
        },
        {
          keystageSlug: "ks2",
          keystageTitle: "Key Stage 2",
        },
        {
          keystageSlug: "ks3",
          keystageTitle: "Key Stage 3",
        },
        {
          keystageSlug: "ks4",
          keystageTitle: "Key Stage 4",
        },
      ],
    });
  });
});
