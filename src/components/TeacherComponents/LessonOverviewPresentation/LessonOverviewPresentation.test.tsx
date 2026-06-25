import { screen } from "@testing-library/dom";

import LessonOverviewPresentation from "./LessonOverviewPresentation";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("LessonOverviewPresentation", () => {
  it("renders a non-tabbable slide iframe to avoid focus traps", () => {
    render(
      <LessonOverviewPresentation
        asset="https://docs.google.com/presentation/d/1234567890/edit"
        title="Test lesson"
        isWorksheet={false}
      />,
    );

    const iframe = screen.getByTestId("overview-presentation");
    const focusTarget = screen.getByTestId(
      "overview-presentation-focus-target",
    );

    expect(iframe).toBeInTheDocument();
    expect(focusTarget).toBeInTheDocument();
    expect(focusTarget).toHaveAttribute("tabindex", "0");
    expect(iframe).toHaveAttribute("tabindex", "-1");
  });

  it("renders a fallback link to open the deck in Google Slides", () => {
    render(
      <LessonOverviewPresentation
        asset="https://docs.google.com/presentation/d/1234567890/edit"
        title="Test lesson"
        isWorksheet={false}
      />,
    );

    const linkButton = screen.getByTestId("open-presentation-in-google-slides");

    expect(linkButton).toBeInTheDocument();
    expect(linkButton).toHaveAttribute(
      "href",
      "https://docs.google.com/presentation/d/1234567890/edit",
    );
    expect(linkButton).toHaveAttribute("target", "_blank");
    expect(linkButton).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not render Google Slides fallback link for additional material", () => {
    render(
      <LessonOverviewPresentation
        asset="https://docs.google.com/document/d/1234567890/edit"
        title="Test lesson"
        isWorksheet={false}
        isAdditionalMaterial={true}
      />,
    );

    const iframe = screen.getByTestId("overview-presentation");

    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveProperty(
      "src",
      "https://docs.google.com/document/d/1234567890/pub?embedded=true",
    );
    expect(
      screen.queryByTestId("open-presentation-in-google-slides"),
    ).not.toBeInTheDocument();
  });
});
