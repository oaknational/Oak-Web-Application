import userEvent from "@testing-library/user-event";

import DownloadConfirmation from "./DownloadConfirmation";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { CurriculumTrackingProps } from "@/pages-helpers/teacher/share/shareTypes";
import { OnwardContentSelectedProperties } from "@/browser-lib/avo/Avo";
import {
  setupMockLinkClick,
  teardownMockLinkClick,
  mockLinkClick,
} from "@/utils/mockLinkClick";

const onwardContentSelected = jest.fn() as unknown as (
  properties: Omit<
    OnwardContentSelectedProperties,
    "lessonReleaseDate" | "lessonReleaseCohort"
  >,
) => void;

jest.mock("@/pages-helpers/teacher/share/useShare", () => ({
  __esModule: true,
  useShare: jest.fn(() => ({
    shareIdRef: { current: "test-share-id" },
    shareIdKeyRef: { current: "test-share-id-key" },
  })),
}));

jest.mock("@oaknational/oak-consent-client", () => ({
  __esModule: true,
  ...jest.requireActual("@oaknational/oak-consent-client"),
  useOakConsent: jest.fn(() => ({
    state: {
      policyConsents: [
        {
          consentState: "denied",
          policyParties: [],
          policyId: "1",
        },
        {
          consentState: "granted",
          policyParties: [],
          policyId: "2",
        },
      ],
    },
  })),
}));

window.scrollTo = jest.fn();

describe("DownloadConfirmation component", () => {
  beforeEach(() => {
    setupMockLinkClick();
    jest.clearAllMocks();
  });

  afterEach(() => {
    teardownMockLinkClick();
  });

  const expectScrollTopOnRender = () => {
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).toHaveBeenCalledWith({
      behavior: "smooth",
      top: 0,
    });
  };

  const curriculumTrackingProps: CurriculumTrackingProps & {
    lessonReleaseDate: string;
  } = {
    lessonName: "Test lesson",
    lessonSlug: "test-lesson",
    unitName: "Test unit",
    unitSlug: "test-unit",
    keyStageSlug: "test-key-stage",
    keyStageTitle: "Key stage 1",
    subjectSlug: "test-subject",
    subjectTitle: "Test subject",
    lessonReleaseDate: "2025-09-29T14:00:00.000Z",
  };

  it("should render", () => {
    const { getByText } = renderWithProviders()(
      <DownloadConfirmation
        lessonTitle="Test lesson"
        programmeSlug="test-programme"
        unitTitle="Test unit"
        isCanonical={false}
        isLegacy={false}
        onwardContentSelected={onwardContentSelected}
        {...curriculumTrackingProps}
      />,
    );

    expectScrollTopOnRender();
    expect(getByText("Thanks for downloading")).toBeInTheDocument();
  });

  it("Back to lesson link", () => {
    const { getByTestId } = renderWithProviders()(
      <DownloadConfirmation
        lessonTitle="Test lesson"
        programmeSlug="test-programme"
        unitTitle="Test unit"
        isCanonical={false}
        isLegacy={false}
        onwardContentSelected={onwardContentSelected}
        {...curriculumTrackingProps}
      />,
    );

    expectScrollTopOnRender();
    const link = getByTestId("back-to-lesson-link");

    expect(link).toHaveAttribute(
      "href",
      "/teachers/programmes/test-programme/units/test-unit/lessons/test-lesson",
    );
  });
  it("Back to lesson link specialist", () => {
    const { getByTestId } = renderWithProviders()(
      <DownloadConfirmation
        lessonTitle="Test lesson"
        programmeSlug="test-programme"
        unitTitle="Test unit"
        isCanonical={false}
        isLegacy={false}
        onwardContentSelected={onwardContentSelected}
        isSpecialist={true}
        {...curriculumTrackingProps}
      />,
    );

    expectScrollTopOnRender();
    const link = getByTestId("back-to-lesson-link");

    expect(link).toHaveAttribute(
      "href",
      "/teachers/specialist/programmes/test-programme/units/test-unit/lessons/test-lesson",
    );
  });

  it("when unitSlug or programmeSlug is null renders link to cannonical lesson", () => {
    const { getByTestId } = renderWithProviders()(
      <DownloadConfirmation
        lessonTitle="Test lesson"
        programmeSlug={null}
        isCanonical={false}
        isLegacy={false}
        onwardContentSelected={onwardContentSelected}
        {...curriculumTrackingProps}
      />,
    );

    expectScrollTopOnRender();
    const link = getByTestId("back-to-lesson-link");

    expect(link).toHaveAttribute("href", "/teachers/lessons/test-lesson");
  });

  it("should call onwardContentSelected when back to lesson link is clicked", async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithProviders()(
      <DownloadConfirmation
        lessonTitle="Test lesson"
        programmeSlug="test-programme"
        unitTitle="Test unit"
        isCanonical={false}
        isLegacy={false}
        onwardContentSelected={onwardContentSelected}
        {...curriculumTrackingProps}
      />,
    );

    expectScrollTopOnRender();
    const lessonLink = getByRole("link", { name: "Back to lesson" });

    await user.click(lessonLink);
    expect(mockLinkClick).toHaveBeenCalledWith(
      "http://localhost/teachers/programmes/test-programme/units/test-unit/lessons/test-lesson",
    );

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
    const { getByRole } = renderWithProviders()(
      <DownloadConfirmation
        lessonTitle="Test lesson"
        programmeSlug={null}
        isCanonical={true}
        isLegacy={false}
        onwardContentSelected={onwardContentSelected}
        {...curriculumTrackingProps}
      />,
    );

    expectScrollTopOnRender();
    const lessonLink = getByRole("link", { name: "Back to lesson" });

    await user.click(lessonLink);
    expect(mockLinkClick).toHaveBeenCalledWith(
      "http://localhost/teachers/lessons/test-lesson",
    );

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
