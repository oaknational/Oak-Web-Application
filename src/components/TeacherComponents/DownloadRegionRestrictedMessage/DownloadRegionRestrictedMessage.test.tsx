import { DownloadRegionRestrictedMessage } from "./DownloadRegionRestrictedMessage";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

const props = {
  lessonName: "Test Lesson",
  lessonSlug: "test-lesson",
  lessonReleaseDate: "2023-10-01",
  href: "/teachers/lessons/test-lesson",
  isLegacy: false,
};
describe("DownloadRegionRestrictedMessage", () => {
  it("renders the main heading", () => {
    const { getByRole } = render(
      <DownloadRegionRestrictedMessage {...props} />,
    );

    expect(
      getByRole("heading", {
        name: "Sorry, downloads for this lesson are only available in the UK",
      }),
    ).toBeInTheDocument();
  });

  it("renders the contact us link", () => {
    const { getByRole } = render(
      <DownloadRegionRestrictedMessage {...props} />,
    );

    const contactLink = getByRole("link", { name: "contact us." });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", "/contact-us");
  });

  it("renders the back to lesson button with correct href", () => {
    const { getByRole } = render(
      <DownloadRegionRestrictedMessage {...props} />,
    );

    const backButton = getByRole("link", { name: /back to lesson/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute("href", "/teachers/lessons/test-lesson");
  });
});
