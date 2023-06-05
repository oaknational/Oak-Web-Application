import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";
import lessonOverviewFixture from "../../../node-lib/curriculum-api/fixtures/lessonOverview.fixture";

import { CorrectAnswer } from "./QuestionListItem";

import QuestionListItem, { QuestionListItemProps } from ".";

const testProps = lessonOverviewFixture().introQuiz[0] as QuestionListItemProps;

describe("CorrectAnswer", () => {
  const mockProps = {
    choice: "A",
    type: "order",
    index: 0,
    answer: ["A", "B", "C"],
  };

  it("renders without crashing", () => {
    renderWithTheme(<CorrectAnswer {...mockProps} />);
  });

  it("renders the correct choice for non-match type", () => {
    const { getByText } = renderWithTheme(<CorrectAnswer {...mockProps} />);
    expect(getByText("- A")).toBeInTheDocument();
  });

  it("renders the correct index for order type", () => {
    const { getByText } = renderWithTheme(<CorrectAnswer {...mockProps} />);
    expect(getByText("1")).toBeInTheDocument();
  });

  it("renders the correct choice and answer for match type", () => {
    const { getByText } = renderWithTheme(
      <CorrectAnswer
        choice="A"
        type="match"
        index={0}
        answer={["X", "Y", "Z"]}
      />
    );
    expect(getByText("- X")).toBeInTheDocument();
    expect(getByText("A")).toBeInTheDocument();
  });
  it("renders empty string for match type when there is no answer ", () => {
    const { getByTestId } = renderWithTheme(
      <CorrectAnswer choice="A" type="match" index={0} />
    );
    expect(getByTestId("answer")).toHaveTextContent("");
  });
});

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
      expect(getByText(choice.choice)).toBeInTheDocument();
    });
  });

  it("renders the provided image", () => {
    const { getAllByRole } = renderWithTheme(
      <QuestionListItem {...testProps} />
    );

    const images = getAllByRole("img");

    expect(images.length).toEqual(2);
  });

  it("renders when image is an object", () => {
    testProps.images = [
      {
        title: "image title",
        images: [
          "https://lh4.googleusercontent.com/VDXakctFcw9Y4_46OEihGuTdkcDmcvgYVM45Qz6VdqChgD4xwnZ72-uBE8X1fDo4Pd11T2Sgzo_hE4JMZVMeGKuiRcNmHa3tGfy8dgtRitByWb8hKN2HKkQiy8oSyKk8=w596",
        ],
      },
    ];
    const { getAllByRole } = renderWithTheme(
      <QuestionListItem {...testProps} />
    );

    const images = getAllByRole("img");

    expect(images.length).toEqual(2);
  });
  it("renders correctly without choice images ", () => {
    const { getAllByRole } = renderWithTheme(
      <QuestionListItem {...testProps} />
    );

    const images = getAllByRole("img");

    expect(images.length).toEqual(2);
  });
  it("renders correctly when there are no choices", () => {
    testProps.choices = [];
    const { getByTestId } = renderWithTheme(
      <QuestionListItem {...testProps} />
    );
    const questionItemTitle = getByTestId("title-div");

    expect(questionItemTitle).toHaveTextContent("what is a question");
  });
  it("renders title without markdown **text**", () => {
    testProps.choices = [];
    const { getByTestId } = renderWithTheme(
      <QuestionListItem
        {...{ ...testProps, title: "what is **a** question" }}
      />
    );
    const questionItemTitle = getByTestId("title-div");

    expect(questionItemTitle).toHaveTextContent("what is a question");
  });
  it("renders correctly where correct answer doesnt have an image and incorrect choice does have image", () => {
    testProps.choices = [
      {
        choice: "this one",
        image: null,
      },
      {
        choice: "that one",
        image:
          "https://lh6.googleusercontent.com/OjgbTYtK-NU8_lzFznF36BYjENk_zmTmfitGHQvwt4xZNqTGPX9D6lsyCcvv_JV2dCCxKKqSgffHuamqaOvg8t7K-8I5GnkFSY1EO3QboKWeFXJkAB76pnTXU9xH9okF=w287",
      },
    ];
    const { getByTestId } = renderWithTheme(
      <QuestionListItem {...testProps} />
    );
    const questionItemTitle = getByTestId("title-div");

    expect(questionItemTitle).toHaveTextContent("what is a question");
  });
  it("renders correctly where correct answer is an array", () => {
    testProps.answer = ["this one", "that one"];
    const { getByTestId } = renderWithTheme(
      <QuestionListItem {...testProps} />
    );
    const questionItemTitle = getByTestId("title-div");

    expect(questionItemTitle).toHaveTextContent("what is a question");
  });
});
