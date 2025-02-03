import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SubjectProgrammeListing from "./SubjectProgrammeListing";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import programmeListingFixture, {
  examBoardProgrammeListingFixture,
} from "@/node-lib/curriculum-api-2023/fixtures/programmeListing.fixture";

const curriculumData = programmeListingFixture();
const examBoardCurriculumData = examBoardProgrammeListingFixture();

const render = renderWithProviders();
const onClick = vi.fn();

describe("SubjectProgrammeListing", () => {
  test("render a tier subject component with heading", () => {
    render(<SubjectProgrammeListing onClick={onClick} {...curriculumData} />);

    expect(screen.getByText("Select tier of learning")).toBeInTheDocument();
  });
  test("it does not render a tier heading when there are no tiers ", () => {
    const { queryByText } = render(
      <SubjectProgrammeListing
        onClick={onClick}
        {...{
          ...curriculumData,
          programmes: curriculumData.programmes.filter(
            (programme) => !programme.tierSlug,
          ),
        }}
      />,
    );

    const tiersTitle = queryByText("Learning tiers");

    expect(tiersTitle).toBeNull();
  });
  test("render a exam board subject component with heading ", () => {
    render(
      <SubjectProgrammeListing
        onClick={onClick}
        {...examBoardCurriculumData}
      />,
    );

    expect(screen.getByText("Select exam board")).toBeInTheDocument();
  });

  test("it does not render an exam board heading when there is no exam boards  ", () => {
    const { queryByText } = render(
      <SubjectProgrammeListing
        onClick={onClick}
        {...{
          ...curriculumData,
          programmes: curriculumData.programmes.filter(
            (programme) => !programme.examBoardSlug,
          ),
        }}
      />,
    );

    const examsTitle = queryByText("Exam boards");

    expect(examsTitle).toBeNull();
  });

  test("render a list of card items with the name of the programmes ", () => {
    const { getAllByRole } = render(
      <SubjectProgrammeListing onClick={onClick} {...curriculumData} />,
    );

    expect(getAllByRole("paragraph")[1]?.textContent).toBe("Higher");
    expect(getAllByRole("paragraph")[0]?.textContent).toBe("Foundation");
  });

  test("each card items will link have a link to a different query ", () => {
    const { getByRole } = render(
      <SubjectProgrammeListing onClick={onClick} {...curriculumData} />,
    );

    expect(getByRole("link", { name: "Foundation" })).toHaveAttribute(
      "href",
      "/teachers/programmes/maths-secondary-ks4-foundation-l/units",
    );
    expect(getByRole("link", { name: "Higher" })).toHaveAttribute(
      "href",
      "/teachers/programmes/maths-secondary-ks4-higher-l/units",
    );
  });
  it("calls onclick once, with correct props", async () => {
    render(<SubjectProgrammeListing onClick={onClick} {...curriculumData} />);

    const tier = screen.getByText("Higher");

    const user = userEvent.setup();
    await user.click(tier);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith({
      examBoardDisplayOrder: null,
      examBoardSlug: null,
      examBoardTitle: null,
      programmeSlug: "maths-secondary-ks4-higher-l",
      subjectTitle: "Maths",
      tierDisplayOrder: 3,
      tierSlug: "higher",
      tierTitle: "Higher",
      pathwayDisplayOrder: null,
      pathwaySlug: null,
      pathwayTitle: null,
    });
  });
});
