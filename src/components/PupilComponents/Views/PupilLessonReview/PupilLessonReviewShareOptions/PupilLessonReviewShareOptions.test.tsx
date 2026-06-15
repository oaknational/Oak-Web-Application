import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import {
  PupilLessonReviewShareOptions,
  SHARE_COPY_FAILED_MESSAGE,
  SHARE_COPY_SUCCESS_MESSAGE,
} from "./PupilLessonReviewShareOptions";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonReviewShareOptions", () => {
  it("renders share actions and handles copy link", async () => {
    const onCopyLink = jest.fn();
    const user = userEvent.setup();

    render(
      <PupilLessonReviewShareOptions
        showPrintable={true}
        printableHref="/printable"
        onCopyLink={onCopyLink}
      />,
    );

    await user.click(
      document.querySelector(
        '[data-testid="share-results-button"]',
      ) as HTMLElement,
    );

    expect(
      document.querySelector('[data-testid="printable-results-button"]'),
    ).toHaveAttribute("href", "/printable");
    expect(onCopyLink).toHaveBeenCalledTimes(1);
  });

  it("renders share state feedback", () => {
    render(
      <PupilLessonReviewShareOptions
        onCopyLink={() => undefined}
        shareState="failed"
      />,
    );

    expect(document.body).toHaveTextContent(
      "Failed to share results. Please try again.",
    );
  });

  it("keeps a screen reader live region mounted before copy succeeds", () => {
    render(<PupilLessonReviewShareOptions onCopyLink={() => undefined} />);

    expect(screen.getByTestId("share-copy-announcement")).toBeEmptyDOMElement();
  });

  it("announces copy success to screen readers via a live region", () => {
    render(
      <PupilLessonReviewShareOptions
        onCopyLink={() => undefined}
        shareState="shared"
      />,
    );

    const announcement = screen.getByTestId("share-copy-announcement");

    expect(announcement).toHaveAttribute("aria-live", "polite");
    expect(announcement).toHaveAttribute("aria-atomic", "true");
    expect(announcement).toHaveTextContent(SHARE_COPY_SUCCESS_MESSAGE);
    expect(
      screen.getByRole("heading", { name: SHARE_COPY_SUCCESS_MESSAGE }),
    ).toBeInTheDocument();
  });

  it("announces copy failure to screen readers via a live region", () => {
    render(
      <PupilLessonReviewShareOptions
        onCopyLink={() => undefined}
        shareState="failed"
      />,
    );

    const announcement = screen.getByTestId("share-copy-error-announcement");

    expect(announcement).toHaveAttribute("aria-live", "assertive");
    expect(announcement).toHaveAttribute("aria-atomic", "true");
    expect(announcement).toHaveTextContent(SHARE_COPY_FAILED_MESSAGE);
    expect(
      screen.getByRole("heading", { name: SHARE_COPY_FAILED_MESSAGE }),
    ).toBeInTheDocument();
  });
});
