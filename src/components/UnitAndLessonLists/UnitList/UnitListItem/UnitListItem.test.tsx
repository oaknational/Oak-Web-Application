import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../../../__tests__/__helpers__/renderWithProviders";

import UnitListItem from "./UnitListItem";

const props = {
  title: "Numbers and numerals",
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
};

const unitSelected = jest.fn();
jest.mock("../../../../context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      unitSelected: (...args: unknown[]) => unitSelected(...args),
    },
  }),
}));

describe("Unit List Item", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("It calls tracking.unitSelected with correct props when clicked", async () => {
    const { getByText } = renderWithProviders(<UnitListItem {...props} />);

    const unit = getByText("Circles");

    const user = userEvent.setup();
    await user.click(unit);

    expect(unitSelected).toHaveBeenCalledTimes(1);
    expect(unitSelected).toHaveBeenCalledWith({
      keyStageName: "Key stage 1",
      keyStageSlug: "ks1",
      useCase: ["Teacher"],
      subjectName: "Maths",
      subjectSlug: "maths",
      unitName: "Numbers and numerals",
      unitSlug: "numbers-and-numerals",
    });
  });
});
