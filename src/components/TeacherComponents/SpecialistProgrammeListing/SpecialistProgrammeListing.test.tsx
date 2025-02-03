import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SpecialistProgrammeListing from "./SpecialistProgrammeListing";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { specialistProgrammeListingPageDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/specialistProgrammes.fixture";

const curriculumData = specialistProgrammeListingPageDataFixture();

const render = renderWithProviders();
const onClick = vi.fn();

describe("SpecialistProgrammeListing", () => {
  test("render a tier subject component with heading ", () => {
    render(
      <SpecialistProgrammeListing onClick={onClick} {...curriculumData} />,
    );

    expect(screen.getByText("Developmental stages")).toBeInTheDocument();
  });

  test("render a list of card items with the name of the programmes ", () => {
    const { getAllByRole } = render(
      <SpecialistProgrammeListing onClick={onClick} {...curriculumData} />,
    );

    expect(getAllByRole("heading", { level: 3 })[0]?.textContent).toBe(
      "Early development 1",
    );
    expect(getAllByRole("heading", { level: 3 })[1]?.textContent).toBe(
      "Creative arts 1",
    );
  });

  test("each card items will link have a link to a different query ", () => {
    const { getByRole } = render(
      <SpecialistProgrammeListing onClick={onClick} {...curriculumData} />,
    );

    expect(
      getByRole("link", { name: "Early development 1 10 units • 100 lessons" }),
    ).toHaveAttribute(
      "href",
      "/teachers/specialist/programmes/early-development/units",
    );
    expect(
      getByRole("link", { name: "Creative arts 1 10 units • 100 lessons" }),
    ).toHaveAttribute(
      "href",
      "/teachers/specialist/programmes/creative-arts/units",
    );
  });
  it("calls onClick with correct props", async () => {
    render(
      <SpecialistProgrammeListing onClick={onClick} {...curriculumData} />,
    );

    const programmeCard = screen.getByText("Early development 1");

    const user = userEvent.setup();
    await user.click(programmeCard);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith({
      developmentStageSlug: "early-development-1",
      developmentStageTitle: "Early development 1",
      programmeSlug: "early-development",
      unitCount: 10,
      lessonCount: 100,
    });
  });
});
