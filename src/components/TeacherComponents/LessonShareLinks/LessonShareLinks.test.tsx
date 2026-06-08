import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFeatureFlagEnabled } from "posthog-js/react";

import LessonShareLinks, {
  SHARE_WITH_PUPILS_HEADING_ID,
} from "./LessonShareLinks";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const mockUseFeatureFlagEnabled = useFeatureFlagEnabled as jest.Mock;

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: jest.fn(),
}));

const onSubmitMock = jest.fn(() => true);

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe("LessonShareLinks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should render", () => {
    renderWithProviders()(
      <LessonShareLinks
        disabled={false}
        lessonSlug="test-slug"
        selectedActivities={["exit-quiz"]}
        onSubmit={onSubmitMock}
      />,
    );
    const shareHeader = screen.getByRole("heading");
    expect(shareHeader).toBeInTheDocument();
    expect(shareHeader).toHaveTextContent("Share with pupils");
    const shareGroup = screen.getByRole("group", { name: "Share with pupils" });
    expect(shareGroup).toBeInTheDocument();
    expect(shareGroup).toHaveAttribute(
      "aria-labelledby",
      SHARE_WITH_PUPILS_HEADING_ID,
    );
    expect(
      document.getElementById(SHARE_WITH_PUPILS_HEADING_ID),
    ).toHaveTextContent("Share with pupils");
  });
  it("should update copy link button", async () => {
    renderWithProviders()(
      <LessonShareLinks
        disabled={false}
        lessonSlug="test-slug"
        selectedActivities={["exit-quiz"]}
        onSubmit={onSubmitMock}
      />,
    );
    const copyLinkButton = screen.getByRole("button", {
      name: "Copy link to clipboard",
    });
    expect(copyLinkButton).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(copyLinkButton);
    expect(copyLinkButton).toHaveTextContent("Link copied to clipboard");
  });
  it("should render oak toast", async () => {
    renderWithProviders()(
      <LessonShareLinks
        disabled={false}
        lessonSlug="test-slug"
        selectedActivities={["exit-quiz"]}
        onSubmit={onSubmitMock}
      />,
    );
    const copyLinkButton = screen.getByRole("button", {
      name: "Copy link to clipboard",
    });
    const user = userEvent.setup();
    await user.click(copyLinkButton);
    const toast = screen.getAllByText("Link copied to clipboard");
    expect(toast).toHaveLength(2); // One for the button and one for the toast
  });
  it("should call onSubmit with copy-link", async () => {
    const onSubmit = jest.fn();
    renderWithProviders()(
      <LessonShareLinks
        disabled={false}
        lessonSlug="test-slug"
        selectedActivities={["exit-quiz"]}
        onSubmit={onSubmit}
      />,
    );
    const copyLinkButton = screen.getByRole("button", {
      name: "Copy link to clipboard",
    });
    expect(copyLinkButton).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(copyLinkButton);
    expect(onSubmit).toHaveBeenCalledWith("copy-link");
  });

  it("should call onSubmit with correct avoMedium", async () => {
    const onSubmit = jest.fn();
    const { getByRole } = renderWithProviders()(
      <LessonShareLinks
        disabled={false}
        lessonSlug="test-slug"
        selectedActivities={["exit-quiz"]}
        onSubmit={onSubmit}
      />,
    );

    const googleClassroomLink = getByRole("button", {
      name: "Share via Google Classroom",
    });

    expect(googleClassroomLink).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(googleClassroomLink);
    expect(onSubmit).toHaveBeenCalledWith("google-classroom");
  });

  it("should render the Google Classroom button when onGoogleClassroomClick is provided", async () => {
    const onSubmit = jest.fn();
    const onGoogleClassroomClick = jest.fn();
    mockUseFeatureFlagEnabled.mockReturnValue(true);

    renderWithProviders()(
      <LessonShareLinks
        disabled={false}
        lessonSlug="test-slug"
        selectedActivities={["exit-quiz"]}
        onSubmit={onSubmit}
        onGoogleClassroomClick={onGoogleClassroomClick}
      />,
    );

    expect(
      screen.queryByRole("link", {
        name: "Assign to Google Classroom",
      }),
    ).not.toBeInTheDocument();

    const googleClassroomButton = screen.getByRole("button", {
      name: "Assign to Google Classroom",
    });

    const user = userEvent.setup();
    await user.click(googleClassroomButton);

    expect(onSubmit).toHaveBeenCalledWith("google-classroom");
    expect(onGoogleClassroomClick).toHaveBeenCalled();
  });
});
