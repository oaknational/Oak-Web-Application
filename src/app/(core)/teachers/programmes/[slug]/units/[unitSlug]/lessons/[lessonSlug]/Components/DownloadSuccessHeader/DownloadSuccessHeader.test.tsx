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

  it("renders the large layout with a hero image when showCompactHeader is not set", () => {
    render(<DownloadSuccessHeader href="/programmes" returnTo="lesson" />);

    expect(screen.getByTestId("hero-image")).toBeInTheDocument();
  });

  it("renders the compact layout without a hero image when showCompactHeader is true", () => {
    render(
      <DownloadSuccessHeader
        href="/programmes"
        returnTo="lesson"
        showCompactHeader
      />,
    );

    expect(screen.queryByTestId("hero-image")).not.toBeInTheDocument();
  });

  it("renders the back link as a button when no href is passed", () => {
    const onBackClick = jest.fn();
    render(
      <DownloadSuccessHeader returnTo="lesson" onBackClick={onBackClick} />,
    );

    const backButton = screen.getByRole("button", { name: "Back to lesson" });
    expect(backButton).not.toHaveAttribute("href");

    backButton.click();
    expect(onBackClick).toHaveBeenCalled();
  });
});
