import { PupilLessonIntroLicence } from "./PupilLessonIntroLicence";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

jest.mock("@/components/PupilComponents/CopyrightNotice", () => ({
  CopyrightNotice: ({ isLegacyLicense }: { isLegacyLicense?: boolean }) => (
    <div data-testid="copyright-notice">{String(isLegacyLicense)}</div>
  ),
}));

describe("PupilLessonIntroLicence", () => {
  it("renders the heading and passes through the legacy licence flag", () => {
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
});
