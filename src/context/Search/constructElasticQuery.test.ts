import constructElasticQuery from "./constructElasticQuery";
import { createSearchQuery } from "./useSearch";

describe("Search/constructElasticQuery", () => {
  test("handles search term (without key stages)", () => {
    const elasticQuery = constructElasticQuery(
      createSearchQuery({ term: "writing" })
    );
    expect(elasticQuery).toEqual({
      from: 0,
      size: 10000,
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
  test("handles key stages", () => {
    const elasticQuery = constructElasticQuery(
      createSearchQuery({ term: "macbeth", keyStages: ["ks3"] })
    );

    expect(elasticQuery).toEqual({
      from: 0,
      size: 10000,
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
