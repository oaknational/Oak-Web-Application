import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { hubData } from "../../__fixtures__/stories";

import { NationalCurriculumInsightsSubjectLinks } from "./SubjectLinks";
import type { ContextualSectionProps } from "./shared";

import { nationalCurriculumInsightsSubjectHref } from "@/common-lib/urls/nationalCurriculumInsights";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { nationalCurriculumInsightsModuleSchema } from "@/common-lib/cms-types/nationalCurriculumInsights";

const section: ContextualSectionProps<"NationalCurriculumInsightsSubjectLinksSection">["section"] =
  {
    __typename: "NationalCurriculumInsightsSubjectLinksSection",
    heading: "Explore subject-by-subject curriculum changes",
    links: [
      { title: "History", subjectSlug: "history", iconName: "subject-history" },
      { title: "Science", subjectSlug: "science", iconName: "subject-science" },
    ],
  };

describe("National Curriculum Insights subject overview links", () => {
  it("links to subject overviews in the configured order", () => {
    renderWithTheme(
      <NationalCurriculumInsightsSubjectLinks
        section={section}
        data={hubData}
      />,
    );
    const navigation = screen.getByRole("navigation", {
      name: section.heading,
    });
    const links = within(navigation).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "History",
      "Science",
    ]);
    expect(links[0]).toHaveAttribute(
      "href",
      nationalCurriculumInsightsSubjectHref("history"),
    );
    expect(links[1]).toHaveAttribute(
      "href",
      nationalCurriculumInsightsSubjectHref("science"),
    );
    expect(
      within(navigation).getByRole("heading", { level: 2 }),
    ).toHaveTextContent(section.heading);
  });

  it("supports a different label and icon for the same destination", () => {
    const subject = hubData.subjects[0]!;
    renderWithTheme(
      <NationalCurriculumInsightsSubjectLinks
        data={{
          ...hubData,
          subjects: [{ ...subject, slug: "design-and-technology" }],
        }}
        section={{
          ...section,
          links: [
            {
              title: "Cooking and nutrition",
              subjectSlug: "design-and-technology",
              iconName: "subject-cooking-nutrition",
            },
            {
              title: "Design and technology",
              subjectSlug: "design-and-technology",
              iconName: "subject-design-technology",
            },
          ],
        }}
      />,
    );
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(
      screen.getByRole("link", { name: "Cooking and nutrition" }),
    ).toHaveAttribute(
      "href",
      nationalCurriculumInsightsSubjectHref("design-and-technology"),
    );
  });

  it("omits destinations missing from the available catalogue", () => {
    renderWithTheme(
      <NationalCurriculumInsightsSubjectLinks
        data={{
          ...hubData,
          subjects: hubData.subjects.filter(({ slug }) => slug !== "history"),
        }}
        section={section}
      />,
    );
    expect(
      screen.queryByRole("link", { name: "History" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Science" })).toBeVisible();
  });

  it.each([
    { links: [] },
    {
      links: [
        {
          title: "Unpublished",
          subjectSlug: "missing",
          iconName: "subject-science",
        },
      ],
    },
  ])("hides the section when no links can be shown", ({ links }) => {
    const { container } = renderWithTheme(
      <NationalCurriculumInsightsSubjectLinks
        data={hubData}
        section={{ ...section, links }}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("uses a decorative fallback for an unrecognised icon", () => {
    const { container } = renderWithTheme(
      <NationalCurriculumInsightsSubjectLinks
        data={hubData}
        section={{
          ...section,
          links: [{ ...section.links[1]!, iconName: "not-an-icon" }],
        }}
      />,
    );
    const icon = container.querySelector('img[src*="question-mark"]');
    expect(icon).toHaveAttribute("alt", "");
    expect(icon?.parentElement).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("link", { name: "Science" })).toBeVisible();
  });

  it("keeps each link in keyboard order", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <NationalCurriculumInsightsSubjectLinks
        data={hubData}
        section={section}
      />,
    );
    const [history, science] = screen.getAllByRole("link");
    await user.tab();
    expect(history).toHaveFocus();
    await user.tab();
    expect(science).toHaveFocus();
  });

  it("validates labels and CMS destinations", () => {
    expect(nationalCurriculumInsightsModuleSchema.parse(section)).toEqual(
      section,
    );
    expect(
      nationalCurriculumInsightsModuleSchema.safeParse({
        ...section,
        links: [
          { title: "", subjectSlug: "science", iconName: "subject-science" },
        ],
      }).success,
    ).toBe(false);
  });
});
