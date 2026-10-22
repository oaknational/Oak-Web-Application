import { screen } from "@testing-library/react";

import { NationalCurriculumInsightsConfidence } from "./Confidence";

import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
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
  cta: {
    label: "Explore curriculum plans",
    linkType: "external" as const,
    external:
      "https://www.thenational.academy/teachers/curriculum/history-primary/overview",
  },
};

it("renders editable content and the page's curriculum plans link", () => {
  renderWithTheme(<NationalCurriculumInsightsConfidence section={section} />);
  expect(
    screen.getByRole("region", { name: section.heading }),
  ).toHaveTextContent("Use Oak to refresh your curriculum.");
  expect(screen.getByRole("link", { name: section.cta.label })).toHaveAttribute(
    "href",
    section.cta.external,
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

it.each([
  {
    cta: {
      label: "Read the guidance",
      linkType: "internal" as const,
      internal: {
        id: "guidance",
        contentType: "newsPost" as const,
        slug: "curriculum-change",
      },
    },
    href: "/blog/curriculum-change",
  },
  {
    cta: {
      label: "Choose downloads",
      linkType: "anchor" as const,
      anchor: "downloads",
    },
    href: "#downloads",
  },
])("uses the shared link resolver for $cta.linkType CTAs", ({ cta, href }) => {
  renderWithTheme(
    <NationalCurriculumInsightsConfidence section={{ ...section, cta }} />,
  );
  expect(screen.getByRole("link", { name: cta.label })).toHaveAttribute(
    "href",
    href,
  );
});

it("keeps the supplied confetti artwork decorative", () => {
  const { container } = renderWithTheme(
    <NationalCurriculumInsightsConfidence section={section} />,
  );
  const images = [
    ...container.querySelectorAll('img[src*="confidence-confetti"]'),
  ];
  expect(images).toHaveLength(4);
  for (const [index, image] of images.entries()) {
    expect(image).toHaveAttribute(
      "src",
      getCloudinaryImageUrl(
        `ui-graphics/confidence-confetti-${["right", "middle", "left", "mobile"][index]}.svg`,
      ),
    );
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
    { ...section, cta: undefined },
    { ...section, cta: { ...section.cta, external: " " } },
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
