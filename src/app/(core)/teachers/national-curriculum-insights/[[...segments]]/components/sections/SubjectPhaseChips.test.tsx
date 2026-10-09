import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { hubData, phaseData, subjectData } from "../../__fixtures__/stories";

import { NationalCurriculumInsightsSubjectNavigation } from "./SubjectNavigation";
import { NationalCurriculumInsightsSubjectPhaseChips } from "./SubjectPhaseChips";
import type { ContextualSectionProps } from "./shared";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  nationalCurriculumInsightsSubjectPhaseHref,
  nationalCurriculumInsightsSubjectPhaseKeyStageHref,
} from "@/common-lib/urls/nationalCurriculumInsights";

type Props =
  ContextualSectionProps<"NationalCurriculumInsightsSubjectNavigationSection">;
const section: Props["section"] = {
  __typename: "NationalCurriculumInsightsSubjectNavigationSection",
  variant: "phaseChips",
  heading: "See what's changing in your subject",
  phases: ["primary", "secondary"],
  primaryHeading: "Primary",
  secondaryHeading: "Secondary",
};
const science = hubData.subjects[0]!;
const customData: Props["data"] = {
  ...hubData,
  hub: {
    ...hubData.hub!,
    phaseLinks: [
      {
        title: "Science alias",
        subjectSlug: science.slug,
        phase: "secondary",
        iconName: "subject-cooking-nutrition",
      },
      { title: science.title, subjectSlug: science.slug, phase: "primary" },
    ],
  },
};

it.each([hubData, subjectData, phaseData])(
  "shows the available phases regardless of the current page",
  (data) => {
    renderWithTheme(
      <NationalCurriculumInsightsSubjectPhaseChips
        section={section}
        data={data}
      />,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      section.heading!,
    );
    for (const phase of section.phases) {
      const nav = screen.getByRole("navigation", {
        name: phase === "primary" ? "Primary" : "Secondary",
      });
      expect(
        within(nav).getByRole("link", { name: `${science.title} ${phase}` }),
      ).toHaveAttribute(
        "href",
        nationalCurriculumInsightsSubjectPhaseHref(science.slug, phase),
      );
    }
  },
);

it("uses configured ordering, aliases and icons without changing the destination", () => {
  renderWithTheme(
    <NationalCurriculumInsightsSubjectPhaseChips
      section={{ ...section, phases: ["secondary", "primary"] }}
      data={customData}
    />,
  );
  expect(screen.getAllByRole("navigation")[0]).toHaveAccessibleName(
    "Secondary",
  );
  const link = screen.getByRole("link", { name: "Science alias secondary" });
  expect(link).toHaveAttribute(
    "href",
    nationalCurriculumInsightsSubjectPhaseHref(science.slug, "secondary"),
  );
  expect(link.querySelector("img")).toHaveAttribute(
    "src",
    expect.stringContaining("cooking-nutrition.svg"),
  );
  expect(
    link.querySelector("img")?.closest('[aria-hidden="true"]'),
  ).not.toBeNull();
  expect(link).toHaveStyle({ "padding-left": "0.75rem" });
  expect(link.querySelector("img")?.parentElement).toHaveStyle({
    width: "3rem",
  });
});

it("preserves the order of configured links within a phase", () => {
  const links = customData.hub!.phaseLinks!;
  renderWithTheme(
    <NationalCurriculumInsightsSubjectPhaseChips
      section={section}
      data={{
        ...customData,
        hub: {
          ...customData.hub!,
          phaseLinks: [
            { ...links[1]!, title: "First" },
            { ...links[1]!, title: "Second" },
          ],
        },
      }}
    />,
  );
  expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual([
    "First primary",
    "Second primary",
  ]);
});

it("omits missing subjects and phases with no available destination", () => {
  renderWithTheme(
    <NationalCurriculumInsightsSubjectPhaseChips
      section={section}
      data={{
        ...customData,
        subjects: [
          {
            ...science,
            tabs: science.tabs.filter(({ kind }) => kind === "primary"),
          },
        ],
        hub: {
          ...customData.hub!,
          phaseLinks: [
            ...customData.hub!.phaseLinks!,
            { title: "Missing", subjectSlug: "missing", phase: "primary" },
          ],
        },
      }}
    />,
  );
  expect(
    screen.queryByRole("navigation", { name: "Secondary" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("link", { name: /Missing/ }),
  ).not.toBeInTheDocument();
  expect(screen.getAllByRole("link")).toHaveLength(1);
});

it("does not fall back to catalogue links when the configured list is empty", () => {
  const { container } = renderWithTheme(
    <NationalCurriculumInsightsSubjectPhaseChips
      section={section}
      data={{
        ...customData,
        hub: { ...customData.hub!, phaseLinks: [] },
      }}
    />,
  );
  expect(container).toBeEmptyDOMElement();
});

it("links directly to a configured key stage and hides unavailable destinations", () => {
  renderWithTheme(
    <NationalCurriculumInsightsSubjectPhaseChips
      section={section}
      data={{
        ...customData,
        subjects: [
          {
            ...science,
            tabs: science.tabs.map((tab) => ({
              ...tab,
              page: { ...tab.page, availableKeyStages: ["KS2"] },
            })),
          },
        ],
        hub: {
          ...customData.hub!,
          phaseLinks: [
            {
              title: "French",
              subjectSlug: science.slug,
              phase: "primary",
              keyStage: "KS2",
            },
            {
              title: "Missing key stage",
              subjectSlug: science.slug,
              phase: "primary",
              keyStage: "KS1",
            },
            {
              title: "Wrong phase",
              subjectSlug: science.slug,
              phase: "secondary",
              keyStage: "KS2",
            },
          ],
        },
      }}
    />,
  );
  expect(screen.getByRole("link", { name: "French primary" })).toHaveAttribute(
    "href",
    nationalCurriculumInsightsSubjectPhaseKeyStageHref(
      science.slug,
      "primary",
      "key-stage-2",
    ),
  );
  expect(screen.getAllByRole("link")).toHaveLength(1);
});

it("falls back to the catalogue for absent configuration and an unknown icon", () => {
  renderWithTheme(
    <NationalCurriculumInsightsSubjectPhaseChips
      section={section}
      data={{
        ...customData,
        hub: {
          ...customData.hub!,
          phaseLinks: [
            {
              title: science.title,
              subjectSlug: science.slug,
              phase: "primary",
              iconName: "not-an-oak-icon",
            },
          ],
        },
      }}
    />,
  );
  expect(screen.getByRole("link").querySelector("img")).toHaveAttribute(
    "src",
    expect.stringContaining("science.svg"),
  );
});

it("exposes keyboard-focusable links and distinct navigation headings", async () => {
  const user = userEvent.setup();
  renderWithTheme(
    <NationalCurriculumInsightsSubjectPhaseChips
      section={section}
      data={customData}
    />,
  );
  const links = screen.getAllByRole("link");
  await user.tab();
  expect(links[0]).toHaveFocus();
  await user.tab();
  expect(links[1]).toHaveFocus();
});

it("selects the new layout only when configured", () => {
  const { rerender } = renderWithTheme(
    <NationalCurriculumInsightsSubjectNavigation
      section={section}
      data={subjectData}
    />,
  );
  expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  rerender(
    <NationalCurriculumInsightsSubjectNavigation
      section={{ ...section, variant: null }}
      data={subjectData}
    />,
  );
  expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  expect(screen.getByRole("navigation")).toHaveAccessibleName(
    "Explore curriculum changes by subject",
  );
});
