import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/react";

import { CurriculumUnitDetails } from "./CurriculumUnitDetails";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const testCurriculumUnitDetails = {
  unitTitle: "Test unit title",
  threads: [{ title: "test thread", slug: "test-thread", order: 1 }],
  numberOfLessons: 1,
  lessons: [{ title: "test lesson", slug: "test-lesson" }],
  previousUnitDescription: "test previous unit description",
  futureUnitDescription: "test future unit description",
};

describe("CurriculumUnitDetails component", () => {
  test("it should render the threads", () => {
    const { getByText, getAllByTestId } = renderWithTheme(
      <CurriculumUnitDetails {...testCurriculumUnitDetails} />,
    );

    const thread = getByText("test thread");

    expect(getAllByTestId("thread-tag")).toHaveLength(1);
    expect(thread).toBeInTheDocument();
  });

  test("it should render the correct number of lessons count", () => {
    const { getByText } = renderWithTheme(
      <CurriculumUnitDetails {...testCurriculumUnitDetails} />,
    );

    const numberOfLessons = getByText("1 lesson");
    expect(numberOfLessons).toBeInTheDocument();
  });

  describe("accordion functionality on component", () => {
    test("it should render all accordion components", () => {
      const { getAllByTestId, getByText } = renderWithTheme(
        <CurriculumUnitDetails {...testCurriculumUnitDetails} />,
      );

      expect(getAllByTestId("accordion-component")).toHaveLength(1);
      expect(getByText("Lessons in unit")).toBeInTheDocument();
      // expect(getByText("Previous unit description")).toBeInTheDocument();
      // expect(getByText("Following unit description")).toBeInTheDocument();
    });

    test("when expanding lesson accordion it should render correct lessons list", async () => {
      const { getAllByTestId, getByText, getByTestId } = renderWithTheme(
        <CurriculumUnitDetails {...testCurriculumUnitDetails} />,
      );

      const lessonAccordion = getAllByTestId("accordion-component")[0];

      if (lessonAccordion) {
        const button = within(lessonAccordion).getByTestId(
          "expand-accordian-button",
        );

        expect(getByText("test lesson")).not.toBeVisible();

        await userEvent.click(button);

        expect(getByTestId("lesson-title-list")).toBeVisible();
        expect(getByText("test lesson")).toBeVisible();
      } else {
        throw new Error("Accordion not found");
      }
    });

    // test("when expanding previous unit description accordion it should render correct previous description", async () => {
    //   const { getAllByTestId, getByText, getByTestId } = renderWithTheme(
    //     <CurriculumUnitDetails {...testCurriculumUnitDetails} />,
    //   );

    //   const previousDescAccordion = getAllByTestId("accordion-component")[1];

    //   if (previousDescAccordion) {
    //     const button = within(previousDescAccordion).getByTestId(
    //       "expand-accordian-button",
    //     );

    //     expect(getByText("test previous unit description")).not.toBeVisible();

    //     await userEvent.click(button);

    //     expect(getByTestId("previous-unit-text")).toBeVisible();
    //     expect(getByText("test previous unit description")).toBeVisible();
    //   } else {
    //     throw new Error("Accordion not found");
    //   }
    // });

    // test("when expanding future unit description accordion it should render correct future description", async () => {
    //   const { getAllByTestId, getByText, getByTestId } = renderWithTheme(
    //     <CurriculumUnitDetails {...testCurriculumUnitDetails} />,
    //   );

    //   const previousDescAccordion = getAllByTestId("accordion-component")[2];

    //   if (previousDescAccordion) {
    //     const button = within(previousDescAccordion).getByTestId(
    //       "expand-accordian-button",
    //     );

    //     expect(getByText("test future unit description")).not.toBeVisible();

    //     await userEvent.click(button);

    //     expect(getByTestId("future-unit-text")).toBeVisible();
    //     expect(getByText("test future unit description")).toBeVisible();
    //   } else {
    //     throw new Error("Accordion not found");
    //   }
    // });
  });
});
