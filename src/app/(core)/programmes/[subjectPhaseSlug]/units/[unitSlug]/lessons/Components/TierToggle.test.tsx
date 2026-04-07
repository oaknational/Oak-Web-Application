import { screen } from "@testing-library/react";

import { TierToggle } from "./TierToggle";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { resolveOakHref } from "@/common-lib/urls";

const render = renderWithProviders();

describe("TierToggle", () => {
  it("renders nothing when tierSlug is null", () => {
    render(
      <TierToggle
        programmeSlug="maths-secondary-ks4-foundation"
        unitSlug="algebra"
        tierSlug={null}
      />,
    );

    expect(
      screen.queryByRole("heading", { name: "Learning tier (KS4)" }),
    ).not.toBeInTheDocument();
  });

  it("renders heading and both tier links when tierSlug is foundation", () => {
    render(
      <TierToggle
        programmeSlug="maths-secondary-ks4-foundation"
        unitSlug="algebra"
        tierSlug="foundation"
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

  it("marks Higher as current when tierSlug is higher", () => {
    render(
      <TierToggle
        programmeSlug="maths-secondary-ks4-higher"
        unitSlug="algebra"
        tierSlug="higher"
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

  it("leaves programme slug unchanged when the slug has no KS4 foundation/higher segment (KS3)", () => {
    const programmeSlug = "biology-secondary-ks3";

    render(
      <TierToggle
        programmeSlug={programmeSlug}
        unitSlug="cells"
        tierSlug="foundation"
      />,
    );

    const foundation = screen.getByRole("link", { name: "Foundation" });
    const higher = screen.getByRole("link", { name: "Higher" });
    const expected = resolveOakHref({
      page: "unit-page",
      subjectPhaseSlug: programmeSlug,
      unitSlug: "cells",
    });

    expect(foundation).toHaveAttribute("aria-current", "page");
    expect(foundation).toHaveAttribute("href", expected);
    expect(higher).toHaveAttribute("href", expected);
  });

  it("leaves programme slug unchanged when the KS4 option is not foundation or higher (e.g. exam board)", () => {
    const programmeSlug = "maths-secondary-ks4-aqa";

    render(
      <TierToggle
        programmeSlug={programmeSlug}
        unitSlug="algebra"
        tierSlug="higher"
      />,
    );

    const foundation = screen.getByRole("link", { name: "Foundation" });
    const higher = screen.getByRole("link", { name: "Higher" });
    const expected = resolveOakHref({
      page: "unit-page",
      subjectPhaseSlug: programmeSlug,
      unitSlug: "algebra",
    });

    expect(foundation).toHaveAttribute("href", expected);
    expect(higher).toHaveAttribute("aria-current", "page");
    expect(higher).toHaveAttribute("href", expected);
  });

  it("preserves exam board suffix when toggling combined science programme slug", () => {
    render(
      <TierToggle
        programmeSlug="combined-science-secondary-ks4-foundation-aqa"
        unitSlug="cells"
        tierSlug="foundation"
      />,
    );

    const higher = screen.getByRole("link", { name: "Higher" });
    expect(higher).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "unit-page",
        subjectPhaseSlug: "combined-science-secondary-ks4-higher-aqa",
        unitSlug: "cells",
      }),
    );
  });

  it("preserves exam board suffix when linking from higher combined science tier", () => {
    render(
      <TierToggle
        programmeSlug="combined-science-secondary-ks4-higher-aqa"
        unitSlug="cells"
        tierSlug="higher"
      />,
    );

    const foundation = screen.getByRole("link", { name: "Foundation" });
    expect(foundation).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "unit-page",
        subjectPhaseSlug: "combined-science-secondary-ks4-foundation-aqa",
        unitSlug: "cells",
      }),
    );
  });
});
