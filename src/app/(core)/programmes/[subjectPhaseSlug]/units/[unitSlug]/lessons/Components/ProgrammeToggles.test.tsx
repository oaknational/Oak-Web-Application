import { screen } from "@testing-library/react";

import { ProgrammeToggles } from "./ProgrammeToggles";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { resolveOakHref } from "@/common-lib/urls";
import { ProgrammeToggles as ProgrammeTogglesData } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";

const render = renderWithProviders();

const tierToggles: ProgrammeTogglesData = [
  {
    title: "Foundation",
    programmeSlug: "maths-secondary-ks4-foundation",
    isSelected: true,
  },
  {
    title: "Higher",
    programmeSlug: "maths-secondary-ks4-higher",
    isSelected: false,
  },
];

const subjectToggles: ProgrammeTogglesData = [
  {
    title: "Biology",
    programmeSlug: "biology-secondary-ks4-foundation-aqa",
    isSelected: true,
  },
  {
    title: "Combined science",
    programmeSlug: "combined-science-secondary-ks4-foundation-aqa",
    isSelected: false,
  },
];

describe("ProgrammeToggles", () => {
  it("renders nothing when there are no options", () => {
    render(
      <ProgrammeToggles
        heading="Learning tier (KS4)"
        headingId="tier-toggle-heading"
        unitSlug="algebra"
        programmeToggles={[]}
      />,
    );

    expect(
      screen.queryByRole("heading", { name: "Learning tier (KS4)" }),
    ).not.toBeInTheDocument();
  });

  it("renders nothing when there is only one option", () => {
    render(
      <ProgrammeToggles
        heading="Learning tier (KS4)"
        headingId="tier-toggle-heading"
        unitSlug="algebra"
        programmeToggles={[tierToggles[0]!]}
      />,
    );

    expect(
      screen.queryByRole("heading", { name: "Learning tier (KS4)" }),
    ).not.toBeInTheDocument();
  });

  it("renders tier heading and links", () => {
    render(
      <ProgrammeToggles
        heading="Learning tier (KS4)"
        headingId="tier-toggle-heading"
        unitSlug="algebra"
        programmeToggles={tierToggles}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Learning tier (KS4)" }),
    ).toBeInTheDocument();

    const foundation = screen.getByRole("link", { name: "Foundation" });
    const higher = screen.getByRole("link", { name: "Higher" });

    expect(foundation).toHaveAttribute("aria-current", "page");
    expect(foundation).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "unit-page",
        programmeSlug: "maths-secondary-ks4-foundation",
        unitSlug: "algebra",
      }),
    );
    expect(higher).not.toHaveAttribute("aria-current");
    expect(higher).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "unit-page",
        programmeSlug: "maths-secondary-ks4-higher",
        unitSlug: "algebra",
      }),
    );
  });

  it("renders subject heading and links", () => {
    render(
      <ProgrammeToggles
        heading="Exam subject (KS4)"
        headingId="subject-toggle-heading"
        unitSlug="cells"
        programmeToggles={subjectToggles}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Exam subject (KS4)" }),
    ).toBeInTheDocument();

    const biology = screen.getByRole("link", { name: "Biology" });
    const combinedScience = screen.getByRole("link", {
      name: "Combined science",
    });

    expect(biology).toHaveAttribute("aria-current", "page");
    expect(biology).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "unit-page",
        programmeSlug: "biology-secondary-ks4-foundation-aqa",
        unitSlug: "cells",
      }),
    );
    expect(combinedScience).not.toHaveAttribute("aria-current");
    expect(combinedScience).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "unit-page",
        programmeSlug: "combined-science-secondary-ks4-foundation-aqa",
        unitSlug: "cells",
      }),
    );
  });

  it("marks selected option as current from data", () => {
    render(
      <ProgrammeToggles
        heading="Learning tier (KS4)"
        headingId="tier-toggle-heading"
        unitSlug="algebra"
        programmeToggles={[
          {
            title: "Foundation",
            programmeSlug: "maths-secondary-ks4-foundation",
            isSelected: false,
          },
          {
            title: "Higher",
            programmeSlug: "maths-secondary-ks4-higher",
            isSelected: true,
          },
        ]}
      />,
    );

    const foundation = screen.getByRole("link", { name: "Foundation" });
    const higher = screen.getByRole("link", { name: "Higher" });

    expect(foundation).not.toHaveAttribute("aria-current");
    expect(higher).toHaveAttribute("aria-current", "page");
  });
});
