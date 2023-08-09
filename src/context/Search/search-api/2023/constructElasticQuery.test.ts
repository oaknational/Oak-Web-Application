import { createSearchQuery } from "../../useSearch";

import { constructElasticQuery } from "./constructElasticQuery";

describe("Search/2023/constructElasticQuery", () => {
  test("handles search term (without key stages)", () => {
    const elasticQuery = constructElasticQuery(
      createSearchQuery({ term: "writing" })
    );

    console.log(JSON.stringify(elasticQuery));

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
                fields: [
                  "lessonTitle^6",
                  "unitTitle^6",
                  "lessonDescription^3",
                  "lessons.lessonTitle^3",
                ],
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
          filter: [],
          minimum_should_match: 1,
        },
      },
      highlight: {
        number_of_fragments: 0,
        pre_tags: ["<b>"],
        post_tags: ["</b>"],
        fields: {},
      },
    });
  });
  test("handles key stages", () => {
    const elasticQuery = constructElasticQuery(
      createSearchQuery({ term: "macbeth", keyStages: ["ks3"] })
    );

    console.log(elasticQuery);

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
                fields: [
                  "lessonTitle^6",
                  "unitTitle^6",
                  "lessonDescription^3",
                  "lessons.lessonTitle^3",
                ],
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
            {
              terms: {
                keyStageSlug: ["ks3"],
              },
            },
          ],
          minimum_should_match: 1,
        },
      },
      highlight: {
        number_of_fragments: 0,
        pre_tags: ["<b>"],
        post_tags: ["</b>"],
        fields: {},
      },
    });
  });
  test("handles subject filters", () => {
    const elasticQuery = constructElasticQuery(
      createSearchQuery({
        term: "macbeth",
        keyStages: ["ks3"],
        subjects: ["computing"],
      })
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
                fields: [
                  "lessonTitle^6",
                  "unitTitle^6",
                  "lessonDescription^3",
                  "lessons.lessonTitle^3",
                ],
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
            { terms: { keyStageSlug: ["ks3"] } },
            { terms: { subjectSlug: ["computing"] } },
          ],
          minimum_should_match: 1,
        },
      },
      highlight: {
        number_of_fragments: 0,
        pre_tags: ["<b>"],
        post_tags: ["</b>"],
        fields: {},
      },
    });
  });

  test("handles type filters", () => {
    const elasticQuery = constructElasticQuery(
      createSearchQuery({
        term: "macbeth",
        keyStages: ["ks3"],
        subjects: ["computing"],
        contentTypes: ["lesson"],
      })
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
                fields: [
                  "lessonTitle^6",
                  "unitTitle^6",
                  "lessonDescription^3",
                  "lessons.lessonTitle^3",
                ],
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
            { terms: { keyStageSlug: ["ks3"] } },
            { terms: { subjectSlug: ["computing"] } },
            { terms: { type: ["lesson"] } },
          ],
          minimum_should_match: 1,
        },
      },
      highlight: {
        number_of_fragments: 0,
        pre_tags: ["<b>"],
        post_tags: ["</b>"],
        fields: {},
      },
    });
  });
});
