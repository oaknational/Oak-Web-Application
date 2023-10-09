import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import LessonDetails from "./LessonDetails";

describe("LessonDetails component", () => {
  const keyLearningPoints = [{ keyLearningPoint: "test" }];
  const commonMisconceptions = [
    { misconception: "misconception", response: "response" },
  ];
  const keyWords = [{ keyword: "keyword", description: "description" }];
  const equipmentAndResources = [{ equipment: "equipment" }];
  const contentGuidance = [
    {
      contentGuidanceLabel: "content guidance",
      contentGuidanceDescription: "content guidance",
      contentGuidanceArea: "content guidance area",
    },
  ];
  const supervisionLevel = "supervision level";

  const teacherTips = [{ teacherTip: "test teacher tip" }];
  it("it should not render its own title", () => {
    const { getByText } = renderWithTheme(
      <LessonDetails
        keyLearningPoints={keyLearningPoints}
        commonMisconceptions={commonMisconceptions}
        keyWords={keyWords}
        teacherTips={teacherTips}
        equipmentAndResources={equipmentAndResources}
        contentGuidance={contentGuidance}
        supervisionLevel={supervisionLevel}
      />,
    );

    expect(() => getByText("Lesson details")).toThrow();
  });

  it("should render KeyLearningPoints component with key learning points", () => {
    const { getByText } = renderWithTheme(
      <LessonDetails
        keyLearningPoints={keyLearningPoints}
        commonMisconceptions={commonMisconceptions}
        keyWords={keyWords}
        teacherTips={teacherTips}
        equipmentAndResources={equipmentAndResources}
        contentGuidance={contentGuidance}
        supervisionLevel={supervisionLevel}
      />,
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
        equipmentAndResources={equipmentAndResources}
        contentGuidance={contentGuidance}
        supervisionLevel={supervisionLevel}
      />,
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
        equipmentAndResources={equipmentAndResources}
        contentGuidance={contentGuidance}
        supervisionLevel={supervisionLevel}
      />,
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
        equipmentAndResources={equipmentAndResources}
        contentGuidance={contentGuidance}
        supervisionLevel={supervisionLevel}
      />,
    );

    const keyWordsComponent = getByText("Keywords");
    expect(keyWordsComponent).toBeInTheDocument();
  });

  it("should not render KeyWords when passed null/undefined", () => {
    const { queryByText } = renderWithTheme(
      <LessonDetails
        keyLearningPoints={keyLearningPoints}
        commonMisconceptions={commonMisconceptions}
        keyWords={null}
        teacherTips={teacherTips}
        equipmentAndResources={equipmentAndResources}
        contentGuidance={contentGuidance}
        supervisionLevel={supervisionLevel}
      />,
    );

    const componentTitle = queryByText("Keywords");
    expect(componentTitle).not.toBeInTheDocument();
  });

  it("should render TeacherTips component with keywords", () => {
    const { getByText } = renderWithTheme(
      <LessonDetails
        keyLearningPoints={keyLearningPoints}
        commonMisconceptions={commonMisconceptions}
        keyWords={keyWords}
        teacherTips={teacherTips}
        equipmentAndResources={equipmentAndResources}
        contentGuidance={contentGuidance}
        supervisionLevel={supervisionLevel}
      />,
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
        equipmentAndResources={equipmentAndResources}
        contentGuidance={contentGuidance}
        supervisionLevel={supervisionLevel}
      />,
    );

    const componentTitle = queryByText("Teacher tips");
    expect(componentTitle).not.toBeInTheDocument();
  });

  it("if equipmentAndResources, contentGuidance and supervisionLevel are null/undefined shouldn't render any of their titles", () => {
    const { queryByText } = renderWithTheme(
      <LessonDetails
        keyLearningPoints={keyLearningPoints}
        commonMisconceptions={commonMisconceptions}
        keyWords={keyWords}
        teacherTips={teacherTips}
        equipmentAndResources={null}
        contentGuidance={null}
        supervisionLevel={undefined}
      />,
    );

    const equipmentTitle = queryByText("Equipment");
    const contentGuidanceTitle = queryByText("Content guidance");
    const supervisionLevelTitle = queryByText("supervision");

    expect(equipmentTitle).not.toBeInTheDocument();
    expect(contentGuidanceTitle).not.toBeInTheDocument();
    expect(supervisionLevelTitle).not.toBeInTheDocument();
  });
  it("it should render the correct legacy license", () => {
    const { getByText, queryByText } = renderWithTheme(
      <LessonDetails
        keyLearningPoints={keyLearningPoints}
        commonMisconceptions={commonMisconceptions}
        keyWords={keyWords}
        teacherTips={teacherTips}
        equipmentAndResources={null}
        contentGuidance={null}
        supervisionLevel={undefined}
        isLegacyLicense={true}
      />,
    );
    const preAlbCopyright = getByText(
      "This content is made available by Oak and its partners",
      { exact: false },
    );
    expect(preAlbCopyright).toBeInTheDocument();

    const licenseTitle = queryByText("Licence");
    expect(licenseTitle).toBeInTheDocument();
  });
  it("it should render the correct license", () => {
    const { getByText, queryByText } = renderWithTheme(
      <LessonDetails
        keyLearningPoints={keyLearningPoints}
        commonMisconceptions={commonMisconceptions}
        keyWords={keyWords}
        teacherTips={teacherTips}
        equipmentAndResources={null}
        contentGuidance={null}
        supervisionLevel={undefined}
        isLegacyLicense={false}
      />,
    );
    const preAlbCopyright = getByText(
      "This content is © Oak National Academy (2023), licensed on",
      { exact: false },
    );
    expect(preAlbCopyright).toBeInTheDocument();

    const licenseTitle = queryByText("Licence");
    expect(licenseTitle).toBeInTheDocument();
  });
});
