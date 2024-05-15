import { render } from "@testing-library/react";

import { BrowseTierSelector, TierData } from "./BrowseTierSelector";

import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";


describe("BrowseTierSelector", () => {
  const tiers: TierData[] = [
    {
      tier: "higher",
      tierSlug: "higher",
      tierDisplayOrder: 3,
      tierDescription: "Higher",
    },
    {
      tier: "core",
      tierSlug: "core",
      tierDisplayOrder: 2,
      tierDescription: "Core",
    },
    {
      tier: "foundation",
      tierSlug: "foundation",
      tierDisplayOrder: 1,
      tierDescription: "Foundation",
    },
  ];

  it("should render", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseTierSelector
          tiers={tiers}
          baseSlug="my-subject"
          isLegacy={false}
          phaseSlug="secondary"
        />
      </OakThemeProvider>,
    );
  });

  it("should render tiers with correct hrefs", () => {
    const { getByRole } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseTierSelector
          tiers={tiers}
          baseSlug="my-subject"
          isLegacy={false}
          phaseSlug="secondary"
        />
      </OakThemeProvider>,
    );

    for (const t of tiers) {
      const button = getByRole("a", { name: t.tier ?? "" });
      expect(button).toHaveAttribute(
        "href",
        `/pupils/beta/programmes/my-subject-${t.tierSlug}/units`,
      );
    }
  });

  it("should render legacy tiers with correct hrefs", () => {
    const { getByRole } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseTierSelector
          tiers={tiers}
          baseSlug="my-subject"
          isLegacy={true}
          phaseSlug="secondary"
        />
      </OakThemeProvider>,
    );

    for (const t of tiers) {
      const button = getByRole("a", { name: t.tier ?? "" });
      expect(button).toHaveAttribute(
        "href",
        `/pupils/beta/programmes/my-subject-${t.tierSlug}-l/units`,
      );
    }
  });

  it("should render examboard slug in the href if provided", () => {
    const { getByRole } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseTierSelector
          tiers={tiers}
          baseSlug="my-subject"
          examboardSlug="my-examboard"
          isLegacy={false}
          phaseSlug="secondary"
        />
      </OakThemeProvider>,
    );

    for (const t of tiers) {
      const button = getByRole("a", { name: t.tier ?? "" });
      expect(button).toHaveAttribute(
        "href",
        `/pupils/beta/programmes/my-subject-${t.tierSlug}-my-examboard/units`,
      );
    }
  });
});
