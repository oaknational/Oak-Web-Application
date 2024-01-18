import { createSearchQuery } from "../../useSearch";

import { constructElasticQuery } from "./constructElasticQuery";

describe("Search/2023/constructElasticQuery", () => {
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
        fields: { pupil_lesson_outcome: {} },
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
        fields: { pupil_lesson_outcome: {} },
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
        fields: { pupil_lesson_outcome: {} },
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
        fields: { pupil_lesson_outcome: {} },
      },
    });
  });

  it("handles examboard filters", () => {
    const elasticQuery = constructElasticQuery(
      createSearchQuery({
        term: "waves",
        keyStages: ["ks4"],
        subjects: ["physics"],
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
                query: "waves",
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
                query: "waves",
                fields: ["*"],
                type: "most_fields",
                analyzer: "stop",
                prefix_length: 1,
              },
            },
          ],
          filter: [
            { terms: { keyStageSlug: ["ks4"] } },
            { terms: { subjectSlug: ["physics"] } },
            {
              bool: {
                minimum_should_match: 1,
                should: [
                  {
                    terms: {
                      examBoardSlug: ["aqa"],
                    },
                  },
                  {
                    terms: {
                      "pathways.examBoardSlug": ["aqa"],
                    },
                  },
                ],
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
        fields: {
          pupil_lesson_outcome: {},
        },
      },
    });
  });
});
