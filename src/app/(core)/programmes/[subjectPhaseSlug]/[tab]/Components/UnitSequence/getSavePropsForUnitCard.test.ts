import { getSavePropsForUnitCard } from "./getSavePropsForUnitCard";

import {
  unitWithOptions,
  unitWithoutOptions,
} from "@/components/CurriculumComponents/CurricUnitCard/CurricUnitCard.fixtures";

describe("getSavePropsForUnitCard", () => {
  it("returns undefined when signed out", () => {
    const result = getSavePropsForUnitCard(unitWithoutOptions, false);
    expect(result).toBeUndefined();
  });
  it("returns valid save props when signed in", () => {
    const result = getSavePropsForUnitCard(unitWithoutOptions, true);

    expect(result).toEqual({
      unitSlug: "something-nice",
      unitTitle: "Something nice",
      programmeSlug: "transfiguration-primary-ks2",
      trackingProps: {
        savedFrom: "unit_listing_save_button",
        keyStageSlug: "ks2",
        keyStageTitle: "Key stage 2",
        subjectTitle: "Transfiguration",
        subjectSlug: "transfiguration",
      },
    });
  });
  it("should return undefined for optionality units", () => {
    const result = getSavePropsForUnitCard(unitWithOptions, true);
    expect(result).toBeUndefined();
  });
});
