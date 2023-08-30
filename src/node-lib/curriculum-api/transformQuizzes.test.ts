import { transformQuiz } from "./transformQuizzes";
import { legacyQuizFixture } from "./fixtures/legacyQuiz.fixture";

describe("transformQuiz", () => {
  it("should return an empty array if no quizzes are provided", () => {
    const quizzes = transformQuiz([]);
    expect(quizzes).toEqual([]);
  });

  it("should transform the question stem text", () => {
    const legacyQuiz = legacyQuizFixture();
    const quizzes = transformQuiz(legacyQuiz);
    expect(quizzes).toHaveLength(legacyQuiz.length);
    // @ts-expect-error: above line guarantees that quizzes[0] exists
    expect(quizzes[0].questionStem).toContainEqual({
      type: "text",
      text: "what is a question",
    });
  });

  it("should transform the question stem image", () => {
    const legacyQuiz = legacyQuizFixture();
    const quizzes = transformQuiz(legacyQuiz);
    expect(quizzes).toHaveLength(legacyQuiz.length);

    // @ts-expect-error: above line guarantees that quizzes[0] exists
    expect(quizzes[0].questionStem).toHaveLength(2);

    // @ts-expect-error: above line guarantees that quizzes[1] exists
    expect(quizzes[0].questionStem[1].type).toEqual("image");

    // @ts-expect-error: above line guarantees that questionStem[1] exists
    expect(quizzes[0].questionStem[1].image_object).toBeDefined();

    // @ts-expect-error: above line guarantees that secure_url exists
    expect(quizzes[0].questionStem[1].image_object.secure_url).toEqual(
      "https://lh6.googleusercontent.com/OjgbTYtK-NU8_lzFznF36BYjENk_zmTmfitGHQvwt4xZNqTGPX9D6lsyCcvv_JV2dCCxKKqSgffHuamqaOvg8t7K-8I5GnkFSY1EO3QboKWeFXJkAB76pnTXU9xH9okF=w287"
    );
  });

  it("produces valid mcq text answers", () => {
    const legacyQuiz = legacyQuizFixture();
    const quizzes = transformQuiz(legacyQuiz);
    expect(quizzes).toHaveLength(legacyQuiz.length);
    // @ts-expect-error: above line guarantees that quizzes[0] exists
    expect(quizzes[0].answers["multiple-choice"]).toHaveLength(2);
    // @ts-expect-error: above line guarantees that quizzes[0].answers["multiple-choice"] exists
    expect(quizzes[0].answers["multiple-choice"]).toContainEqual({
      answer: [{ text: "that one", type: "text" }],
      answer_is_correct: false,
    });
  });

  it("produces valid mcq image answers", () => {
    const legacyQuiz = legacyQuizFixture();
    const quizzes = transformQuiz(legacyQuiz);
    expect(quizzes).toHaveLength(legacyQuiz.length);
    // @ts-expect-error: above line guarantees that quizzes[0] exists
    expect(quizzes[0].answers["multiple-choice"]).toHaveLength(2);
    // @ts-expect-error: above line guarantees that quizzes[0].answers["multiple-choice"] exists
    expect(quizzes[0].answers["multiple-choice"][1].answer).toHaveLength(2);
    // @ts-expect-error: above line guarantees that quizzes[0].answers["multiple-choice"].answer exists
    expect(quizzes[0].answers["multiple-choice"][1].answer[1]).toBeDefined();

    expect(
      // @ts-expect-error: above line guarantees that quizzes[0].answers["multiple-choice"].answer[0] exists
      quizzes[0].answers["multiple-choice"][1].answer[0].image_object
    ).toBeDefined();

    expect(
      // @ts-expect-error: above line guarantees that quizzes[0].answers["multiple-choice"].answer[0].image_object exists
      quizzes[0].answers["multiple-choice"][1].answer[0].image_object
        ?.secure_url
    ).toEqual(
      "https://lh6.googleusercontent.com/OjgbTYtK-NU8_lzFznF36BYjENk_zmTmfitGHQvwt4xZNqTGPX9D6lsyCcvv_JV2dCCxKKqSgffHuamqaOvg8t7K-8I5GnkFSY1EO3QboKWeFXJkAB76pnTXU9xH9okF=w287"
    );
  });

  it("annotates the correct answer for mcq", () => {
    const legacyQuiz = legacyQuizFixture();
    const quizzes = transformQuiz(legacyQuiz);
    expect(
      // @ts-expect-error: above line guarantees that quizzes[0].answers["multiple-choice"].answer[0].image_object exists
      quizzes[0].answers["multiple-choice"][1].answer_is_correct
    ).toEqual(true);
  });

  it("produces valid match answers", () => {
    const legacyQuiz = legacyQuizFixture();
    const quizzes = transformQuiz(legacyQuiz);
    // @ts-expect-error: previous tests guarantee that the path exists
    expect(quizzes[1].answers.match).toHaveLength(4);

    // @ts-expect-error: previous tests guarantee that the path exists
    quizzes[1].answers.match?.forEach((answer) => {
      expect(answer.correct_choice).toHaveLength(1);
      expect(answer.match_option).toHaveLength(1);
      // @ts-expect-error: previous tests guarantee that the path exists
      expect(answer.correct_choice[0].text).toEqual(
        // @ts-expect-error: previous tests guarantee that the path exists
        answer.match_option[0].text.toUpperCase()
      );
    });
  });

  it("produces valid order answers", () => {
    const legacyQuiz = legacyQuizFixture();
    const quizzes = transformQuiz(legacyQuiz);
    // @ts-expect-error: previous tests guarantee that the path exists
    expect(quizzes[2].answers.order).toHaveLength(4);

    // @ts-expect-error: previous tests guarantee that the path exists
    quizzes[2].answers.order.forEach((answer, i) => {
      expect(answer.answer).toHaveLength(1);
      expect(answer.correct_order).toEqual(i + 1);
    });
  });

  it("produces valid short answer answers", () => {
    const legacyQuiz = legacyQuizFixture();
    const quizzes = transformQuiz(legacyQuiz);

    // @ts-expect-error: previous tests guarantee that the path exists
    expect(quizzes[3].answers["short-answer"]).toBeDefined();
    // @ts-expect-error: previous tests guarantee that the path exists
    expect(quizzes[3].answers["short-answer"]).toHaveLength(4);
    // @ts-expect-error: previous tests guarantee that the path exists
    expect(quizzes[3].answers["short-answer"][0]).toEqual({
      answer: [{ text: "a", type: "text" }],
      answer_is_default: true,
    });
  });

  it("produces valid explanatory text", () => {
    const legacyQuiz = legacyQuizFixture();
    const quizzes = transformQuiz(legacyQuiz);
    // @ts-expect-error: previous tests guarantee that the path exists
    expect(quizzes[4].answers["explanatory-text"]).toBeUndefined();
    // @ts-expect-error: previous tests guarantee that the path exists
    expect(quizzes[4].questionType).toEqual("explanatory-text");
    // @ts-expect-error: previous tests guarantee that the path exists
    expect(quizzes[4]?.questionStem[0].text).toEqual("A helpful explanation");
  });
});
