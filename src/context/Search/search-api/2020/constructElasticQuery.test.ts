import { describe, expect, it } from "vitest";

import { createSearchQuery } from "../../useSearch";

import constructElasticQuery from "./constructElasticQuery";

describe("Search/2020/constructElasticQuery", () => {
  it("handles search term (without key stages)", () => {
    const elasticQuery = constructElasticQuery(
      createSearchQuery({ term: "writing" }),
    );
    expect(elasticQuery).toEqual({
      from: 0,
      size: 100,
      query: {
        bool: {
          should: [
            {
              multi_match: {
                query: "writing",
                type: "phrase",
                analyzer: "stop",
                fields: ["title^10", "*_title^6", "lesson_description^3"],
              },
            },
            {
              multi_match: {
                query: "writing",
                fields: ["*"],
                type: "most_fields",
                analyzer: "stop",
                fuzziness: "AUTO:4,7",
                prefix_length: 1,
              },
            },
          ],
          filter: [
            { term: { expired: false } },
            { term: { is_specialist: false } },
            { terms: { key_stage_slug: ["1", "2", "3", "4"] } },
            { terms: { key_stage_slug: ["1", "2", "3", "4"] } },
            { terms: { type: ["lesson", "unit"] } },
            { terms: { key_stage_slug: ["1", "2", "3", "4"] } },
          ],
          minimum_should_match: 1,
        },
      },
      highlight: {
        number_of_fragments: 0,
        pre_tags: ["<b>"],
        post_tags: ["</b>"],
        fields: { topic_title: {}, theme_title: {}, lesson_description: {} },
      },
    });
  });
  it("handles key stages", () => {
    const elasticQuery = constructElasticQuery(
      createSearchQuery({ term: "macbeth", keyStages: ["ks3"] }),
    );

    expect(elasticQuery).toEqual({
      from: 0,
      size: 100,
      query: {
        bool: {
          should: [
            {
              multi_match: {
                query: "macbeth",
                type: "phrase",
                analyzer: "stop",
                fields: ["title^10", "*_title^6", "lesson_description^3"],
              },
            },
            {
              multi_match: {
                query: "macbeth",
                fields: ["*"],
                type: "most_fields",
                analyzer: "stop",
                fuzziness: "AUTO:4,7",
                prefix_length: 1,
              },
            },
          ],
          filter: [
            { term: { expired: false } },
            { term: { is_specialist: false } },
            { terms: { key_stage_slug: ["3"] } },
            { terms: { key_stage_slug: ["1", "2", "3", "4"] } },
            { terms: { type: ["lesson", "unit"] } },
            { terms: { key_stage_slug: ["1", "2", "3", "4"] } },
          ],
          minimum_should_match: 1,
        },
      },
      highlight: {
        number_of_fragments: 0,
        pre_tags: ["<b>"],
        post_tags: ["</b>"],
        fields: { topic_title: {}, theme_title: {}, lesson_description: {} },
      },
    });
  });
  it("handles subject filters", () => {
    const elasticQuery = constructElasticQuery(
      createSearchQuery({
        term: "macbeth",
        keyStages: ["ks3"],
        subjects: ["computing"],
      }),
    );

    expect(elasticQuery).toEqual({
      from: 0,
      size: 100,
      query: {
        bool: {
          should: [
            {
              multi_match: {
                query: "macbeth",
                type: "phrase",
                analyzer: "stop",
                fields: ["title^10", "*_title^6", "lesson_description^3"],
              },
            },
            {
              multi_match: {
                query: "macbeth",
                fields: ["*"],
                type: "most_fields",
                analyzer: "stop",
                fuzziness: "AUTO:4,7",
                prefix_length: 1,
              },
            },
          ],
          filter: [
            { term: { expired: false } },
            { term: { is_specialist: false } },
            { terms: { key_stage_slug: ["3"] } },
            { terms: { subject_slug: ["computing"] } },
            { terms: { type: ["lesson", "unit"] } },
            { terms: { key_stage_slug: ["1", "2", "3", "4"] } },
          ],
          minimum_should_match: 1,
        },
      },
      highlight: {
        number_of_fragments: 0,
        pre_tags: ["<b>"],
        post_tags: ["</b>"],
        fields: { topic_title: {}, theme_title: {}, lesson_description: {} },
      },
    });
  });

  it("handles type filters", () => {
    const elasticQuery = constructElasticQuery(
      createSearchQuery({
        term: "macbeth",
        keyStages: ["ks3"],
        subjects: ["computing"],
        contentTypes: ["lesson"],
      }),
    );
    expect(elasticQuery).toEqual({
      from: 0,
      size: 100,
      query: {
        bool: {
          should: [
            {
              multi_match: {
                query: "macbeth",
                type: "phrase",
                analyzer: "stop",
                fields: ["title^10", "*_title^6", "lesson_description^3"],
              },
            },
            {
              multi_match: {
                query: "macbeth",
                fields: ["*"],
                type: "most_fields",
                analyzer: "stop",
                fuzziness: "AUTO:4,7",
                prefix_length: 1,
              },
            },
          ],
          filter: [
            { term: { expired: false } },
            { term: { is_specialist: false } },
            { terms: { key_stage_slug: ["3"] } },
            { terms: { subject_slug: ["computing"] } },
            { terms: { type: ["lesson"] } },
            { terms: { key_stage_slug: ["1", "2", "3", "4"] } },
          ],
          minimum_should_match: 1,
        },
      },
      highlight: {
        number_of_fragments: 0,
        pre_tags: ["<b>"],
        post_tags: ["</b>"],
        fields: { topic_title: {}, theme_title: {}, lesson_description: {} },
      },
    });
  });

  it("handles examBoard filters", () => {
    const elasticQuery = constructElasticQuery(
      createSearchQuery({
        term: "macbeth",
        keyStages: ["ks4"],
        subjects: ["english"],
        examBoards: ["aqa"],
      }),
    );
    expect(elasticQuery).toEqual({
      from: 0,
      size: 100,
      query: {
        bool: {
          should: [
            {
              multi_match: {
                query: "macbeth",
                type: "phrase",
                analyzer: "stop",
                fields: ["title^10", "*_title^6", "lesson_description^3"],
              },
            },
            {
              multi_match: {
                query: "macbeth",
                fields: ["*"],
                type: "most_fields",
                analyzer: "stop",
                fuzziness: "AUTO:4,7",
                prefix_length: 1,
              },
            },
          ],
          filter: [
            { term: { expired: false } },
            { term: { is_specialist: false } },
            { terms: { key_stage_slug: ["4"] } },
            { terms: { subject_slug: ["english"] } },
            { terms: { type: ["lesson", "unit"] } },
            { terms: { examboard_slug: ["aqa"] } },
          ],
          minimum_should_match: 1,
        },
      },
      highlight: {
        number_of_fragments: 0,
        pre_tags: ["<b>"],
        post_tags: ["</b>"],
        fields: { topic_title: {}, theme_title: {}, lesson_description: {} },
      },
    });
  });
});
