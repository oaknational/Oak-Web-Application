import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { BookmarksProvider } from "../../context/Bookmarks";
import MockedApolloProvider from "../../__tests__/__helpers__/MockedApolloProvider";
import MockedAuthProvider, {
  loggedInAuthProviderProps,
} from "../../__tests__/__helpers__/MockedAuthProvider";

import Component from "./LessonHeader";

export default {
  title: "Headers & Footers/Lesson Header",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <MockedAuthProvider {...loggedInAuthProviderProps}>
    <MockedApolloProvider>
      <BookmarksProvider>
        <Component {...args} />
      </BookmarksProvider>
    </MockedApolloProvider>
  </MockedAuthProvider>
);

export const LessonHeader = Template.bind({});
