import truthy from "@/utils/truthy";

export type ConstructQueryParams = {
  term: string;
  keyStages?: string[];
  subjects?: string[];
  contentTypes?: ("unit" | "lesson")[];
  examBoards?: string[];
};

export const constructElasticQuery = (query: ConstructQueryParams) => {
  const {
    term,
    keyStages = [],
    subjects = [],
    contentTypes = [],
    examBoards = [],
  } = query;

  const keyStageFilters = () => {
    if (keyStages.length === 0) {
      return null;
    }
    return {
      terms: {
        keyStageSlug: keyStages,
      },
    };
  };

  const subjectFilters = () => {
    if (subjects.length === 0) {
      return null;
    }
    return {
      terms: {
        subjectSlug: subjects,
      },
    };
  };

  const contentTypeFilters = () => {
    if (contentTypes.length === 0) {
      return null;
    }
    return {
      terms: {
        type: contentTypes,
      },
    };
  };

  const examBoardsFilter = () => {
    if (examBoards.length === 0) {
      return null;
    } else {
      return {
        bool: {
          minimum_should_match: 1,
          should: [
            {
              terms: {
                examBoardSlug: examBoards,
              },
            },
            {
              terms: {
                "pathways.examBoardSlug": examBoards,
              },
            },
          ],
        },
      };
    }
  };
  const highlight = {
    number_of_fragments: 0,
    pre_tags: ["<b>"],
    post_tags: ["</b>"],
    fields: {
      pupil_lesson_outcome: {},
      // topic_title: {},
      // theme_title: {},
      // lesson_description: {},
    },
  };

  const body = {
    from: 0, // index first result shown
    size: 100, // how many results to fetch
    query: {
      bool: {
        // search multiple times with an OR
        should: [
          {
            // exact matches in titles and intro text first
            // boosting titles highest
            multi_match: {
              query: term,
              type: "phrase",
              analyzer: "stop",
              // boost title highest, then other titles, then intro text
              fields: [
                "lessonTitle^6",
                "unitTitle^6",
                "lessonDescription^3",
                "lessons.lessonTitle^3",
              ],
            },
          },
          // then search everything with fuzzy
          {
            multi_match: {
              query: term,
              fields: ["*"],
              type: "most_fields",
              analyzer: "stop",
              /* Search terms <=4 characters have to be an exact match
                    terms >4 and <7 can have 1 error >=7 can have 2 errors */
              fuzziness: "AUTO:4,7",
              // First character of search term has to be an exact match
              prefix_length: 1,
            },
          },
        ],
        // filter
        filter: [
          keyStageFilters(),
          subjectFilters(),
          contentTypeFilters(),
          examBoardsFilter(),
        ].filter(truthy),
        /* if this is not set in a "should" any filtered content will appear
            not just those in the multi-matches above */
        minimum_should_match: 1,
      },
    },
    highlight,
  };

  return body;
};
