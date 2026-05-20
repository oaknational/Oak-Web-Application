import userEvent from "@testing-library/user-event";

import { PupilLessonReviewShareOptions } from "./PupilLessonReviewShareOptions";

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
});
