import renderWithProviders from "../../../../__tests__/__helpers__/renderWithProviders";

import LessonListItem from "./LessonListItem";

describe("Lesson List Item", () => {
  test("It shows lesson title", () => {
    const { getByRole } = renderWithProviders(
      <LessonListItem
        title={"Macbeth"}
        slug={"macbeth"}
        presentationCount={1}
        quizCount={2}
        subjectSlug={"english"}
        keyStageSlug={"4"}
        description={"Lorem ipsum"}
        unitSlug={"foo"}
        videoCount={1}
        worksheetCount={2}
      />
    );
    const listHeading = getByRole("heading", { level: 3 });

    expect(listHeading).toBeInTheDocument();
  });

  //   test("It shows the correct number of presentations", () => {
  //     const { getByText } = renderWithProviders(
  //       <LessonListItem
  //         title={"Macbeth"}
  //         slug={"macbeth"}
  //         presentationCount={1}
  //         quizCount={2}
  //         subjectSlug={"english"}
  //         keyStageSlug={"4"}
  //         description={"Lorem ipsum"}
  //         unitSlug={"foo"}
  //         videoCount={1}
  //         worksheetCount={2}
  //       />
  //     );

  //       expect(getByText("")).toBeInTheDocument();

  //       const listHeading = getByRole("heading", { level: 1 });

  //     expect(listHeading).toBeInTheDocument();
  //   });
  //   test("It shows the correct number of worksheets", () => {});
  //   test("It shows the correct number of videos", () => {});
  //   test("It shows the correct number of quizzes", () => {});

  //   test("It doesn't presentations if none", () => {});
  //   test("It doesn't worksheets if none", () => {});
  //   test("It doesn't videos if none", () => {});
  //   test("It doesn't quizzes if none", () => {});
});
