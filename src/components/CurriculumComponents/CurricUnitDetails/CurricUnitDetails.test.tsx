import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/react";

import CurricUnitDetails from "./CurricUnitDetails";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { createUnit } from "@/fixtures/curriculum/unit";

const testCurricUnitDetails = {
  unit: createUnit({
    threads: [{ title: "test thread", slug: "test-thread", order: 1 }],
    lessons: [{ title: "test lesson", slug: "test-lesson" }],
    connection_prior_unit_description: "test prior unit description",
    connection_future_unit_description: "test future unit description",
    connection_prior_unit_title: "test prior unit title",
    connection_future_unit_title: "test future unit title",
    prior_knowledge_requirements: [
      "prior knowledge requirements 1",
      "prior knowledge requirements 2",
    ],
    cycle: "1",
    why_this_why_now: "test why this why now",
    description: "test description",
  }),
  handleUnitOverviewExploredAnalytics: () => jest.fn(),
  isUnitDescriptionEnabled: false,
};

describe("CurricUnitDetails component", () => {
  test("it should render the threads", () => {
    const { getByText, getAllByTestId } = renderWithTheme(
      <CurricUnitDetails {...testCurricUnitDetails} />,
    );

    const thread = getByText("test thread");

    expect(getAllByTestId("thread-tag")).toHaveLength(1);
    expect(thread).toBeInTheDocument();
  });

  test("it should render the correct number of lessons count", () => {
    const { getByText } = renderWithTheme(
      <CurricUnitDetails {...testCurricUnitDetails} />,
    );

    const numberOfLessons = getByText("1 lesson");
    expect(numberOfLessons).toBeInTheDocument();
  });

  describe("accordion functionality on component", () => {
    test("it should render all accordion components (cycle 1)", () => {
      const { getAllByTestId, getByText } = renderWithTheme(
        <CurricUnitDetails {...testCurricUnitDetails} />,
      );

      expect(getAllByTestId("accordion-component")).toHaveLength(4);
      expect(getByText("Lessons in unit")).toBeInTheDocument();
      expect(getByText("Prior knowledge requirements")).toBeInTheDocument();
      expect(getByText("Previous unit description")).toBeInTheDocument();
      expect(getByText("Following unit description")).toBeInTheDocument();
    });

    test("it should render all accordion components (cycle 2)", () => {
      const { getAllByTestId, getByText } = renderWithTheme(
        <CurricUnitDetails
          {...testCurricUnitDetails}
          isUnitDescriptionEnabled={true}
        />,
      );

      expect(getAllByTestId("accordion-component")).toHaveLength(3);
      expect(getByText("Lessons in unit")).toBeInTheDocument();
      expect(getByText("Description")).toBeInTheDocument();
      expect(getByText("Why this why now")).toBeInTheDocument();
      expect(getByText("Prior knowledge requirements")).toBeInTheDocument();
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

        expect(getByText("test lesson")).not.toBeVisible();

        await userEvent.click(button);

        expect(getByTestId("lesson-title-list")).toBeVisible();
        expect(getByText("test lesson")).toBeVisible();
      } else {
        throw new Error("Accordion not found");
      }
    });
  });
});
