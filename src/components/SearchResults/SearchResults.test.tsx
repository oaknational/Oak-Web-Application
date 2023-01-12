import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import { RESULTS_PER_PAGE } from "./SearchResults";

import SearchResults from ".";

describe("components/ Search Results", () => {
  const searchResult = {
    _source: {
      id: 4660,
      type: "lesson",
      slug: "computer-specifications-74r32c",
      title: "Computer specifications",
      lesson_description:
        "In this lesson, we will learn how to evaluate a computer based on its specifications. We will discover the factors that limit a CPU's performance: clock speed, cache, and the number of cores. The end of this lesson will involve us choosing the right computer for a given task.",
      topic_title: "Computer Systems",
      theme_title: "Computer Science",
      topic_slug: "computer-systems-e17a",
      subject_title: "Computing",
      subject_slug: "computing",
      key_stage_title: "Key Stage 4",
      key_stage_slug: "key-stage-4",
      year_title: "Year 10",
      year_slug: "year-10",
      is_sensitive: false,
      is_specialist: null,
    },
  };

  test("it renders the search results", () => {
    const { getByRole } = renderWithProviders(
      <SearchResults hits={[searchResult]} />
    );

    const searchElement = getByRole("listitem");

    expect(searchElement).toBeInTheDocument();
  });

  test("it renders pagination if there are more results than set in RESULTS_PER_PAGE", () => {
    const hits = [];

    for (let i = 0; i <= RESULTS_PER_PAGE; i++) {
      hits.push({ id: i, ...searchResult });
    }

    const { getByRole } = renderWithProviders(<SearchResults hits={hits} />);

    const pagination = getByRole("navigation");

    expect(pagination).toBeInTheDocument();
  });
});
