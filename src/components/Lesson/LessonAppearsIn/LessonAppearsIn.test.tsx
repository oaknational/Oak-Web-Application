import { render } from "@testing-library/react";

import { LessonAppearsIn } from "./LessonAppearsIn";

describe("LessonAppearsIn", () => {
  it("renderes the correct headings with correct tags", () => {
    const { getByRole } = render(
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
    ).toHaveTextContent("Unit Maths / Algebra");
  });
});
