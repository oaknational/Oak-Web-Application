import userEvent from "@testing-library/user-event";

import {
  PupilLessonIntroAdditionalFileItem,
  PupilLessonIntroInfoCard,
  PupilLessonIntroLicence,
  PupilLessonIntroReadyCard,
  PupilLessonIntroView,
} from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

jest.mock("@/components/PupilComponents/CopyrightNotice", () => ({
  CopyrightNotice: ({ isLegacyLicense }: { isLegacyLicense?: boolean }) => (
    <div data-testid="copyright-notice">{String(isLegacyLicense ?? false)}</div>
  ),
}));

describe("PupilLessonIntro", () => {
  it("renders the intro view slots and proceeds to the next section", async () => {
    const onProceed = jest.fn();
    const user = userEvent.setup();

    render(
      <PupilLessonIntroView
        phase="primary"
        topNavSlot={<div>Top nav</div>}
        readyToLearnSlot={<div>Ready card</div>}
        lessonInfoSlot={<div>Lesson info</div>}
        licenceSlot={<div>Licence text</div>}
        bottomNav={{ proceedLabel: "Start lesson", onProceed }}
      />,
    );

    expect(document.body).toHaveTextContent(
      "What will you need for this lesson?",
    );
    expect(document.body).toHaveTextContent("Top nav");
    expect(document.body).toHaveTextContent("Ready card");
    expect(document.body).toHaveTextContent("Lesson info");
    expect(document.body).toHaveTextContent("Licence text");

    await user.click(
      document.querySelector(
        '[data-testid="proceed-to-next-section"]',
      ) as HTMLElement,
    );

    expect(onProceed).toHaveBeenCalledTimes(1);
  });

  it("renders the additional file extension and formatted size", () => {
    render(
      <PupilLessonIntroAdditionalFileItem
        displayName="Worksheet"
        bytes={13456325}
        url="https://example.com/worksheet.pdf"
      />,
    );

    expect(document.body).toHaveTextContent("Worksheet");
    expect(document.body).toHaveTextContent("12.83 MB (PDF)");
  });

  it("renders the lesson info card content", () => {
    render(
      <PupilLessonIntroInfoCard title="Equipment" iconName="books">
        <p>Pencil and paper</p>
      </PupilLessonIntroInfoCard>,
    );

    expect(document.body).toHaveTextContent("Equipment");
    expect(document.body).toHaveTextContent("Pencil and paper");
  });

  it("renders the licence heading and passes the legacy flag through", () => {
    render(
      <PupilLessonIntroLicence
        heading="Lesson licence"
        isLegacyLicense={true}
      />,
    );

    expect(document.body).toHaveTextContent("Lesson licence");
    expect(
      document.querySelector('[data-testid="copyright-notice"]'),
    ).toHaveTextContent("true");
  });

  it("renders the ready card copy", () => {
    render(<PupilLessonIntroReadyCard />);

    expect(document.body).toHaveTextContent("Are you ready to learn?");
    expect(document.body).toHaveTextContent(
      "Are you sitting in a quiet space away from distractions?",
    );
    expect(document.body).toHaveTextContent(
      "Do you have all the equipment you need?",
    );
  });
});
