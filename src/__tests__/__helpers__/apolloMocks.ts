import {
  LessonsBySlugDocument,
  BookmarkedLessonsDocument,
  BookmarkedLessonAddDocument,
  BookmarkedLessonRemoveDocument,
} from "../../browser-lib/graphql/generated/apollo";

const testLesson = {
  id: 1,
  slug: "physics-only-review-chj3cd",
  title: "Physics only review",
};
const testBookmark = {
  lesson: testLesson,
  created_at: new Date().toISOString(),
};
const apolloMocks = [
  {
    request: {
      query: LessonsBySlugDocument,
      variables: { slug: "physics-only-review-chj3cd" },
    },
    result: {
      data: {
        lesson: [testLesson],
      },
    },
  },
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
