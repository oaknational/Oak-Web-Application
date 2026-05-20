import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useRouter } from "next/navigation";

import ExamBoardPanel from "./ExamBoardPanel";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { SubjectsNavItem } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

const render = renderWithProviders();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "/test-path"),
}));

jest.mock("@/common-lib/urls", () => ({
  resolveOakHref: jest.fn(
    (config) => `/test-path/${config.subjectPhaseSlug}/${config.tab}`,
  ),
}));

jest.mock("@/utils/curriculum/slugs", () => ({
  getTeacherSubjectPhaseSlug: jest.fn(() => "test-programme-slug"),
}));

const mockPush = jest.fn();

describe("ExamBoardPanel", () => {
  const mockOnClick = jest.fn();
  const mockOnClose = jest.fn();
  const examBoards = [
    { slug: "aqa", title: "AQA", programmeSlug: "aqa-prog" },
    { slug: "edexcel", title: "Edexcel", programmeSlug: "edexcel-prog" },
  ];
  const selectedSubject = {
    slug: "geography",
    title: "Geography",
    examBoards,
  } as SubjectsNavItem;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders exam board heading", () => {
    render(
      <ExamBoardPanel
        examBoards={examBoards}
        selectedSubject={selectedSubject}
        onClick={mockOnClick}
        onClose={mockOnClose}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Choose exam board for KS4 Geography",
      }),
    ).toBeInTheDocument();
  });

  it("renders all exam board options", () => {
    render(
      <ExamBoardPanel
        examBoards={examBoards}
        selectedSubject={selectedSubject}
        onClick={mockOnClick}
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByText("AQA")).toBeInTheDocument();
    expect(screen.getByText("Edexcel")).toBeInTheDocument();
  });

  it("navigates when exam board is selected", async () => {
    const user = userEvent.setup();
    render(
      <ExamBoardPanel
        examBoards={examBoards}
        selectedSubject={selectedSubject}
        onClick={mockOnClick}
        onClose={mockOnClose}
      />,
    );

    const aqaRadio = screen.getByRole("radio", { name: /AQA/ });
    await user.click(aqaRadio);

    expect(mockPush).toHaveBeenCalledWith(
      "/test-path/test-programme-slug/units?keystages=ks4",
    );
  });

  it("calls onClick with subject and keystage when exam board is selected", async () => {
    const user = userEvent.setup();
    render(
      <ExamBoardPanel
        examBoards={examBoards}
        selectedSubject={selectedSubject}
        onClick={mockOnClick}
        onClose={mockOnClose}
      />,
    );

    const aqaRadio = screen.getByRole("radio", { name: /AQA/ });
    await user.click(aqaRadio);

    expect(mockOnClick).toHaveBeenCalledWith("geography", "ks4");
  });
});
