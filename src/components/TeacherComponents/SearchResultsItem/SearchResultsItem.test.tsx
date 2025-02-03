import React from "react";

import SearchResultsItem from "./SearchResultsItem";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import searchPageFixture from "@/node-lib/curriculum-api-2023/fixtures/searchPage.fixture";
import { getSearchHitObject } from "@/context/Search/search.helpers";
import { LEGACY_COHORT } from "@/config/cohort";
import { hitsFixture } from "@/context/Search/search-api/2023/searchResults.fixture";

const searchResultClicked = vi.fn();

const allKeyStages = searchPageFixture().keyStages;
const hitLesson = hitsFixture.find((h) => h._source.type === "lesson");

const hitUnit = hitsFixture.find((h) => h._source.type === "unit");

if (!hitLesson) {
  throw new Error("Cannot find a lesson result");
}
if (!hitUnit) {
  throw new Error("Cannot find a unit result");
}

const legacyHit = {
  ...hitLesson,
  _source: { ...hitLesson._source, cohort: LEGACY_COHORT },
};

const hitObjectLesson = getSearchHitObject(hitLesson, allKeyStages);
const hitObjectUnit = getSearchHitObject(hitUnit, allKeyStages);
const legacyHitObject = getSearchHitObject(legacyHit, allKeyStages);
const render = renderWithProviders();

vi.mock("@/hooks/useMediaQuery.tsx", () => ({
  __esModule: true,
  default: () => ({
    isMobile: false,
  }),
}));

describe("SearchResultsItem", () => {
  test("It renders a lesson title", () => {
    if (hitObjectLesson) {
      const { getByText } = render(<SearchResultsItem {...hitObjectLesson} />);
      expect(
        getByText("The relationship between Macbeth and Lady Macbeth"),
      ).toBeInTheDocument();
    } else {
      throw new Error("hitObjectLesson is undefined");
    }
  });
  test("It renders 'lesson' for a lesson hit in metadata", () => {
    if (hitObjectLesson) {
      const { getByText } = render(<SearchResultsItem {...hitObjectLesson} />);
      expect(getByText("Lesson")).toBeInTheDocument();
    } else {
      throw new Error("hitObjectLesson is undefined");
    }
  });
  test("It renders 'unit' for a unit hit in metadata", () => {
    if (hitObjectUnit) {
      const { getByText } = render(<SearchResultsItem {...hitObjectUnit} />);
      expect(getByText("Unit")).toBeInTheDocument();
    } else {
      throw new Error("hitObjectUnit is undefined");
    }
  });
  test("It renders 'new' tag for new content", () => {
    if (hitObjectUnit) {
      const { getByText } = render(<SearchResultsItem {...hitObjectUnit} />);
      expect(getByText("New")).toBeInTheDocument();
    } else {
      throw new Error("hitObjectUnit is undefined");
    }
  });
  test("It does not render 'new' tag for legacy content", () => {
    if (legacyHitObject) {
      const { queryByText } = render(
        <SearchResultsItem {...legacyHitObject} />,
      );
      expect(queryByText("New")).not.toBeInTheDocument();
    } else {
      throw new Error("legacyHitObject is undefined");
    }
  });
  test("It renders ks short code in meta data", () => {
    if (hitObjectUnit) {
      const { getByText } = render(<SearchResultsItem {...hitObjectUnit} />);
      expect(getByText("KS4")).toBeInTheDocument();
    } else {
      throw new Error("hitObjectUnit is undefined");
    }
  });
  test("It renders a lesson description", () => {
    if (hitObjectLesson) {
      const { getByText } = render(<SearchResultsItem {...hitObjectLesson} />);
      expect(
        getByText(/I can describe the relationship between./i),
      ).toBeInTheDocument();
    } else {
      throw new Error("hitObjectLesson is undefined");
    }
  });
  test("It renders a button with the correct text for lesson", () => {
    if (hitObjectLesson) {
      const { queryByText } = render(
        <SearchResultsItem {...hitObjectLesson} />,
      );
      const link = queryByText("See lesson");
      expect(link).toBeInTheDocument();
    } else {
      throw new Error("hitObjectLesson is undefined");
    }
  });
  test("It renders a button with the correct text for unit", () => {
    if (hitObjectUnit) {
      const { queryByText } = render(<SearchResultsItem {...hitObjectUnit} />);
      const link = queryByText("See unit");
      expect(link).toBeInTheDocument();
    } else {
      throw new Error("hitObjectUnit is undefined");
    }
  });
  test("It renders a link with the correct aria label (unit)", () => {
    if (hitObjectUnit) {
      const { getByLabelText } = render(
        <SearchResultsItem {...hitObjectUnit} />,
      );
      const link = getByLabelText(
        "See unit: Macbeth: Lady Macbeth as a machiavellian villain",
      );
      expect(link).toBeInTheDocument();
    } else {
      throw new Error("hitObjectUnit is undefined");
    }
  });
  test("It renders a link with the correct aria label (lesson)", () => {
    if (hitObjectLesson) {
      const { getByLabelText } = render(
        <SearchResultsItem {...hitObjectLesson} />,
      );
      const link = getByLabelText(
        "See lesson: The relationship between Macbeth and Lady Macbeth",
      );
      expect(link).toBeInTheDocument();
    } else {
      throw new Error("hitObjectLesson is undefined");
    }
  });
  test("It renders a link with the correct href (lesson)", () => {
    if (hitObjectLesson) {
      const { getByRole } = render(<SearchResultsItem {...hitObjectLesson} />);
      const link = getByRole("link");
      expect(link).toHaveAttribute(
        "href",
        "/teachers/programmes/english-secondary-ks4-eduqas/units/macbeth-lady-macbeth-as-a-machiavellian-villain/lessons/the-relationship-between-macbeth-and-lady-macbeth",
      );
    } else {
      throw new Error("hitObjectLesson is undefined");
    }
  });
  test("It renders a link with the correct href (unit)", () => {
    if (hitObjectUnit) {
      const { getByRole } = render(<SearchResultsItem {...hitObjectUnit} />);
      const link = getByRole("link");
      expect(link).toHaveAttribute(
        "href",
        "/teachers/programmes/english-secondary-ks4-eduqas/units/macbeth-lady-macbeth-as-a-machiavellian-villain/lessons",
      );
    } else {
      throw new Error("hitObjectUnit is undefined");
    }
  });
  test("calls onclick with correct data if search hit is clicked", () => {
    if (hitObjectLesson) {
      const { getByText } = render(
        <SearchResultsItem
          {...hitObjectLesson}
          onClick={searchResultClicked}
        />,
      );
      const link = getByText("See lesson");

      link.click();

      expect(searchResultClicked).toHaveBeenCalledWith({
        type: "lesson",
        title: "The relationship between Macbeth and Lady Macbeth",
        description: "",
        subjectSlug: "english",
        keyStageShortCode: "KS4",
        keyStageTitle: "Key stage 4",
        yearTitle: "Year 10",
        pupilLessonOutcome:
          "I can describe the relationship between <b>Macbeth</b> and Lady <b>Macbeth</b>.",
        keyStageSlug: "ks4",
        subjectTitle: "English",
        unitTitle: "Macbeth: Lady Macbeth as a machiavellian villain",
        onClick: searchResultClicked,
        pathways: [],
        buttonLinkProps: {
          page: "lesson-overview",
          lessonSlug: "the-relationship-between-macbeth-and-lady-macbeth",
          programmeSlug: "english-secondary-ks4-eduqas",
          unitSlug: "macbeth-lady-macbeth-as-a-machiavellian-villain",
        },
        cohort: "2023-2024",
      });
    } else {
      throw new Error("hitObjectLesson is undefined");
    }
  });
});
