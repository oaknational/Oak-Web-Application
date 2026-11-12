import { screen, within } from "@testing-library/react";

import { NationalCurriculumInsightsUnchanged } from "./Unchanged";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { nationalCurriculumInsightsModuleSchema } from "@/common-lib/cms-types/nationalCurriculumInsights";

const block = (text: string, key: string, listItem?: string) => ({
  _type: "block",
  _key: key,
  style: "normal",
  listItem,
  level: listItem ? 1 : undefined,
  markDefs: [],
  children: [{ _type: "span", _key: "text", text, marks: [] }],
});
const section = {
  __typename: "NationalCurriculumInsightsUnchangedSection" as const,
  heading: "What's stayed the same in KS1 history?",
  contentPortableText: [
    block("Pupils will still:", "intro"),
    block("Learn about the past", "point-1", "bullet"),
    block("Use evidence", "point-2", "bullet"),
    block("Build on these approaches.", "closing"),
  ],
};

it("renders the introduction, semantic list and closing paragraph in editorial order", () => {
  renderWithTheme(<NationalCurriculumInsightsUnchanged section={section} />);
  const region = screen.getByRole("region", { name: section.heading });
  expect(
    within(region)
      .getAllByRole("listitem")
      .map((item) => item.textContent),
  ).toEqual(["Learn about the past", "Use evidence"]);
  expect(region.textContent).toBe(
    `${section.heading}Pupils will still:Learn about the pastUse evidenceBuild on these approaches.`,
  );
});

it("preserves emphasis and internal links inside the continuity content", () => {
  renderWithTheme(
    <NationalCurriculumInsightsUnchanged
      section={{
        ...section,
        contentPortableText: [
          {
            ...block("the guidance", "link"),
            children: [
              {
                _type: "span",
                _key: "text",
                text: "the guidance",
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
  expect(screen.getByRole("link", { name: "the guidance" })).toHaveAttribute(
    "href",
    "/blog/curriculum-change",
  );
  expect(screen.getByText("the guidance").closest("strong")).not.toBeNull();
});

it("rejects blank headings and continuity content", () => {
  expect(
    nationalCurriculumInsightsModuleSchema.safeParse(section).success,
  ).toBe(true);
  for (const value of [
    { ...section, heading: " " },
    { ...section, contentPortableText: [] },
    { ...section, contentPortableText: [block(" ", "empty")] },
  ])
    expect(
      nationalCurriculumInsightsModuleSchema.safeParse(value).success,
    ).toBe(false);
});
