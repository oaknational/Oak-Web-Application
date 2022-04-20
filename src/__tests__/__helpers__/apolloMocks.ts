import {
  BookmarkedLessonsDocument,
  BookmarkedLessonAddDocument,
  BookmarkedLessonRemoveDocument,
} from "../../browser-lib/graphql/generated/apollo";

export const testLessons = [
  {
    id: 1,
    slug: "physics-only-review-chj3cd",
    title: "Physics only review",
  },
  {
    id: 2,
    slug: "macbeth-chj3cd",
    title: "Macbeth",
  },
];

export const testBookmarks = testLessons.map((lesson) => ({
  lesson,
  created_at: new Date().toISOString(),
}));

export const bookmarkToAdd = testBookmarks[0];
export const bookmarkToRemove = testBookmarks[1];

const apolloMocks = [
  {
    request: {
      query: BookmarkedLessonsDocument,
    },
    result: {
      data: {
        bookmarked_lesson: testBookmarks,
      },
    },
  },
  {
    request: {
      query: BookmarkedLessonAddDocument,
      variables: { lessonId: bookmarkToAdd?.lesson.id },
    },
    result: {
      data: {
        insert_bookmarked_lesson_one: testBookmarks[0],
      },
    },
  },
  {
    request: {
      query: BookmarkedLessonRemoveDocument,
      variables: { lessonId: bookmarkToAdd?.lesson.id, userId: 123 },
    },
    result: {
      data: {
        delete_bookmarked_lesson_by_pk: {
          lesson_id: bookmarkToAdd?.lesson.id,
          user_id: 123,
        },
      },
    },
  },
];

export default apolloMocks;
