import userEvent from "@testing-library/user-event";

import DownloadConfirmation from "./DownloadConfirmation";

import { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { CurriculumTrackingProps } from "@/pages-helpers/teacher/share-experiments/shareExperimentTypes";

const onwardContentSelected =
  jest.fn() as unknown as TrackFns["onwardContentSelected"];

jest.mock(
  "@/pages-helpers/teacher/share-experiments/useShareExperiment",
  () => ({
    __esModule: true,
    useShareExperiment: jest.fn(() => ({
      shareIdRef: { current: "test-share-id" },
      shareIdKeyRef: { current: "test-share-id-key" },
    })),
  }),
);

jest.mock("@oaknational/oak-consent-client", () => ({
  __esModule: true,
  useOakConsent: jest.fn(() => ({
    state: {
      policyConsents: [
        {
          consentState: "denied",
        },
        {
          consentState: "granted",
        },
      ],
    },
  })),
}));

describe("DownloadConfirmation component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const curriculumTrackingProps: CurriculumTrackingProps = {
    lessonName: "Test lesson",
    lessonSlug: "test-lesson",
    unitName: "Test unit",
    unitSlug: "test-unit",
    keyStageSlug: "test-key-stage",
    keyStageTitle: "Key stage 1",
    subjectSlug: "test-subject",
    subjectTitle: "Test subject",
  };

  it("should render", () => {
    const { getByText } = renderWithTheme(
      <DownloadConfirmation
        lessonTitle="Test lesson"
        programmeSlug="test-programme"
        unitTitle="Test unit"
        isCanonical={false}
        onwardContentSelected={onwardContentSelected}
        {...curriculumTrackingProps}
      />,
    );

    expect(getByText("Thanks for downloading")).toBeInTheDocument();
  });

  it("Back to lesson link", () => {
    const { getByTestId } = renderWithTheme(
      <DownloadConfirmation
        lessonTitle="Test lesson"
        programmeSlug="test-programme"
        unitTitle="Test unit"
        isCanonical={false}
        onwardContentSelected={onwardContentSelected}
        {...curriculumTrackingProps}
      />,
    );

    const link = getByTestId("back-to-lesson-link");

    expect(link).toHaveAttribute(
      "href",
      "/teachers/programmes/test-programme/units/test-unit/lessons/test-lesson",
    );
  });
  it("Back to lesson link specialist", () => {
    const { getByTestId } = renderWithTheme(
      <DownloadConfirmation
        lessonTitle="Test lesson"
        programmeSlug="test-programme"
        unitTitle="Test unit"
        isCanonical={false}
        onwardContentSelected={onwardContentSelected}
        isSpecialist={true}
        {...curriculumTrackingProps}
      />,
    );

    const link = getByTestId("back-to-lesson-link");

    expect(link).toHaveAttribute(
      "href",
      "/teachers/specialist/programmes/test-programme/units/test-unit/lessons/test-lesson",
    );
  });

  it("when unitSlug or programmeSlug is null renders link to cannonical lesson", () => {
    const { getByTestId } = renderWithTheme(
      <DownloadConfirmation
        lessonTitle="Test lesson"
        programmeSlug={null}
        isCanonical={false}
        onwardContentSelected={onwardContentSelected}
        {...curriculumTrackingProps}
      />,
    );

    const link = getByTestId("back-to-lesson-link");

    expect(link).toHaveAttribute("href", "/teachers/lessons/test-lesson");
  });

  it("should call onwardContentSelected when back to lesson link is clicked", async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <DownloadConfirmation
        lessonTitle="Test lesson"
        programmeSlug="test-programme"
        unitTitle="Test unit"
        isCanonical={false}
        onwardContentSelected={onwardContentSelected}
        {...curriculumTrackingProps}
      />,
    );

    const lessonLink = getByRole("link", { name: "Back to lesson" });

    await user.click(lessonLink);

    expect(onwardContentSelected).toHaveBeenCalledTimes(1);
    expect(onwardContentSelected).toHaveBeenCalledWith({
      lessonName: "Test lesson",
      lessonSlug: "test-lesson",
      unitName: "Test unit",
      unitSlug: "test-unit",
      onwardIntent: "view-lesson",
    });
  });

  it("isCannonical onwardContentSelected fn called with correct arguments", async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <DownloadConfirmation
        lessonTitle="Test lesson"
        programmeSlug={null}
        isCanonical={true}
        onwardContentSelected={onwardContentSelected}
        {...curriculumTrackingProps}
      />,
    );

    const lessonLink = getByRole("link", { name: "Back to lesson" });

    await user.click(lessonLink);

    expect(onwardContentSelected).toHaveBeenCalledTimes(1);
    expect(onwardContentSelected).toHaveBeenCalledWith({
      lessonName: "Test lesson",
      lessonSlug: "test-lesson",
      unitName: "",
      unitSlug: "",
      onwardIntent: "view-lesson",
    });
  });
});
