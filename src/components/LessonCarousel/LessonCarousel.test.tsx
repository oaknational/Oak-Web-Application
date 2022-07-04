import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";
import unit from "../../browser-lib/fixtures/unitLessons";

import LessonCarousel from ".";

describe("components/LessonCarousel", () => {
  test("renders the correct heading tag", () => {
    const { getByRole } = renderWithProviders(
      <LessonCarousel
        currentLesson={2}
        unit={unit}
        titleTag={"h2"}
        cardTitleTag={"h3"}
      />
    );
    const heading = getByRole("heading", { level: 2 });

    expect(heading).toHaveTextContent("More lessons from this unit");
  });
  test("renders the lesson card", () => {
    const { getByRole } = renderWithProviders(
      <LessonCarousel
        unit={[
          {
            title: "Historical Context: James I, Witchcraft and Regicide",
            slug: "/Historical",
            keyStage: "KS3",
            keyStageSlug: "/keystage-3",
            subject: "English",
            subjectSlug: "/english",
            topic: "Macbeth",
            topicSlug: "/macbeth",
            lessonNumber: 1,
          },
        ]}
        currentLesson={1}
        titleTag={"h2"}
        cardTitleTag={"h3"}
      />
    );
    const listHeading = getByRole("heading", { level: 3 });

    expect(listHeading).toBeInTheDocument();
  });
});
