import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { SearchProvider } from "../../context/Search/SearchContext";

import Component from "./SearchResults";

export default {
  title: "Form Fields/Search",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <SearchProvider>
    <Component {...args} />
  </SearchProvider>
);

export const SearchResults = Template.bind({});

SearchResults.args = {
  hits: [
    {
      _source: {
        id: 4097,
        type: "lesson",
        slug: "number-systems-binary-the-language-of-computers-68tkee",
        title: "Number systems: Binary - the language of computers",
        lesson_description:
          "In this lesson, we will be exploring the binary code and its use in computing.",
        topic_title: "Different number systems",
        theme_title: "",
        topic_slug: "different-number-systems-77bd",
        subject_title: "Maths",
        subject_slug: "maths",
        key_stage_title: "Key Stage 3",
        key_stage_slug: "key-stage-3",
        year_title: "Year 7",
        year_slug: "year-7",
        is_sensitive: false,
        is_specialist: null,
      },
    },
    {
      _source: {
        id: 4097,
        type: "lesson",
        slug: "number-systems-binary-the-language-of-computers-68tkee",
        title: "Number systems: Binary - the language of computers",
        lesson_description:
          "In this lesson, we will be exploring the binary code and its use in computing.",
        topic_title: "Different number systems",
        theme_title: "",
        topic_slug: "different-number-systems-77bd",
        subject_title: "Maths",
        subject_slug: "maths",
        key_stage_title: "Key Stage 3",
        key_stage_slug: "key-stage-3",
        year_title: "Year 7",
        year_slug: "year-7",
        is_sensitive: false,
        is_specialist: null,
      },
    },
  ],
};
