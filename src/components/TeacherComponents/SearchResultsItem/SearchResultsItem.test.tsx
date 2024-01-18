import { describe, expect, it } from "vitest";
import { act } from "react-dom/test-utils";

import SearchResultsItem from "./SearchResultsItem";

import elasticResponseFixture from "@/context/Search/elasticResponse.2020.fixture.json";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import searchPageFixture from "@/node-lib/curriculum-api/fixtures/searchPage.fixture";
import { searchResultsHitSchema } from "@/context/Search/search.schema";
import { getSearchHitObject } from "@/context/Search/search.helpers";

const searchResultClicked = vi.fn();

const allKeyStages = searchPageFixture().keyStages;
const hitLesson = searchResultsHitSchema.parse(
  elasticResponseFixture.hits.hits[0],
);
const hitUnit = searchResultsHitSchema.parse(
  elasticResponseFixture.hits.hits[3],
);
const legacyHit = { ...hitLesson, legacy: true };

const hitObjectLesson = getSearchHitObject(hitLesson, allKeyStages);
const hitObjectUnit = getSearchHitObject(hitUnit, allKeyStages);
const legacyHitObject = getSearchHitObject(legacyHit, allKeyStages);
const render = renderWithProviders();

describe("SearchResultsItem", () => {
  it("It renders a lesson title", () => {
    if (hitObjectLesson) {
      const { getByText } = render(<SearchResultsItem {...hitObjectLesson} />);
      expect(
        getByText("Dipping into Macbeth - Brave Macbeth (Part 2)"),
      ).toBeInTheDocument();
    } else {
      throw new Error("hitObjectLesson is undefined");
    }
  });
  it("It renders 'lesson' for a lesson hit in metadata", () => {
    if (hitObjectLesson) {
      const { getByText } = render(<SearchResultsItem {...hitObjectLesson} />);
      expect(getByText("Lesson")).toBeInTheDocument();
    } else {
      throw new Error("hitObjectLesson is undefined");
    }
  });
  it("It renders 'unit' for a unit hit in metadata", () => {
    if (hitObjectUnit) {
      const { getByText } = render(<SearchResultsItem {...hitObjectUnit} />);
      expect(getByText("Unit")).toBeInTheDocument();
    } else {
      throw new Error("hitObjectUnit is undefined");
    }
  });
  it("It renders 'new' tag for new content", () => {
    if (hitObjectUnit) {
      const { getByText } = render(<SearchResultsItem {...hitObjectUnit} />);
      expect(getByText("New")).toBeInTheDocument();
    } else {
      throw new Error("hitObjectUnit is undefined");
    }
  });
  it("It does not render 'new' tag for legacy content", () => {
    if (legacyHitObject) {
      const { queryByText } = render(
        <SearchResultsItem {...legacyHitObject} />,
      );
      expect(queryByText("New")).not.toBeInTheDocument();
    } else {
      throw new Error("legacyHitObject is undefined");
    }
  });
  it("It renders ks short code in meta data", () => {
    if (hitObjectUnit) {
      const { getByText } = render(<SearchResultsItem {...hitObjectUnit} />);
      expect(getByText("KS2")).toBeInTheDocument();
    } else {
      throw new Error("hitObjectUnit is undefined");
    }
  });
  it("It renders a lesson description", () => {
    if (hitObjectLesson) {
      const { getByText } = render(<SearchResultsItem {...hitObjectLesson} />);
      expect(
        getByText(
          /and Banquo. We will explore the characters' thoughts and feelings and how they respond when they encounter the witches./i,
        ),
      ).toBeInTheDocument();
    } else {
      throw new Error("hitObjectLesson is undefined");
    }
  });
  it("It renders a button with the correct text for lesson", () => {
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
  it("It renders a button with the correct text for unit", () => {
    if (hitObjectUnit) {
      const { queryByText } = render(<SearchResultsItem {...hitObjectUnit} />);
      const link = queryByText("See unit");
      expect(link).toBeInTheDocument();
    } else {
      throw new Error("hitObjectUnit is undefined");
    }
  });
  it("It renders a link with the correct aria label (unit)", () => {
    if (hitObjectUnit) {
      const { getByLabelText } = render(
        <SearchResultsItem {...hitObjectUnit} />,
      );
      const link = getByLabelText("English unit: Macbeth - Narrative writing");
      expect(link).toBeInTheDocument();
    } else {
      throw new Error("hitObjectUnit is undefined");
    }
  });
  it("It renders a link with the correct aria label (lesson)", () => {
    if (hitObjectLesson) {
      const { getByLabelText } = render(
        <SearchResultsItem {...hitObjectLesson} />,
      );
      const link = getByLabelText(
        "Drama lesson: Dipping into Macbeth - Brave Macbeth (Part 2)",
      );
      expect(link).toBeInTheDocument();
    } else {
      throw new Error("hitObjectLesson is undefined");
    }
  });
  it("It renders a link with the correct href (lesson)", () => {
    if (hitObjectLesson) {
      const { getByRole } = render(<SearchResultsItem {...hitObjectLesson} />);
      const link = getByRole("link");
      expect(link).toHaveAttribute(
        "href",
        "/teachers/programmes/drama-primary-ks2/units/dipping-into-shakespeare-da5e/lessons/dipping-into-macbeth-brave-macbeth-part-2-crvkad",
      );
    } else {
      throw new Error("hitObjectLesson is undefined");
    }
  });
  it("It renders a link with the correct href (unit)", () => {
    if (hitObjectUnit) {
      const { getByRole } = render(<SearchResultsItem {...hitObjectUnit} />);
      const link = getByRole("link");
      expect(link).toHaveAttribute(
        "href",
        "/teachers/programmes/english-primary-ks2/units/macbeth-narrative-writing-9566/lessons",
      );
    } else {
      throw new Error("hitObjectUnit is undefined");
    }
  });
  it("calls onclick with correct data if search hit is clicked", () => {
    if (hitObjectLesson) {
      const { getByText } = render(
        <SearchResultsItem
          {...hitObjectLesson}
          onClick={searchResultClicked}
        />,
      );
      const link = getByText("Dipping into Macbeth - Brave Macbeth (Part 2)");
      act(() => {
        link.click();
      });
      expect(searchResultClicked).toHaveBeenCalledWith({
        type: "lesson",
        title: "Dipping into Macbeth - Brave Macbeth (Part 2)",
        description: `In this lesson we are introduced to <mark class="highlighted">Macbeth</mark> and Banquo. We will explore the characters' thoughts and feelings and how they respond when they encounter the witches.`,
        subjectSlug: "drama",
        keyStageShortCode: "KS2",
        keyStageTitle: "Key stage 2",
        pupilLessonOutcome: "",
        keyStageSlug: "ks2",
        subjectTitle: "Drama",
        unitTitle: "Dipping into Shakespeare",
        onClick: searchResultClicked,
        pathways: [],
        buttonLinkProps: {
          page: "lesson-overview",
          lessonSlug: "dipping-into-macbeth-brave-macbeth-part-2-crvkad",
          programmeSlug: "drama-primary-ks2",
          unitSlug: "dipping-into-shakespeare-da5e",
        },
        legacy: undefined,
      });
    } else {
      throw new Error("hitObjectLesson is undefined");
    }
  });
});
