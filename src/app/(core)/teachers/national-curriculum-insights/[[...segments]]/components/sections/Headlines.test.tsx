import { screen } from "@testing-library/react";

import {
  phaseData,
  storyPortableText,
  subjectData,
} from "../../__fixtures__/stories";
import type { NationalCurriculumInsightsRouteData } from "../../helpers/getRouteData";

import { NationalCurriculumInsightsHeadlines } from "./Headlines";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import type { NationalCurriculumInsightsModule } from "@/common-lib/cms-types/nationalCurriculumInsights";

const section: Extract<
  NationalCurriculumInsightsModule,
  { __typename: "NationalCurriculumInsightsOverviewSection" }
> = {
  __typename: "NationalCurriculumInsightsOverviewSection",
  heading: "The headlines in 60 seconds",
  bodyPortableText: storyPortableText("An editorial summary of the changes."),
  quote: {
    quote: "I'm looking forward to clearer progression.",
    attribution: "Science subject lead",
    role: "Science Subject Lead",
    image: {
      asset: {
        _id: "image-portrait-1000x1000-png",
        url: "https://example.com/portrait.png",
      },
      isPresentational: true,
    },
  },
};

describe("NationalCurriculumInsightsHeadlines", () => {
  it("renders the editable summary and subject lead details with semantic headings", () => {
    const { container } = renderWithTheme(
      <NationalCurriculumInsightsHeadlines
        data={subjectData}
        section={section}
      />,
    );

    expect(
      screen.getByRole("region", { name: section.heading }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveStyle({
      "font-size": "2rem",
      "line-height": "2.5rem",
    });
    expect(
      screen.getByText("An editorial summary of the changes."),
    ).toHaveStyle({ "font-size": "1.125rem", "line-height": "1.75rem" });
    expect(container.querySelector("blockquote")).toHaveTextContent(
      section.quote!.quote,
    );
    expect(screen.getByText(section.quote!.attribution)).toBeInTheDocument();
    expect(screen.getByText(section.quote!.role!)).toBeInTheDocument();
    const portrait = screen.getByRole("presentation");
    const url = new URL(portrait.getAttribute("src")!, "http://localhost");
    expect(url.searchParams.get("url") ?? url.href).toBe(
      "https://example.com/portrait.png",
    );
    expect(portrait.parentElement).toHaveStyle({
      "border-radius": "6.25rem",
      overflow: "hidden",
      width: "3.5rem",
      height: "3.5rem",
    });
    expect(screen.queryByText("At a glance")).not.toBeInTheDocument();
  });

  it.each([
    { data: subjectData, border: "#fbd60e", accent: "#ffe555" },
    { data: phaseData, border: "#93e892", accent: "#bef2bd" },
    {
      data: {
        ...phaseData,
        route: {
          kind: "subjectPhaseKeyStage",
          subjectSlug: "science",
          phase: "primary",
          keyStageSlug: "key-stage-1",
        },
      } as NationalCurriculumInsightsRouteData,
      border: "#7c9aec",
      accent: "#a0b6f2",
    },
  ])(
    "uses the page hierarchy's border and quote colours",
    ({ data, border, accent }) => {
      const { container } = renderWithTheme(
        <NationalCurriculumInsightsHeadlines data={data} section={section} />,
      );
      expect(screen.getByRole("region", { name: section.heading })).toHaveStyle(
        { "border-color": border },
      );
      expect(
        container.querySelector("blockquote")?.firstElementChild,
      ).toHaveStyle({ "background-color": accent, width: "0.5rem" });
    },
  );

  it.each([undefined, null])(
    "keeps existing summaries readable without a quote",
    (quote) => {
      const { container } = renderWithTheme(
        <NationalCurriculumInsightsHeadlines
          data={subjectData}
          section={{ ...section, quote }}
        />,
      );
      expect(
        screen.getByText("An editorial summary of the changes."),
      ).toBeInTheDocument();
      expect(container.querySelector("blockquote")).toBeNull();
      expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
    },
  );

  it("does not invent a portrait or role when those fields are missing", () => {
    renderWithTheme(
      <NationalCurriculumInsightsHeadlines
        data={subjectData}
        section={{
          ...section,
          quote: {
            quote: section.quote!.quote,
            attribution: section.quote!.attribution,
          },
        }}
      />,
    );
    expect(screen.getByText(section.quote!.attribution)).toBeInTheDocument();
    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
    expect(screen.queryByText(section.quote!.role!)).not.toBeInTheDocument();
  });
});
