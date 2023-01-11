type ConstructQueryParams = {
  term: string;
  keyStages: Set<string>;
};

const constructElasticQuery = (query: ConstructQueryParams) => {
  const { term, keyStages } = query;
  const filter =
    keyStages.size > 0
      ? {
          terms: {
            key_stage_slug: Array.from(keyStages),
          },
        }
      : null;

  return {
    from: 0, // index first result shown
    size: 40, // how many per page
    query: {
      bool: {
        // search twice with an OR
        should: [
          {
            // exact matches in titles and intro text first
            // boosting titles highest
            multi_match: {
              query: term,
              type: "phrase",
              // boost title highest, then other titles, then intro text
              fields: ["title^10", "*_title^6", "lesson_description^3"],
            },
          },
          // then search everything with fuzzy
          {
            multi_match: {
              query: term,
              fields: ["*"],
              type: "most_fields",
              /* Search terms <=4 characters have to be an exact match
                  terms >4 and <7 can have 1 error >=7 can have 2 errors */
              fuzziness: "AUTO:4,7",
              // First character of search term has to be an exact match
              prefix_length: 1,
            },
          },
        ],
        // keystage filter
        filter,
        /* if this is not set in a "should" any filtered content will appear
          not just those in the multi-matches above */
        minimum_should_match: 1,
      },
    },
  };
};

export default constructElasticQuery;
