import { screen } from "@testing-library/react";

import { NationalCurriculumInsightsPortableText } from "./NationalCurriculumInsightsPortableText";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import errorReporter from "@/common-lib/error-reporter";

jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default: jest.fn(() => jest.fn()),
}));

const content = (mark: Record<string, unknown>) => [
  {
    _type: "block",
    _key: "paragraph",
    style: "normal",
    children: [
      { _type: "span", _key: "before", text: "Read ", marks: [] },
      {
        _type: "span",
        _key: "link-text",
        text: "the guidance",
        marks: ["link"],
      },
      { _type: "span", _key: "after", text: " before planning.", marks: [] },
    ],
    markDefs: [{ _key: "link", ...mark }],
  },
];

describe("Insights Portable Text links", () => {
  it.each([
    [
      { contentType: "newsPost", slug: "curriculum-change" },
      "/blog/curriculum-change",
    ],
    [
      { contentType: "policyPage", slug: "privacy-policy" },
      "/legal/privacy-policy",
    ],
    [{ contentType: "homepage" }, "/"],
  ])("renders a resolved internal reference %j", (reference, href) => {
    renderWithTheme(
      <NationalCurriculumInsightsPortableText
        value={content({ _type: "internalLink", reference })}
      />,
    );
    expect(screen.getByRole("link", { name: "the guidance" })).toHaveAttribute(
      "href",
      href,
    );
    expect(screen.getByText(/before planning/).parentElement).toHaveTextContent(
      "Read the guidance before planning.",
    );
  });

  it.each([null, undefined, { _type: "reference", _ref: "unpublished" }])(
    "preserves text without exposing an unavailable target: %j",
    (reference) => {
      renderWithTheme(
        <NationalCurriculumInsightsPortableText
          value={content({ _type: "internalLink", reference })}
        />,
      );
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
      expect(
        screen.getByText("Read the guidance before planning."),
      ).toBeInTheDocument();
    },
  );

  it("preserves external links", () => {
    renderWithTheme(
      <NationalCurriculumInsightsPortableText
        value={content({ _type: "link", href: "https://example.com/guidance" })}
      />,
    );
    expect(screen.getByRole("link", { name: "the guidance" })).toHaveAttribute(
      "href",
      "https://example.com/guidance",
    );
  });

  it("retains text and reports an unsupported target type", () => {
    renderWithTheme(
      <NationalCurriculumInsightsPortableText
        value={content({
          _type: "internalLink",
          reference: { contentType: "unsupportedPage" },
        })}
      />,
    );
    expect(
      screen.getByText("Read the guidance before planning."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    const reporterIndex = jest
      .mocked(errorReporter)
      .mock.calls.findIndex(
        ([context]) => context === "NationalCurriculumInsightsPortableText",
      );
    const reporter =
      jest.mocked(errorReporter).mock.results[reporterIndex]?.value;
    expect(reporter).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ severity: "warning" }),
    );
  });
});
