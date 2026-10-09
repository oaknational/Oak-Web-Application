import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  hubData,
  guidanceData,
  phaseData,
  subjectData,
} from "../../__fixtures__/stories";

import { NationalCurriculumInsightsKeyStageCards } from "./KeyStageCards";
import type { ContextualSectionProps } from "./shared";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { nationalCurriculumInsightsModuleSchema } from "@/common-lib/cms-types/nationalCurriculumInsights";

const section: ContextualSectionProps<"NationalCurriculumInsightsKeyStageCardsSection">["section"] =
  {
    __typename: "NationalCurriculumInsightsKeyStageCardsSection",
    cards: [
      { keyStage: "KS2", heading: "KS2 Science curriculum changes" },
      { keyStage: "KS1", heading: "KS1 Science curriculum changes" },
      { keyStage: "KS3", heading: "KS3 Science curriculum changes" },
      { keyStage: "KS4", heading: "KS4 Science curriculum changes" },
    ],
  };
const insightData: typeof phaseData = {
  ...phaseData,
  activeKeyStage: "KS1",
  route: {
    kind: "subjectPhaseKeyStage",
    subjectSlug: "science",
    phase: "primary",
    keyStageSlug: "key-stage-1",
  },
};

describe("National Curriculum Insights key-stage cards", () => {
  it("keeps the configured order and links only to available key stages in the current phase", () => {
    renderWithTheme(
      <NationalCurriculumInsightsKeyStageCards
        data={phaseData}
        section={section}
      />,
    );
    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(
      ["KS2 Science curriculum changes", "KS1 Science curriculum changes"],
    );
    expect(
      screen.getByRole("link", { name: "KS2 Science curriculum changes" }),
    ).toHaveAttribute(
      "href",
      "/teachers/national-curriculum-insights/science/primary/key-stage-2",
    );
  });

  it("links to all available sibling key stages across both phases without linking to the current page", () => {
    renderWithTheme(
      <NationalCurriculumInsightsKeyStageCards
        data={insightData}
        section={section}
      />,
    );
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(
      screen.queryByRole("link", { name: "KS1 Science curriculum changes" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "KS3 Science curriculum changes" }),
    ).toHaveAttribute(
      "href",
      "/teachers/national-curriculum-insights/science/secondary/key-stage-3",
    );
  });

  it("supports direct key-stage links from a configured subject overview", () => {
    renderWithTheme(
      <NationalCurriculumInsightsKeyStageCards
        data={subjectData}
        section={{ ...section, linkFromSubjectOverview: true }}
      />,
    );
    expect(screen.getAllByRole("link")).toHaveLength(4);
    expect(
      screen.getByRole("link", { name: "KS1 Science curriculum changes" }),
    ).toHaveAttribute(
      "href",
      "/teachers/national-curriculum-insights/science/primary/key-stage-1",
    );
  });

  it.each([hubData, guidanceData, subjectData])(
    "does not render without a subject or on an unconfigured overview",
    (data) => {
      const { container } = renderWithTheme(
        <NationalCurriculumInsightsKeyStageCards
          data={data}
          section={section}
        />,
      );
      expect(container).toBeEmptyDOMElement();
    },
  );

  it("does not link to missing key-stage pages", () => {
    const subject = phaseData.subject!;
    const { container } = renderWithTheme(
      <NationalCurriculumInsightsKeyStageCards
        data={{
          ...phaseData,
          subject: {
            ...subject,
            tabs: subject.tabs.map((tab) => ({
              ...tab,
              page: { ...tab.page, keyStages: [] },
            })),
          },
        }}
        section={section}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("does not render an empty list", () => {
    const { container } = renderWithTheme(
      <NationalCurriculumInsightsKeyStageCards
        data={phaseData}
        section={{ ...section, cards: [] }}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the optional heading without the old supporting copy", () => {
    renderWithTheme(
      <NationalCurriculumInsightsKeyStageCards
        data={insightData}
        section={{
          ...section,
          heading: "Read more about science curriculum changes",
          cards: section.cards.map((card) => ({
            ...card,
            linkLabel: "Read insights",
          })),
        }}
      />,
    );
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Read more about science curriculum changes",
      }),
    ).toBeVisible();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(screen.queryByText("Read insights")).not.toBeInTheDocument();
  });

  it.each([
    phaseData,
    { ...phaseData, activeTab: "secondary" as const },
    insightData,
    { ...insightData, activeKeyStage: "KS4" as const },
  ])(
    "loads decorative local illustrations for every configured key stage",
    (data) => {
      const { container } = renderWithTheme(
        <NationalCurriculumInsightsKeyStageCards
          data={data}
          section={section}
        />,
      );
      const images = container.querySelectorAll(
        'img[src*="curriculum-change-explained"]',
      );
      expect(images.length).toBeGreaterThan(0);
      images.forEach((image) => {
        expect(image).toHaveAttribute("alt", "");
        expect(image.closest('[aria-hidden="true"]')).not.toBeNull();
      });
    },
  );

  it("supports keyboard focus on each card", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <NationalCurriculumInsightsKeyStageCards
        data={phaseData}
        section={section}
      />,
    );
    const [ks2, ks1] = screen.getAllByRole("link");
    await user.tab();
    expect(ks2).toHaveFocus();
    await user.tab();
    expect(ks1).toHaveFocus();
  });

  it("accepts cards without obsolete link labels and retains the optional navigation settings", () => {
    expect(
      nationalCurriculumInsightsModuleSchema.parse({
        ...section,
        heading: "Read more",
        linkFromSubjectOverview: true,
      }),
    ).toEqual({
      ...section,
      heading: "Read more",
      linkFromSubjectOverview: true,
    });
    expect(
      nationalCurriculumInsightsModuleSchema.parse({
        ...section,
        cards: section.cards.map((card) => ({
          ...card,
          linkLabel: "Read insights",
        })),
      }),
    ).toEqual({
      ...section,
      cards: section.cards.map((card) => ({
        ...card,
        linkLabel: "Read insights",
      })),
    });
  });
});
