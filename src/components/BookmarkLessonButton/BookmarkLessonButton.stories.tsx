import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import MockedAuthProvider, {
  loggedInAuthProviderProps,
} from "../../__tests__/__helpers__/MockedAuthProvider";
import { BookmarksProvider } from "../../hooks/useBookmarks";
import MockedApolloProvider from "../../__tests__/__helpers__/MockedApolloProvider";

import BookmarkLessonButton from ".";

export default {
  title: "Components/BookmarkLessonButton",
  component: BookmarkLessonButton,
  argTypes: {
    argTypes: { onClick: { action: "clicked" } },
    lessonId: {
      defaultValue: "123",
    },
  },
} as ComponentMeta<typeof BookmarkLessonButton>;

const Template: ComponentStory<typeof BookmarkLessonButton> = (args) => (
  <div>
    <div>
      <h1>BookmarkLessonButton</h1>

      <MockedAuthProvider {...loggedInAuthProviderProps}>
        <MockedApolloProvider>
          <BookmarksProvider>
            <BookmarkLessonButton {...args} />
          </BookmarksProvider>
        </MockedApolloProvider>
      </MockedAuthProvider>
    </div>
  </div>
);

export const BookmarkLessonButtonExample = Template.bind({});
