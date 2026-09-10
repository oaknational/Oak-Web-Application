import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TopNavKS4Buttons } from "./TopNavKS4Buttons";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import {
  Ks4OptionsMenu,
  SubjectsMenu,
} from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";

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

const mockOnClick = jest.fn();
const mockOnClose = jest.fn();
const getButtonId = (key: string) => `test-id-${key}`;
const ks4Options: Ks4OptionsMenu[] = [
  {
    title: "AQA",
    slug: "aqa-prog",
    href: "/teachers/programmes/geography-secondary-aqa/units?keystages=ks4",
    programmeFactors: {
      examboard: { slug: "aqa", title: "AQA" },
      tier: null,
    },
  },
  {
    title: "Edexcel",
    slug: "edexcel-prog",
    href: "/teachers/programmes/geography-secondary-edexcel/units?keystages=ks4",
    programmeFactors: {
      examboard: { slug: "edexcel", title: "Edexcel" },
      tier: null,
    },
  },
];
const selectedSubject: SubjectsMenu = {
  slug: "geography",
  subjectSlug: "geography",
  programmeSlug: "geography-secondary",
  programmeCount: 1,
  nonCurriculum: false,
  title: "Geography",
  href: "/teachers/programmes/geography-secondary/units?keystages=ks4",
  children: ks4Options,
};

describe("TopNavKS4Buttons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders exam board heading", () => {
    render(
      <TopNavKS4Buttons
        ks4Options={ks4Options}
        subject={selectedSubject}
        onClick={mockOnClick}
        getButtonId={getButtonId}
        onExamboardPanelClose={mockOnClose}
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
      <TopNavKS4Buttons
        ks4Options={ks4Options}
        subject={selectedSubject}
        onClick={mockOnClick}
        onExamboardPanelClose={mockOnClose}
        getButtonId={getButtonId}
      />,
    );

    expect(screen.getByText("AQA")).toBeInTheDocument();
    expect(screen.getByText("Edexcel")).toBeInTheDocument();
  });

  it("renders exam board links with the expected destination", () => {
    render(
      <TopNavKS4Buttons
        ks4Options={ks4Options}
        subject={selectedSubject}
        onClick={mockOnClick}
        onExamboardPanelClose={mockOnClose}
        getButtonId={getButtonId}
      />,
    );

    const aqaLink = screen.getByRole("link", { name: "AQA" });

    expect(aqaLink).toHaveAttribute("href", ks4Options[0]!.href);
  });

  it("calls onClick with subject and keystage when exam board is selected", async () => {
    const user = userEvent.setup();
    render(
      <TopNavKS4Buttons
        ks4Options={ks4Options}
        subject={selectedSubject}
        onClick={mockOnClick}
        onExamboardPanelClose={mockOnClose}
        getButtonId={getButtonId}
      />,
    );

    const aqaLink = screen.getByRole("link", { name: "AQA" });
    aqaLink.addEventListener("click", (e) => e.preventDefault());
    await user.click(aqaLink);

    expect(mockOnClick).toHaveBeenCalledWith(selectedSubject, "ks4");
  });

  it("should generate correct title for Maths", () => {
    const maths = {
      slug: "maths",
      subjectSlug: "maths",
      title: "Maths",
      children: ks4Options,
    } as SubjectsMenu;

    const mathsKs4Options = [
      {
        title: "Higher",
        slug: "maths-higher",
        href: "/teachers/programmes/maths-secondary/units?keystages=ks4&tiers=higher",
        programmeFactors: {
          tier: { slug: "higher", description: "Higher" },
          examboard: null,
        },
      },
      {
        title: "Foundation",
        slug: "maths-foundation",
        href: "/teachers/programmes/maths-secondary/units?keystages=ks4&tiers=foundation",
        programmeFactors: {
          tier: { slug: "foundation", description: "Foundation" },
          examboard: null,
        },
      },
    ] satisfies Ks4OptionsMenu[];

    render(
      <TopNavKS4Buttons
        ks4Options={mathsKs4Options}
        subject={maths}
        onClick={mockOnClick}
        onExamboardPanelClose={mockOnClose}
        getButtonId={getButtonId}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Choose tier for KS4 Maths",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Higher")).toBeInTheDocument();
  });
});
