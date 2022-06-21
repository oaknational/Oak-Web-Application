import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import MockedAuthProvider, {
  loggedInAuthProviderProps,
} from "../../__tests__/__helpers__/MockedAuthProvider";
import { BookmarksProvider } from "../../context/Bookmarks";
import MockedApolloProvider from "../../__tests__/__helpers__/MockedApolloProvider";

import Component from ".";

export default {
  title: "Buttons/Bookmark Lesson Button",
  component: Component,
  argTypes: {
    argTypes: { onClick: { action: "clicked" } },
    lessonId: {
      defaultValue: "123",
    },
  },
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

export const BookmarkLessonButton = Template.bind({});
