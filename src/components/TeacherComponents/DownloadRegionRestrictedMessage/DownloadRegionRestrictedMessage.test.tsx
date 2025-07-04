import { DownloadRegionRestrictedMessage } from "./DownloadRegionRestrictedMessage";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const render = renderWithTheme;

describe("DownloadRegionRestrictedMessage", () => {
  const mockHref = "/teachers/lessons/test-lesson";

  it("renders the main heading", () => {
    const { getByRole } = render(
      <DownloadRegionRestrictedMessage href={mockHref} />,
    );

    expect(
      getByRole("heading", {
        name: "Sorry, downloads for this lesson are only available in the UK",
      }),
    ).toBeInTheDocument();
  });

  it("renders the contact us link", () => {
    const { getByRole } = render(
      <DownloadRegionRestrictedMessage href={mockHref} />,
    );

    const contactLink = getByRole("link", { name: "contact us." });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", "/contact-us");
  });

  it("renders the back to lesson button with correct href", () => {
    const { getByRole } = render(
      <DownloadRegionRestrictedMessage href={mockHref} />,
    );

    const backButton = getByRole("link", { name: /back to lesson/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute("href", mockHref);
  });
});
