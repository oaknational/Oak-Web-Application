import { screen, waitFor } from "@testing-library/react";

import LessonPage from "../../pages/lessons/[lessonSlug]";
import renderWithProviders from "../__helpers__/renderWithProviders";

const testLesson = { id: 1, title: "Physics only review", slug: "lesson-slug" };

const graphqlAllLessons = jest.fn(() => ({ lessons: [testLesson] }));
const graphqlLessonsBySlug = jest.fn(() => ({ lessons: [testLesson] }));

describe("pages/lessons/[lessonSlug].tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.mock("../../node-lib/graphql", () => ({
      __esModule: true,
      default: {
        allLessons: jest.fn(graphqlAllLessons),
        lessonsBySlug: jest.fn(graphqlLessonsBySlug),
      },
    }));
  });

  describe("LessonPage", () => {
    it("Renders lesson title ", async () => {
      renderWithProviders(<LessonPage lesson={testLesson} />);

      await waitFor(() => {
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
          testLesson.title
        );
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Should fetch all lessons", async () => {
      const { getStaticPaths } = await import(
        "../../pages/lessons/[lessonSlug]"
      );
      await getStaticPaths({});

      expect(graphqlAllLessons).toHaveBeenCalled();
    });
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct lesson", async () => {
      const { getStaticProps } = await import(
        "../../pages/lessons/[lessonSlug]"
      );
      await getStaticProps({ params: { lessonSlug: "some slug" } });

      expect(graphqlLessonsBySlug).toHaveBeenCalledWith({ slug: "some slug" });
    });
  });
});
