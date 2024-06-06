import { render } from "@testing-library/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { BrowseTierSelector, TierData } from "./BrowseTierSelector";

describe("BrowseTierSelector", () => {
  const tiers: TierData[] = [
    {
      tier: "higher",
      tierSlug: "higher",
      tierDisplayOrder: 3,
      tierDescription: "Higher",
      isLegacy: false,
    },
    {
      tier: "core",
      tierSlug: "core",
      tierDisplayOrder: 2,
      tierDescription: "Core",
      isLegacy: false,
    },
    {
      tier: "foundation",
      tierSlug: "foundation",
      tierDisplayOrder: 1,
      tierDescription: "Foundation",
      isLegacy: false,
    },
  ];

  it("should render", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseTierSelector
          tiers={tiers}
          baseSlug="my-subject"
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
          phaseSlug="secondary"
        />
      </OakThemeProvider>,
    );

    for (const t of tiers) {
      const button = getByRole("link", { name: t.tierDescription ?? "" });
      expect(button).toHaveAttribute(
        "href",
        `/pupils/programmes/my-subject-${t.tierSlug}/units`,
      );
    }
  });

  it.skip("should render legacy tiers with correct hrefs", () => {
    const { getByRole } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <BrowseTierSelector
          tiers={tiers}
          baseSlug="my-subject"
          phaseSlug="secondary"
        />
      </OakThemeProvider>,
    );

    for (const t of tiers) {
      const button = getByRole("link", { name: t.tierDescription ?? "" });
      expect(button).toHaveAttribute(
        "href",
        `/pupils/programmes/my-subject-${t.tierSlug}-l/units`,
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
          phaseSlug="secondary"
        />
      </OakThemeProvider>,
    );

    for (const t of tiers) {
      const button = getByRole("link", { name: t.tierDescription ?? "" });
      expect(button).toHaveAttribute(
        "href",
        `/pupils/programmes/my-subject-${t.tierSlug}-my-examboard/units`,
      );
    }
  });
});
