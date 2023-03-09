import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./SearchResults";

export default {
  title: "Lists/Search Results",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SearchResults = Template.bind({});
SearchResults.args = {
  hits: [
    {
      _source: {
        id: 4178,
        type: "unit",
        slug: "computing-systems-158",
        title: "Computing systems",
        subject_title: "Computing",
        subject_slug: "computing",
        theme_title: "Computing",
        key_stage_title: "Key Stage 4",
        key_stage_slug: "key-stage-4",
        year_slug: "year-10",
        is_specialist: false,
        is_sensitive: false,
        expired: false,
      },
    },
    {
      _source: {
        id: 4097,
        type: "lesson",
        slug: "number-systems-binary-the-language-of-computers-68kee",
        title: "The language of computers",
        lesson_description:
          "In this lesson, we will be exploring the binary code and its use in computing.",
        topic_title: "Different number systems",
        theme_title: "",
        topic_slug: "different-number-systems-77bd",
        subject_title: "Computer systems",
        subject_slug: "computing",
        key_stage_title: "Key Stage 4",
        key_stage_slug: "key-stage-4",
        year_title: "Year 10",
        year_slug: "year-10",
        is_sensitive: false,
        is_specialist: null,
        expired: false,
      },
    },
  ],
};
