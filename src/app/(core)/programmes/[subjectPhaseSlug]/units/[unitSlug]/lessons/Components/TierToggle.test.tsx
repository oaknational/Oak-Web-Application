import { screen } from "@testing-library/react";

import { TierToggle } from "./TierToggle";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { resolveOakHref } from "@/common-lib/urls";
import { ProgrammeToggles } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";

const render = renderWithProviders();

const defaultToggles: ProgrammeToggles = [
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

describe("TierToggle", () => {
  it("renders nothing when there are no tier toggles", () => {
    render(<TierToggle unitSlug="algebra" tierOptionToggles={[]} />);

    expect(
      screen.queryByRole("heading", { name: "Learning tier (KS4)" }),
    ).not.toBeInTheDocument();
  });

  it("renders nothing when there is only one tier toggle option", () => {
    render(
      <TierToggle
        unitSlug="algebra"
        tierOptionToggles={[defaultToggles[0]!]}
      />,
    );

    expect(
      screen.queryByRole("heading", { name: "Learning tier (KS4)" }),
    ).not.toBeInTheDocument();
  });

  it("renders heading and links from tierOptionToggles", () => {
    render(
      <TierToggle unitSlug="algebra" tierOptionToggles={defaultToggles} />,
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
        subjectPhaseSlug: "maths-secondary-ks4-foundation",
        unitSlug: "algebra",
      }),
    );
    expect(higher).not.toHaveAttribute("aria-current");
    expect(higher).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "unit-page",
        subjectPhaseSlug: "maths-secondary-ks4-higher",
        unitSlug: "algebra",
      }),
    );
  });

  it("marks the selected option as current from data", () => {
    render(
      <TierToggle
        unitSlug="algebra"
        tierOptionToggles={[
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
    expect(foundation).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "unit-page",
        subjectPhaseSlug: "maths-secondary-ks4-foundation",
        unitSlug: "algebra",
      }),
    );
    expect(higher).toHaveAttribute("aria-current", "page");
    expect(higher).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "unit-page",
        subjectPhaseSlug: "maths-secondary-ks4-higher",
        unitSlug: "algebra",
      }),
    );
  });
});
