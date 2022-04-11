import { render } from "@testing-library/react";

import { SearchHit } from "../../pages/search";

import SearchResults from "./SearchResults";

const searchHits: SearchHit[] = [
  {
    _source: {
      id: 2957,
      is_sensitive: false,
      is_specialist: null,
      key_stage_slug: "key-stage-4",
      key_stage_title: "Key Stage 4",
      lesson_description:
        "In this lesson, we will look at Macbeth's transformation across the play before exploring how Shakespeare presents Macbeth as a tragic hero in Act 5, Scene 3.",
      slug: "the-tragedy-of-macbeth-cdjpac",
      subject_slug: "english",
      subject_title: "English",
      theme_title: "First Teaching",
      title: "The Tragedy of Macbeth",
      topic_slug: "macbeth-a8f1",
      topic_title: "Macbeth",
      type: "lesson",
      year_slug: "year-10",
      year_title: "Year 10",
    },
  },
];

it("renders search page unchanged", async () => {
  const { container } = render(<SearchResults hits={searchHits} />);
  expect(container).toMatchSnapshot();
});
