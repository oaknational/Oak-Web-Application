import {
  BookmarkedLessonsDocument,
  BookmarkedLessonAddDocument,
  BookmarkedLessonRemoveDocument,
} from "../../browser-lib/graphql/generated/apollo";

export const testLesson = {
  id: 1,
  slug: "physics-only-review-chj3cd",
  title: "Physics only review",
};
export const testBookmark = {
  lesson: testLesson,
  created_at: new Date().toISOString(),
};
const apolloMocks = [
  {
    request: {
      query: BookmarkedLessonsDocument,
    },
    result: {
      data: {
        bookmarked_lesson: [testBookmark],
      },
    },
  },
  {
    request: {
      query: BookmarkedLessonAddDocument,
      variables: { lessonId: 1 },
    },
    result: {
      data: {
        insert_bookmarked_lesson_one: testBookmark,
      },
    },
  },
  {
    request: {
      query: BookmarkedLessonRemoveDocument,
    },
    result: {
      data: {
        delete_bookmarked_lesson_by_pk: {},
      },
    },
  },
];

export default apolloMocks;
