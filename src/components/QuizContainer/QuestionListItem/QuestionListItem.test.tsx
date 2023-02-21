import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";
import teachersLessonOverviewFixture from "../../../node-lib/curriculum-api/fixtures/teachersLessonOverview.fixture";

import QuestionListItem, { QuestionListItemProps } from ".";

const testProps = teachersLessonOverviewFixture()
  .introQuiz[0] as QuestionListItemProps;

describe("QuestionListItem", () => {
  it("renders the correct heading tag", () => {
    const { getByTestId } = renderWithTheme(
      <QuestionListItem {...testProps} />
    );
    const questionItemTitle = getByTestId("title-div");

    expect(questionItemTitle).toHaveTextContent("what is a question");
  });

  it("renders the question number", () => {
    const { getByText } = renderWithTheme(<QuestionListItem {...testProps} />);
    expect(getByText("Q1.")).toBeInTheDocument();
  });

  it("renders the choices", () => {
    const { getByText } = renderWithTheme(<QuestionListItem {...testProps} />);
    testProps.choices.forEach((choice) => {
      expect(getByText(choice)).toBeInTheDocument();
    });
  });

  it("renders the provided image", () => {
    const { getAllByRole } = renderWithTheme(
      <QuestionListItem {...testProps} />
    );

    const images = getAllByRole("img");

    expect(images.length).toEqual(3);
  });
});
