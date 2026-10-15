import { screen } from "@testing-library/react";

import { NationalCurriculumInsightsConfidence } from "./Confidence";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { nationalCurriculumInsightsModuleSchema } from "@/common-lib/cms-types/nationalCurriculumInsights";

const section = {
  __typename: "NationalCurriculumInsightsConfidenceSection" as const,
  heading: "Prepare with confidence using Oak",
  bodyPortableText: [
    {
      _type: "block",
      _key: "intro",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: "text",
          text: "Use Oak to refresh your curriculum.",
          marks: [],
        },
      ],
    },
  ],
  ctaLabel: "Explore curriculum plans",
  ctaHref: "/teachers/curriculum/history-primary/overview",
};

it("renders editable content and the page's curriculum plans link", () => {
  renderWithTheme(<NationalCurriculumInsightsConfidence section={section} />);
  expect(
    screen.getByRole("region", { name: section.heading }),
  ).toHaveTextContent("Use Oak to refresh your curriculum.");
  expect(screen.getByRole("link", { name: section.ctaLabel })).toHaveAttribute(
    "href",
    section.ctaHref,
  );
});

it("preserves rich-text emphasis and resolved internal links", () => {
  renderWithTheme(
    <NationalCurriculumInsightsConfidence
      section={{
        ...section,
        bodyPortableText: [
          {
            ...section.bodyPortableText[0]!,
            children: [
              {
                _type: "span",
                _key: "text",
                text: "our guidance",
                marks: ["strong", "guidance"],
              },
            ],
            markDefs: [
              {
                _type: "internalLink",
                _key: "guidance",
                reference: {
                  contentType: "newsPost",
                  slug: "curriculum-change",
                },
              },
            ],
          },
        ],
      }}
    />,
  );
  expect(screen.getByRole("link", { name: "our guidance" })).toHaveAttribute(
    "href",
    "/blog/curriculum-change",
  );
  expect(screen.getByText("our guidance").closest("strong")).not.toBeNull();
});

it("keeps the supplied confetti artwork decorative", () => {
  const { container } = renderWithTheme(
    <NationalCurriculumInsightsConfidence section={section} />,
  );
  const images = [
    ...container.querySelectorAll('img[src*="confidence-confetti"]'),
  ];
  expect(images).toHaveLength(4);
  for (const image of images) {
    expect(image).toHaveAttribute("alt", "");
    expect(image.closest('[aria-hidden="true"]')).not.toBeNull();
  }
});

it("rejects incomplete callouts before rendering", () => {
  expect(
    nationalCurriculumInsightsModuleSchema.safeParse(section).success,
  ).toBe(true);
  for (const invalid of [
    { ...section, heading: " " },
    { ...section, ctaLabel: " " },
    { ...section, ctaHref: " " },
    { ...section, bodyPortableText: [] },
    {
      ...section,
      bodyPortableText: [
        {
          ...section.bodyPortableText[0]!,
          children: [{ _type: "span", _key: "text", text: " ", marks: [] }],
        },
      ],
    },
  ]) {
    expect(
      nationalCurriculumInsightsModuleSchema.safeParse(invalid).success,
    ).toBe(false);
  }
});
