import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import UnitListItem from "./UnitListItem";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const props = {
  title: "Numbers and numerals",
  nullTitle: "Numbers and numerals",
  slug: "numbers-and-numerals",
  themeTitle: "Circles",
  themeSlug: "circles",
  lessonCount: 5,
  index: 3,
  expired: false,
  expiredLessonCount: 2,
  subjectSlug: "maths",
  subjectTitle: "Maths",
  keyStageSlug: "ks1",
  keyStageTitle: "Key stage 1",
  quizCount: 3,
  programmeSlug: "maths--primary-ks1-l",
  hitCount: 10,
  fromSearchPage: false,
  currentPage: 1,
  yearTitle: "Year 1",
  learningThemes: [
    {
      themeTitle: "Circles",
      themeSlug: "circles",
    },
  ],
};

const unitSelected = jest.fn();
const searchResultClicked = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      unitSelected: (...args: unknown[]) => unitSelected(...args),
      searchResultClicked: (...args: unknown[]) => searchResultClicked(...args),
    },
  }),
}));

const render = renderWithProviders();

describe("Unit List Item", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("It uses singular  form of lesson", () => {
    const singular = Object.assign({}, props);
    singular.lessonCount = 1;
    singular.expiredLessonCount = 0;
    render(<UnitListItem {...singular} />);

    const lessonCountText = screen.getByText("1 lesson");
    expect(lessonCountText).toBeInTheDocument();
  });

  test("It uses plural form of lessons", () => {
    const plural = Object.assign({}, props);
    plural.expiredLessonCount = 0;
    render(<UnitListItem {...plural} />);

    const lessonCountText = screen.getByText("5 lessons");
    expect(lessonCountText).toBeInTheDocument();
  });

  test("It calls tracking.unitSelected with correct props when clicked", async () => {
    const { getByText } = render(<UnitListItem {...props} />);

    const unit = getByText("Numbers and numerals");

    const user = userEvent.setup();

    await user.click(unit);

    expect(unitSelected).toHaveBeenCalledTimes(1);
    expect(searchResultClicked).not.toBeCalled();
    expect(unitSelected).toHaveBeenCalledWith({
      keyStageTitle: "Key stage 1",
      keyStageSlug: "ks1",
      analyticsUseCase: null,
      subjectTitle: "Maths",
      subjectSlug: "maths",
      unitName: "Numbers and numerals",
      unitSlug: "numbers-and-numerals",
    });
  });

  test("It calls tracking.searchResultClicked with correct props when clicked", async () => {
    const { getByText } = render(
      <UnitListItem {...{ ...props, fromSearchPage: true }} />,
    );

    const unit = getByText("Numbers and numerals");

    const user = userEvent.setup();

    await user.click(unit);

    expect(searchResultClicked).toHaveBeenCalledTimes(1);
    expect(unitSelected).not.toBeCalled();
    expect(searchResultClicked).toHaveBeenCalledWith({
      keyStageTitle: "Key stage 1",
      keyStageSlug: "ks1",
      analyticsUseCase: "Teacher",
      subjectTitle: "Maths",
      subjectSlug: "maths",
      unitName: "Numbers and numerals",
      unitSlug: "numbers-and-numerals",
      lessonName: undefined,
      lessonSlug: undefined,
      searchFilterOptionSelected: [],
      searchRank: 4,
      searchResultCount: 10,
      searchResultType: "unit",
    });
  });
});
