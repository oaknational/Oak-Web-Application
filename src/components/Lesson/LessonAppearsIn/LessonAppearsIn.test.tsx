import { LessonAppearsIn } from "./LessonAppearsIn";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("LessonAppearsIn", () => {
  it("renderes the correct headings with correct tags", () => {
    const { getByRole } = renderWithTheme(
      <LessonAppearsIn
        headingTag="h2"
        subjects={[
          {
            subjectTitle: "Maths",
            subjectSlug: "maths",
            units: [
              {
                unitTitle: "Algebra",
                unitSlug: "algebra",
                examBoards: [
                  {
                    subjectTitle: "Maths",
                    subjectSlug: "maths",
                    tiers: [
                      {
                        programmeSlug: "gcse-maths",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ]}
      />,
    );

    expect(
      getByRole("heading", { name: "Lesson appears in" }),
    ).toHaveTextContent("Lesson appears in");
    expect(
      getByRole("heading", { name: "Unit Maths / Algebra" }),
    ).toHaveTextContent("Algebra");
  });
});
