import LessonOverviewHeader, {
  LessonOverviewHeaderProps,
} from "./LessonOverviewHeader";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: jest.fn(() => "test"),
  useFeatureFlagEnabled: jest.fn(() => true),
}));

const props = {
  ...lessonOverviewFixture(),
  breadcrumbs: [],
  background: "pink30",
  isLegacyLesson: false,
  subjectIconBackgroundColor: "pink",
  showShare: true,
} as unknown as LessonOverviewHeaderProps;

const render = renderWithProviders();

describe("LessonOverviewHeaderB", () => {
  it("renders the title with the correct level", () => {
    const { getAllByRole } = render(<LessonOverviewHeader {...props} />);
    const subjectHeading = getAllByRole("heading", { level: 1 });
    expect(subjectHeading).toHaveLength(1);
    expect(subjectHeading[0]).toHaveTextContent("Adverbial complex sentences");
  });

  it("renders the download button when !expired && show download all is true", () => {
    const { getAllByTestId } = render(
      <LessonOverviewHeader {...props} showDownloadAll={true} />,
    );
    expect(getAllByTestId("download-all-button")).toHaveLength(2); // mobile and desktop
  });

  it("renders the share all button", () => {
    const { getAllByTestId } = render(<LessonOverviewHeader {...props} />);

    const buttons = getAllByTestId("share-all-button");

    expect(buttons).toHaveLength(2); // mobile and desktop
  });

  it("does not render the download button when expired && show download all is true", () => {
    const { queryByTestId } = render(
      <LessonOverviewHeader {...props} expired={true} showDownloadAll={true} />,
    );
    const downloadLink = queryByTestId("download-all-button");
    expect(downloadLink).toBeNull();
  });

  it("does not render the download button when show download all is false", () => {
    const { queryByTestId } = render(
      <LessonOverviewHeader {...props} showDownloadAll={false} />,
    );
    const downloadLink = queryByTestId("download-all-button");
    expect(downloadLink).toBeNull();
  });

  it("renders examboard title when passed in ", () => {
    const testProps = {
      ...props,
      examBoardTitle: "foobar",
      yearTitle: undefined,
    };
    const { getAllByText } = render(<LessonOverviewHeader {...testProps} />);
    const elems = getAllByText("foobar");
    expect(elems).toHaveLength(2); // mobile and desktop
  });

  it("renders tier title when passed in ", () => {
    const testProps = { ...props, tierTitle: "foobar", yearTitle: undefined };
    const { getAllByText } = render(<LessonOverviewHeader {...testProps} />);
    const elems = getAllByText("foobar");
    expect(elems).toHaveLength(2); // mobile and desktop
  });

  it("doesn't render without year examboard or tier  ", () => {
    const testProps = {
      ...props,
      examBoardTitle: undefined,
      yearTitle: undefined,
      tierTitle: undefined,
    };
    const { queryByTestId } = render(<LessonOverviewHeader {...testProps} />);
    expect(queryByTestId("other-factors")).toBeNull();
  });

  it("renders year title when passed in ", () => {
    const testProps = { ...props, yearTitle: "foobar" };
    const { getAllByText } = render(<LessonOverviewHeader {...testProps} />);
    const elems = getAllByText("foobar");
    expect(elems).toHaveLength(2); // mobile and desktop
  });

  it("renders a pupil lesson outcome when passed in ", () => {
    const testProps = {
      ...props,
      pupilLessonOutcome: "A pupil lesson outcome",
    };
    const { getAllByText } = render(<LessonOverviewHeader {...testProps} />);
    const description = getAllByText("A pupil lesson outcome");
    expect(description).toHaveLength(2); // mobile and desktop
  });

  it("renders phonic outcomes on overview header when passed in ", () => {
    const testProps = {
      ...props,
      phonicsOutcome: "A phonic outcome",
    };
    const { getAllByText } = render(<LessonOverviewHeader {...testProps} />);
    const description = getAllByText("A phonic outcome");
    expect(description).toHaveLength(2); // mobile and desktop
  });

  it("hides back button and lesson count when not in a unit", () => {
    const testProps = {
      ...props,
      unitTitle: null,
    };
    const { queryByTestId } = render(<LessonOverviewHeader {...testProps} />);
    expect(queryByTestId("back-button-row")).toBeNull();
    expect(queryByTestId("lesson-count-tag")).toBeNull();
  });
});
