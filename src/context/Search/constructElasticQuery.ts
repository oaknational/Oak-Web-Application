import errorReporter from "../../common-lib/error-reporter";
import truthy from "../../utils/truthy";

import { SearchQuery } from "./useSearch";

type ConstructQueryParams = SearchQuery;

const constructElasticQuery = (query: ConstructQueryParams) => {
  const { term, keyStages = [], subjects = [] } = query;
  const keyStageFilter =
    keyStages.length > 0
      ? {
          terms: {
            key_stage_slug: keyStages
              .map((slug) => {
                switch (slug.toLowerCase()) {
                  case "ks1":
                    return "1";
                  case "ks2":
                    return "2";
                  case "ks3":
                    return "3";
                  case "ks4":
                    return "4";
                  default: {
                    const error = new Error(
                      "Key-stage slug could not be mapped to elastic query"
                    );
                    errorReporter("constructElasticQuery")(error, {
                      severity: "warning",
                      query,
                    });
                  }
                }
              })
              .filter(truthy),
          },
        }
      : {
          terms: {
            key_stage_slug: ["1", "2", "3", "4"],
          },
        };
  const subjectFilter = () => {
    if (subjects.length > 0) {
      return {
        terms: {
          subject_slug: subjects.map((slug) => slug),
        },
      };
    } else {
      return {
        terms: {
          key_stage_slug: ["1", "2", "3", "4"],
        },
      };
    }
  };

  const highlight = {
    number_of_fragments: 0,
    pre_tags: ["<b>"],
    post_tags: ["</b>"],
    fields: {
      topic_title: {},
      theme_title: {},
      lesson_description: {},
    },
  };

  const result = {
    from: 0, // index first result shown
    size: 10000, // how many per page
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
              analyzer: "stop",
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
          {
            term: {
              expired: false,
            },
          },
          {
            term: {
              is_specialist: false,
            },
          },
          subjectFilter(),
          { ...keyStageFilter },
        ],
        /* if this is not set in a "should" any filtered content will appear
          not just those in the multi-matches above */
        minimum_should_match: 1,
      },
    },
    highlight,
  };
  return result;
};
export default constructElasticQuery;
