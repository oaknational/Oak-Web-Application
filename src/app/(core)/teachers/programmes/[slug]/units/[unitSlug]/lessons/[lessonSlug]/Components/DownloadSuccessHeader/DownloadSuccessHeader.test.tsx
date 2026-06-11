import { screen } from "@testing-library/dom";

import { DownloadSuccessHeader } from "./DownloadSuccessHeader";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const render = renderWithTheme;

jest.mock("@oaknational/oak-consent-client", () => ({
  __esModule: true,
  useOakConsent: () => ({
    getConsent: jest.fn().mockReturnValue("granted"),
  }),
}));

describe("DownloadSuccessHeader", () => {
  it("passes href to the back link", () => {
    const testHref = "/teachers/programmes/english/key-stage-3";
    render(<DownloadSuccessHeader href={testHref} returnTo="lesson" />);

    const backLink = screen.getByRole("link", { name: "Back to lesson" });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", testHref);
  });

  it("renders the success message", () => {
    render(<DownloadSuccessHeader href="/programmes" returnTo="lesson" />);

    expect(
      screen.getByRole("heading", { name: "Thanks for downloading!" }),
    ).toBeInTheDocument();
  });

  it("renders the feedback prompt", () => {
    render(<DownloadSuccessHeader href="/programmes" returnTo="lesson" />);

    expect(
      screen.getByText(
        /We hope you find the resources useful. Click the question mark/,
      ),
    ).toBeInTheDocument();
  });

  it("renders the font installation instructions", () => {
    render(<DownloadSuccessHeader href="/programmes" returnTo="lesson" />);

    expect(
      screen.getByRole("link", {
        name: /install the Google Fonts 'Lexend' and 'Kalam'/,
      }),
    ).toBeInTheDocument();
  });

  it("renders the font installation link with correct href", () => {
    render(<DownloadSuccessHeader href="/programmes" returnTo="lesson" />);

    const fontLink = screen.getByRole("link", {
      name: /install the Google Fonts 'Lexend' and 'Kalam'/,
    });
    expect(fontLink).toHaveAttribute(
      "href",
      "https://support.thenational.academy/how-to-install-the-google-fonts-lexend-and-kalan",
    );
    expect(fontLink).toHaveAttribute("target", "_blank");
  });
});
