import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import LessonDetails from "./LessonDetails";

describe("LessonDetails component", () => {
  const keyLearningPoints = [{ keyLearningPoint: "test" }];
  const commonMisconceptions = [
    { misconception: "misconception", response: "response" },
  ];
  const keyWords = [{ keyword: "keyword", description: "description" }];
  const teacherTips = [{ teacherTip: "test teacher tip" }];
  it("should render Lesson details", () => {
    const { getByText } = renderWithTheme(
      <LessonDetails
        keyLearningPoints={keyLearningPoints}
        commonMisconceptions={commonMisconceptions}
        keyWords={keyWords}
        teacherTips={teacherTips}
      />
    );

    const componentTitle = getByText("Lesson details");
    expect(componentTitle).toBeInTheDocument();
  });

  it("should render KeyLearningPoints component with key learning points", () => {
    const { getByText } = renderWithTheme(
      <LessonDetails
        keyLearningPoints={keyLearningPoints}
        commonMisconceptions={commonMisconceptions}
        keyWords={keyWords}
        teacherTips={teacherTips}
      />
    );

    const keyLearningPointsComponent = getByText("Key learning points");
    expect(keyLearningPointsComponent).toBeInTheDocument();
  });

  it("should render CommonMisconceptions component with common misconceptions", () => {
    const { getByText } = renderWithTheme(
      <LessonDetails
        keyLearningPoints={keyLearningPoints}
        commonMisconceptions={commonMisconceptions}
        keyWords={keyWords}
        teacherTips={teacherTips}
      />
    );

    const commonMisconceptionsComponent = getByText("Common misconceptions");
    expect(commonMisconceptionsComponent).toBeInTheDocument();
  });

  it("should not render CommonMisconceptions when passed null/undefined", () => {
    const { queryByText } = renderWithTheme(
      <LessonDetails
        keyLearningPoints={keyLearningPoints}
        commonMisconceptions={null}
        keyWords={keyWords}
        teacherTips={teacherTips}
      />
    );

    const componentTitle = queryByText("Common misconceptions");
    expect(componentTitle).not.toBeInTheDocument();
  });

  it("should render KeyWords component with keywords", () => {
    const { getByText } = renderWithTheme(
      <LessonDetails
        keyLearningPoints={keyLearningPoints}
        commonMisconceptions={commonMisconceptions}
        keyWords={keyWords}
        teacherTips={teacherTips}
      />
    );

    const keyWordsComponent = getByText("Key words");
    expect(keyWordsComponent).toBeInTheDocument();
  });

  it("should not render KeyWords when passed null/undefined", () => {
    const { queryByText } = renderWithTheme(
      <LessonDetails
        keyLearningPoints={keyLearningPoints}
        commonMisconceptions={commonMisconceptions}
        keyWords={null}
        teacherTips={teacherTips}
      />
    );

    const componentTitle = queryByText("Key words");
    expect(componentTitle).not.toBeInTheDocument();
  });

  it("should render TeacherTips component with keywords", () => {
    const { getByText } = renderWithTheme(
      <LessonDetails
        keyLearningPoints={keyLearningPoints}
        commonMisconceptions={commonMisconceptions}
        keyWords={keyWords}
        teacherTips={teacherTips}
      />
    );

    const keyWordsComponent = getByText("Teacher tip");
    expect(keyWordsComponent).toBeInTheDocument();
  });

  it("should not render TeacherTips when passed null/undefined", () => {
    const { queryByText } = renderWithTheme(
      <LessonDetails
        keyLearningPoints={keyLearningPoints}
        commonMisconceptions={commonMisconceptions}
        keyWords={keyWords}
        teacherTips={null}
      />
    );

    const componentTitle = queryByText("Teacher tips");
    expect(componentTitle).not.toBeInTheDocument();
  });
});
