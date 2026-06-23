import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

import TopNavSubjectButtons from "./TopNavSubjectButtons";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

const render = renderWithProviders();

describe("TopNavSubjectButtons", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  const subjects = [
    {
      title: "Geography",
      slug: "geography",
      href: "/teachers/programmes/geography-secondary/units?keystages=ks4",
      nonCurriculum: false,
      programmeSlug: "geography-secondary-ks4",
      programmeCount: 3,
    },
    {
      title: "History",
      slug: "history",
      href: "/teachers/programmes/history-secondary-edexcel/units?keystages=ks4",
      nonCurriculum: false,
      programmeSlug: "history-secondary-ks4",
      programmeCount: 1,
    },
  ];

  it("calls handleClick when a subject without exam boards is clicked", async () => {
    const mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
    const handleSubjectClick = jest.fn();
    const user = userEvent.setup();

    render(
      <TopNavSubjectButtons
        selectedMenu="secondary"
        subjects={subjects}
        selectedSubject={null}
        viewTypeSlug="ks4"
        handleClick={handleSubjectClick}
        onExamBoardPanelOpen={jest.fn()}
        closeExamBoardPanel={jest.fn}
        phase="secondary"
      />,
    );

    const historyButton = screen.getByRole("link", { name: "History" });
    historyButton.addEventListener("click", (e) => e.preventDefault());
    await user.click(historyButton);

    expect(handleSubjectClick).toHaveBeenCalledWith("history", "ks4");
  });

  it("prevents default and calls onExamBoardPanelOpen when clicking KS4 subject with exam boards", async () => {
    const handleSubjectClick = jest.fn();
    const onExamBoardPanelOpen = jest.fn();
    const user = userEvent.setup();

    const subjectsWithBoards = [
      {
        title: "Biology",
        slug: "biology",
        href: "/teachers/programmes/biology-secondary-aqa/units?keystages=ks4",
        nonCurriculum: false,
        programmeSlug: "biology-secondary-ks4",
        programmeCount: 3,
        examBoards: [
          {
            slug: "aqa",
            buttonTitle: "AQA",
            programmeSlug: "biology-secondary-ks4-aqa",
            href: "/teachers/programmes/biology-secondary-aqa/units?keystages=ks4",
          },
        ],
      },
    ];

    render(
      <TopNavSubjectButtons
        selectedMenu="secondary"
        subjects={subjectsWithBoards}
        selectedSubject={null}
        viewTypeSlug="ks4"
        handleClick={handleSubjectClick}
        onExamBoardPanelOpen={onExamBoardPanelOpen}
        closeExamBoardPanel={jest.fn}
        phase="secondary"
      />,
    );

    const biologyButton = screen.getByRole("button", { name: "Biology" });
    await user.click(biologyButton);

    expect(onExamBoardPanelOpen).toHaveBeenCalledWith(subjectsWithBoards[0]);
    expect(handleSubjectClick).not.toHaveBeenCalled();
  });

  it("uses href from nav data on subject links", () => {
    const [geography] = subjects;

    render(
      <TopNavSubjectButtons
        selectedMenu="secondary"
        subjects={[geography!]}
        selectedSubject={null}
        viewTypeSlug="ks4"
        handleClick={jest.fn()}
        phase="secondary"
        closeExamBoardPanel={jest.fn}
      />,
    );

    expect(screen.getByRole("link", { name: "Geography" })).toHaveAttribute(
      "href",
      geography!.href,
    );
  });

  describe("TopNavSubjectButtons accessibility", () => {
    const subjects = [
      {
        title: "Geography",
        slug: "geography",
        href: "/teachers/programmes/geography-secondary/units?keystages=ks4",
        nonCurriculum: false,
        programmeSlug: "geography-secondary-ks4",
        programmeCount: 3,
        examBoards: [
          {
            buttonTitle: "AQA",
            programmeSlug: "geography-secondary-ks4-aqa",
            href: "/teachers/programmes/geography-secondary-aqa/units?keystages=ks4",
            programmeFactors: {
              examboard: { slug: "aqa", title: "AQA" },
            },
          },
          {
            buttonTitle: "Edexcel",
            programmeSlug: "geography-secondary-ks4-edexcel",
            href: "/teachers/programmes/geography-secondary-edexcel/units?keystages=ks4",
            programmeFactors: {
              examboard: { slug: "edexcel", title: "Edexcel" },
            },
          },
        ],
      },
      {
        title: "History",
        slug: "history",
        href: "/teachers/programmes/history-secondary-edexcel/units?keystages=ks4",
        nonCurriculum: false,
        programmeSlug: "history-secondary-ks4",
        programmeCount: 1,
      },
      {
        title: "Maths",
        slug: "maths",
        href: "/teachers/programmes/maths-secondary/units?keystages=ks4",
        nonCurriculum: false,
        programmeSlug: "maths-secondary-ks4",
        programmeCount: 2,
      },
    ];

    it("renders subject buttons with correct roles and ids", () => {
      render(
        <TopNavSubjectButtons
          selectedMenu="secondary"
          subjects={subjects}
          selectedSubject={null}
          viewTypeSlug="ks4"
          handleClick={jest.fn()}
          onExamBoardPanelOpen={jest.fn()}
          closeExamBoardPanel={jest.fn}
          phase="secondary"
        />,
      );

      expect(
        screen.getByRole("button", { name: "Geography" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "History" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Maths" })).toBeInTheDocument();
    });

    it("calls onExamBoardPanelOpen when Enter is pressed on KS4 subject with exam boards", async () => {
      const onExamBoardPanelOpen = jest.fn();
      const user = userEvent.setup();

      render(
        <TopNavSubjectButtons
          selectedMenu="secondary"
          subjects={subjects}
          selectedSubject={null}
          viewTypeSlug="ks4"
          handleClick={jest.fn()}
          onExamBoardPanelOpen={onExamBoardPanelOpen}
          closeExamBoardPanel={jest.fn}
          phase="secondary"
        />,
      );

      const geographyButton = screen.getByRole("button", { name: "Geography" });
      geographyButton.focus();

      await user.keyboard("{Enter}");

      expect(onExamBoardPanelOpen).toHaveBeenCalledWith(subjects[0]);
    });

    it("does not call onExamBoardPanelOpen for subjects without exam boards", async () => {
      const onExamBoardPanelOpen = jest.fn();
      const user = userEvent.setup();

      const subjectsWithoutBoards = [
        {
          title: "English",
          slug: "english",
          href: "/teachers/programmes/english-secondary-aqa/units?keystages=ks4",
          nonCurriculum: false,
          programmeSlug: "english-secondary-ks4",
          programmeCount: 1,
        },
      ];

      render(
        <TopNavSubjectButtons
          selectedMenu="secondary"
          subjects={subjectsWithoutBoards}
          selectedSubject={null}
          viewTypeSlug="ks4"
          handleClick={jest.fn()}
          onExamBoardPanelOpen={onExamBoardPanelOpen}
          closeExamBoardPanel={jest.fn}
          phase="secondary"
        />,
      );

      const englishButton = screen.getByRole("link", { name: "English" });
      englishButton.addEventListener("click", (e) => e.preventDefault());
      englishButton.focus();

      await user.keyboard("{Enter}");

      expect(onExamBoardPanelOpen).not.toHaveBeenCalled();
    });
  });
});
