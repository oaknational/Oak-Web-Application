import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  guidanceData,
  hubData,
  phaseData,
  subjectData,
} from "../../__fixtures__/stories";

import { NationalCurriculumInsightsPhaseCards } from "./PhaseCards";
import type { ContextualSectionProps } from "./shared";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const section: ContextualSectionProps<"NationalCurriculumInsightsPhaseCardsSection">["section"] =
  {
    __typename: "NationalCurriculumInsightsPhaseCardsSection",
    cards: [
      { phase: "secondary", heading: "Secondary Science curriculum changes" },
      { phase: "primary", heading: "Primary Science curriculum changes" },
    ],
  };

describe("National Curriculum Insights phase cards", () => {
  it("keeps the configured order and links to available phase pages", () => {
    renderWithTheme(
      <NationalCurriculumInsightsPhaseCards
        data={subjectData}
        section={section}
      />,
    );

    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(
      [
        "Secondary Science curriculum changes",
        "Primary Science curriculum changes",
      ],
    );
    expect(
      screen.getByRole("link", { name: "Primary Science curriculum changes" }),
    ).toHaveAttribute(
      "href",
      "/teachers/national-curriculum-insights/science/primary",
    );
    expect(
      screen.getByRole("link", {
        name: "Secondary Science curriculum changes",
      }),
    ).toHaveAttribute(
      "href",
      "/teachers/national-curriculum-insights/science/secondary",
    );
  });

  it("does not show the phase currently being viewed", () => {
    renderWithTheme(
      <NationalCurriculumInsightsPhaseCards
        data={phaseData}
        section={section}
      />,
    );

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(
      screen.getByRole("link", {
        name: "Secondary Science curriculum changes",
      }),
    ).toBeVisible();
  });

  it("does not link to a missing phase", () => {
    renderWithTheme(
      <NationalCurriculumInsightsPhaseCards
        data={{
          ...subjectData,
          subject: {
            ...subjectData.subject!,
            tabs: subjectData.subject!.tabs.filter(
              ({ kind }) => kind === "primary",
            ),
          },
        }}
        section={section}
      />,
    );

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: "Primary Science curriculum changes" }),
    ).toBeVisible();
  });

  it.each([hubData, guidanceData])(
    "does not render without a subject",
    (data) => {
      const { container } = renderWithTheme(
        <NationalCurriculumInsightsPhaseCards data={data} section={section} />,
      );
      expect(container).toBeEmptyDOMElement();
    },
  );

  it("does not render phase cards on a key-stage page", () => {
    const { container } = renderWithTheme(
      <NationalCurriculumInsightsPhaseCards
        data={{
          ...phaseData,
          activeKeyStage: "KS1",
          route: {
            kind: "subjectPhaseKeyStage",
            subjectSlug: "science",
            phase: "primary",
            keyStageSlug: "key-stage-1",
          },
        }}
        section={section}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("does not render an empty card list or unavailable destinations", () => {
    const { container } = renderWithTheme(
      <NationalCurriculumInsightsPhaseCards
        data={subjectData}
        section={{ ...section, cards: [] }}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("removes the old supporting copy and keeps illustrations decorative", () => {
    const { container } = renderWithTheme(
      <NationalCurriculumInsightsPhaseCards
        data={subjectData}
        section={{
          ...section,
          cards: section.cards.map((card) => ({
            ...card,
            linkLabel: "Read insights",
          })),
        }}
      />,
    );
    expect(screen.queryByText("Read insights")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(
      container.querySelector(
        'img[src$="/images/curriculum-change-explained/secondary.svg"]',
      ),
    ).toHaveAttribute("alt", "");
  });

  it("supports keyboard focus on each link", async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <NationalCurriculumInsightsPhaseCards
        data={subjectData}
        section={section}
      />,
    );
    const [secondary, primary] = screen.getAllByRole("link");

    await user.tab();
    expect(secondary).toHaveFocus();
    await user.tab();
    expect(primary).toHaveFocus();
  });
});
