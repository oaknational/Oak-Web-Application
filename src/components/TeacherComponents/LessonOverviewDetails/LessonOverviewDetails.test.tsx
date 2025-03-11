import LessonOverviewDetails from "./LessonOverviewDetails";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

jest.mock("better-react-mathjax", () => ({
  MathJax: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const lessonDetailProps = {
  keyLearningPoints: [{ keyLearningPoint: "test" }],
  displayVocab: false,
  commonMisconceptions: [
    { misconception: "misconception", response: "response" },
  ],
  keyWords: [{ keyword: "keyword", description: "description" }],
  teacherTips: [{ teacherTip: "test teacher tip" }],
  equipmentAndResources: [{ equipment: "equipment" }],
  contentGuidance: [
    {
      contentGuidanceLabel: "content guidance",
      contentGuidanceDescription: "content guidance",
      contentGuidanceArea: "content guidance area",
    },
  ],
  supervisionLevel: "supervision level",
  isMathJaxLesson: false,
  updatedAt: "2024-01-01T00:00:00Z",
  hasVocabAndTranscripts: false,
  additionalFiles: ["file1", "file2"],
  slugs: {
    lessonSlug: "lesson-slug",
    unitSlug: "unit-slug",
    programmeSlug: "programme-slug",
  },
  year: "year 7",
  subject: "maths",
  keystage: "ks3",
  unit: "maths",
  lesson: "Lesson title",
  examBoardSlug: null,
  subjectSlug: "maths",
  subjectParent: null,
};

describe("LessonOverviewDetails component", () => {
  it("it should not render its own title", () => {
    const { getByText } = renderWithTheme(
      <LessonOverviewDetails
        {...lessonDetailProps}
        isMathJaxLesson={false}
        updatedAt="2024-01-01T00:00:00Z"
        hasVocabAndTranscripts={false}
      />,
    );

    expect(() => getByText("Lesson details")).toThrow();
  });

  it("should render KeyLearningPoints component with key learning points", () => {
    const { getByText } = renderWithTheme(
      <LessonOverviewDetails
        {...lessonDetailProps}
        isMathJaxLesson={false}
        updatedAt="2024-01-01T00:00:00Z"
        hasVocabAndTranscripts={false}
      />,
    );

    const keyLearningPointsComponent = getByText("Key learning points");
    expect(keyLearningPointsComponent).toBeInTheDocument();
  });

  it("should render CommonMisconceptions component with common misconceptions", () => {
    const { getByText } = renderWithTheme(
      <LessonOverviewDetails
        {...lessonDetailProps}
        isMathJaxLesson={false}
        updatedAt="2024-01-01T00:00:00Z"
        hasVocabAndTranscripts={false}
      />,
    );

    const commonMisconceptionsComponent = getByText("Common misconception");
    expect(commonMisconceptionsComponent).toBeInTheDocument();
  });

  it("should not render CommonMisconceptions when passed null/undefined", () => {
    const { queryByText } = renderWithTheme(
      <LessonOverviewDetails
        {...lessonDetailProps}
        displayVocab={false}
        commonMisconceptions={null}
        isMathJaxLesson={false}
        updatedAt="2024-01-01T00:00:00Z"
        hasVocabAndTranscripts={false}
      />,
    );

    const componentTitle = queryByText("Common misconceptions");
    expect(componentTitle).not.toBeInTheDocument();
  });

  it("should render KeyWords component with keywords", () => {
    const { getByText } = renderWithTheme(
      <LessonOverviewDetails
        {...lessonDetailProps}
        displayVocab={false}
        isMathJaxLesson={false}
        updatedAt="2024-01-01T00:00:00Z"
        hasVocabAndTranscripts={false}
      />,
    );

    const keyWordsComponent = getByText("Keywords");
    expect(keyWordsComponent).toBeInTheDocument();
  });

  it("should not render KeyWords when passed null/undefined", () => {
    const { queryByText } = renderWithTheme(
      <LessonOverviewDetails
        {...lessonDetailProps}
        displayVocab={false}
        keyWords={null}
        isMathJaxLesson={false}
        updatedAt="2024-01-01T00:00:00Z"
        hasVocabAndTranscripts={false}
      />,
    );

    const componentTitle = queryByText("Keywords");
    expect(componentTitle).not.toBeInTheDocument();
  });

  it("should render Vocab button component", () => {
    const { getByText, getByRole } = renderWithTheme(
      <LessonOverviewDetails
        {...lessonDetailProps}
        isMathJaxLesson={false}
        updatedAt="2024-01-01T00:00:00Z"
        displayVocab={true}
        hasVocabAndTranscripts={true}
      />,
    );

    const vocabHeading = getByText(
      "Vocabulary and transcripts for this lessons",
    );
    const vocabButton = getByRole("button", {
      name: /View vocabulary and transcripts in additional material/i,
    });
    expect(vocabButton).toBeInTheDocument();
    expect(vocabHeading).toBeInTheDocument();
  });

  it("should render TeacherTips component with keywords", () => {
    const { getByText } = renderWithTheme(
      <LessonOverviewDetails
        {...lessonDetailProps}
        isMathJaxLesson={false}
        updatedAt="2024-01-01T00:00:00Z"
        hasVocabAndTranscripts={false}
      />,
    );

    const keyWordsComponent = getByText("Teacher tip");
    expect(keyWordsComponent).toBeInTheDocument();
  });

  it("should not render TeacherTips when passed null/undefined", () => {
    const { queryByText } = renderWithTheme(
      <LessonOverviewDetails
        {...lessonDetailProps}
        teacherTips={null}
        isMathJaxLesson={false}
        updatedAt="2024-01-01T00:00:00Z"
        hasVocabAndTranscripts={false}
      />,
    );

    const componentTitle = queryByText("Teacher tips");
    expect(componentTitle).not.toBeInTheDocument();
  });

  it("if equipmentAndResources, contentGuidance and supervisionLevel are null/undefined shouldn't render any of their titles", () => {
    const { queryByText } = renderWithTheme(
      <LessonOverviewDetails
        {...lessonDetailProps}
        displayVocab={false}
        equipmentAndResources={null}
        contentGuidance={null}
        supervisionLevel={undefined}
        isMathJaxLesson={false}
        updatedAt="2024-01-01T00:00:00Z"
        hasVocabAndTranscripts={false}
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
      <LessonOverviewDetails
        {...lessonDetailProps}
        equipmentAndResources={null}
        contentGuidance={null}
        supervisionLevel={undefined}
        isLegacyLicense={true}
        isMathJaxLesson={false}
        updatedAt="2024-01-01T00:00:00Z"
        hasVocabAndTranscripts={false}
        displayVocab={false}
      />,
    );
    const preAlbCopyright = getByText(
      "This content is made available by Oak National Academy Limited and its partners",
      { exact: false },
    );
    expect(preAlbCopyright).toBeInTheDocument();

    const licenseTitle = queryByText("Licence");
    expect(licenseTitle).toBeInTheDocument();
  });
  it("it should render the correct license", () => {
    const { getByText, queryByText } = renderWithTheme(
      <LessonOverviewDetails
        {...lessonDetailProps}
        equipmentAndResources={null}
        contentGuidance={null}
        supervisionLevel={undefined}
        isLegacyLicense={false}
        isMathJaxLesson={false}
        updatedAt="2024-01-01T00:00:00Z"
        hasVocabAndTranscripts={false}
        displayVocab={false}
      />,
    );

    const preAlbCopyright = getByText(
      `This content is © Oak National Academy Limited (2024), licensed on`,
      { exact: false },
    );
    expect(preAlbCopyright).toBeInTheDocument();

    const licenseTitle = queryByText("Licence");
    expect(licenseTitle).toBeInTheDocument();
  });
});
