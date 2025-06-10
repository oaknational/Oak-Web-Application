import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/react";

import CurricUnitDetails from "./CurricUnitDetails";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { createUnit } from "@/fixtures/curriculum/unit";
import { createUnitOption } from "@/fixtures/curriculum/unitOption";
import { createLesson } from "@/fixtures/curriculum/lesson";
import { createThread } from "@/fixtures/curriculum/thread";

const testCurricUnitDetails = {
  unit: createUnit({
    threads: [createThread({ slug: "THREAD_1" })],
    lessons: [createLesson({ slug: "LESSON_1" })],
    connection_prior_unit_description: "PREVIOUS_UNIT_DESCRIPTION",
    connection_future_unit_description: "FUTURE_UNIT_DESCRIPTION",
    connection_prior_unit_title: "PREVIOUS_UNIT_TITLE",
    connection_future_unit_title: "FUTURE_UNIT_TITLE",
    cycle: "1",
    why_this_why_now: "WHY_THIS_WHY_NOW",
    description: "DESCRIPTION",
  }),
  handleUnitOverviewExploredAnalytics: () => jest.fn(),
  isUnitDescriptionEnabled: false,
};

describe("CurricUnitDetails component", () => {
  test("it should render the threads", () => {
    const { getAllByTestId } = renderWithTheme(
      <CurricUnitDetails {...testCurricUnitDetails} />,
    );

    const tagEls = getAllByTestId("ac_threads_tag");
    expect(tagEls).toHaveLength(1);
    expect(tagEls[0]).toBeInTheDocument();
    expect(tagEls[0]).toHaveTextContent("THREAD_1");
  });

  test("it should render the correct number of lessons count", () => {
    const { getByText, getAllByTestId } = renderWithTheme(
      <CurricUnitDetails {...testCurricUnitDetails} />,
    );

    const numberOfLessons = getByText("1 lesson");
    expect(numberOfLessons).toBeInTheDocument();

    const lessonElements = getAllByTestId("ac_lessons_lesson");
    expect(lessonElements.length).toEqual(1);
    expect(lessonElements[0]).toHaveTextContent("LESSON_1");
  });

  test("it should render the correct number of lessons count (with unit options)", () => {
    const { getByText, getAllByTestId } = renderWithTheme(
      <CurricUnitDetails
        {...testCurricUnitDetails}
        unitOption={createUnitOption({
          title: "TEST_UNIT_OPTION",
          lessons: [
            createLesson({ slug: "OPTION_LESSON_1" }),
            createLesson({ slug: "OPTION_LESSON_2" }),
            createLesson({ slug: "OPTION_LESSON_3" }),
          ],
        })}
      />,
    );

    const numberOfLessons = getByText("3 lessons");
    expect(numberOfLessons).toBeInTheDocument();
    const lessonElements = getAllByTestId("ac_lessons_lesson");
    expect(lessonElements.length).toEqual(3);
    expect(lessonElements[0]).toHaveTextContent("OPTION_LESSON_1");
    expect(lessonElements[1]).toHaveTextContent("OPTION_LESSON_2");
    expect(lessonElements[2]).toHaveTextContent("OPTION_LESSON_3");
  });

  describe("accordion functionality on component", () => {
    test("it should render all accordion components (cycle 1)", () => {
      const { getAllByTestId, getByTestId, getByText } = renderWithTheme(
        <CurricUnitDetails {...testCurricUnitDetails} />,
      );

      expect(getAllByTestId("accordion-component")).toHaveLength(3);
      expect(getByText("Lessons in unit")).toBeInTheDocument();

      expect(getByTestId("ac_prior_title")).toHaveTextContent(
        "PREVIOUS_UNIT_TITLE",
      );
      expect(getByTestId("ac_future_title")).toHaveTextContent(
        "FUTURE_UNIT_TITLE",
      );
    });

    test("it should render all accordion components (cycle 1, with unit-option)", () => {
      const { getByTestId } = renderWithTheme(
        <CurricUnitDetails
          {...testCurricUnitDetails}
          unitOption={createUnitOption({
            title: "TEST_UNIT_OPTION",
            lessons: [
              createLesson({ slug: "OPTION_LESSON_1" }),
              createLesson({ slug: "OPTION_LESSON_2" }),
              createLesson({ slug: "OPTION_LESSON_3" }),
            ],
            connection_prior_unit_title: "OPTION_PREVIOUS_UNIT_TITLE",
            connection_prior_unit_description:
              "OPTION_PREVIOUS_UNIT_DESCRIPTION",
            connection_future_unit_title: "OPTION_FUTURE_UNIT_TITLE",
            connection_future_unit_description:
              "OPTION_FUTURE_UNIT_DESCRIPTION",
          })}
        />,
      );

      expect(getByTestId("ac_prior_title")).toHaveTextContent(
        "OPTION_PREVIOUS_UNIT_TITLE",
      );
      expect(getByTestId("ac_future_title")).toHaveTextContent(
        "OPTION_FUTURE_UNIT_TITLE",
      );
    });

    test("it should render all accordion components (cycle 2)", () => {
      const { getAllByTestId, getByTestId } = renderWithTheme(
        <CurricUnitDetails
          {...testCurricUnitDetails}
          isUnitDescriptionEnabled={true}
        />,
      );

      expect(getAllByTestId("accordion-component")).toHaveLength(2);
      expect(getByTestId("ac_description")).toHaveTextContent("DESCRIPTION");
      expect(getByTestId("ac_wtwn")).toHaveTextContent("WHY_THIS_WHY_NOW");
    });

    test("it should render all accordion components (cycle 2, unit-option)", () => {
      const { getByTestId } = renderWithTheme(
        <CurricUnitDetails
          {...testCurricUnitDetails}
          isUnitDescriptionEnabled={true}
          unitOption={createUnitOption({
            title: "TEST_UNIT_OPTION",
            lessons: [
              createLesson({ slug: "LESSON_1" }),
              createLesson({ slug: "LESSON_2" }),
              createLesson({ slug: "LESSON_3" }),
            ],
            description: "OPTION_DESCRIPTION",
            why_this_why_now: "OPTION_WHY_THIS_WHY_NOW",
          })}
        />,
      );

      expect(getByTestId("ac_description")).toHaveTextContent(
        "OPTION_DESCRIPTION",
      );
      expect(getByTestId("ac_wtwn")).toHaveTextContent(
        "OPTION_WHY_THIS_WHY_NOW",
      );
    });

    test("when expanding lesson accordion it should render correct lessons list", async () => {
      const { getAllByTestId, getByText, getByTestId } = renderWithTheme(
        <CurricUnitDetails {...testCurricUnitDetails} />,
      );

      const lessonAccordion = getAllByTestId("accordion-component")[0];

      if (lessonAccordion) {
        const button = within(lessonAccordion).getByTestId(
          "expand-accordian-button",
        );

        expect(getByText("LESSON_1")).not.toBeVisible();

        await userEvent.click(button);

        expect(getByTestId("lesson-title-list")).toBeVisible();
        expect(getByText("LESSON_1")).toBeVisible();
      } else {
        throw new Error("Accordion not found");
      }
    });
  });
});
