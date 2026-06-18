import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

import { TeachersTopNavHamburger } from "./TeachersTopNavHamburger";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const mockTopNavProps = topNavFixture.teachers!;

const render = renderWithProviders();

const mockBrowseRefined = jest.fn();
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "/test-path"),
}));

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      browseRefined: (...args: []) => mockBrowseRefined(...args),
    },
  }),
}));

async function openKeystageSubjects(
  user: ReturnType<typeof userEvent.setup>,
  getByRole: ReturnType<typeof render>["getByRole"],
  getByText: ReturnType<typeof render>["getByText"],
  {
    phaseKeyStagesLabel,
    keystageLabel,
  }: {
    phaseKeyStagesLabel: string;
    keystageLabel: string;
  },
) {
  const phaseKeyStagesButton = getByRole("button", {
    name: phaseKeyStagesLabel,
  });
  await user.click(phaseKeyStagesButton);

  const keystageButton = getByText(keystageLabel);
  await user.click(keystageButton);
}

describe("TeachersTopNavHamburger", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("should render the component", () => {
    const { getByTestId } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    expect(getByTestId("top-nav-hamburger-button")).toBeInTheDocument();
  });

  it("should display main menu content when no submenu is open", async () => {
    const { getByTestId, getByText, queryByText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    expect(getByText("Primary")).toBeInTheDocument();
    expect(getByText("Primary key stages")).toBeInTheDocument();
    expect(getByText("Secondary subjects")).toBeInTheDocument();
    expect(getByText("Secondary key stages")).toBeInTheDocument();
    expect(queryByText("Primary subjects")).not.toBeInTheDocument();
    expect(queryByText("Primary years")).not.toBeInTheDocument();
    expect(queryByText("Secondary years")).not.toBeInTheDocument();
  });

  it("should display submenu content when a submenu is opened", async () => {
    const { getByTestId, getByText, getByRole } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );

    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    await openKeystageSubjects(user, getByRole, getByText, {
      phaseKeyStagesLabel: "Primary key stages",
      keystageLabel: "Key stage 1",
    });
    expect(getByText("English")).toBeInTheDocument();
  });

  it("should focus the first list item when submenu is opened", async () => {
    const { getByTestId, getByText, getByRole } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    await openKeystageSubjects(user, getByRole, getByText, {
      phaseKeyStagesLabel: "Primary key stages",
      keystageLabel: "Key stage 1",
    });
    const firstListItem = getByTestId("topnav-subject-button-english");
    expect(document?.activeElement?.textContent).toBe(
      firstListItem.textContent,
    );
  });

  it("should close submenu and return to key stages list when back button is triggered", async () => {
    const { getByTestId, getByText, queryByText, getByRole } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    await openKeystageSubjects(user, getByRole, getByText, {
      phaseKeyStagesLabel: "Primary key stages",
      keystageLabel: "Key stage 1",
    });

    const backButton = getByRole("button", { name: "Key stage 1" });
    await user.click(backButton);

    expect(queryByText("English")).not.toBeInTheDocument();
    expect(getByText("Key stage 2")).toBeInTheDocument();
  });

  it("should focus the triggering element when returning to main menu from submenu", async () => {
    const { getByTestId, getByText, getByRole } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();

    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    const phaseKeyStagesButton = getByRole("button", {
      name: "Secondary key stages",
    });
    await user.click(phaseKeyStagesButton);

    const keystageItem = getByText("Key stage 3");
    await user.click(keystageItem);

    const backToKeyStages = getByRole("button", { name: "Key stage 3" });
    await user.click(backToKeyStages);

    const backToMainMenu = getByRole("button", {
      name: "Secondary key stages",
    });
    await user.click(backToMainMenu);

    expect(document?.activeElement?.textContent).toBe(
      phaseKeyStagesButton.textContent,
    );
  });

  it("should reset all states when modal closes", async () => {
    const { getByTestId, getByText, queryByText, getByLabelText, getByRole } =
      render(<TeachersTopNavHamburger {...mockTopNavProps} />);
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    await openKeystageSubjects(user, getByRole, getByText, {
      phaseKeyStagesLabel: "Primary key stages",
      keystageLabel: "Key stage 2",
    });

    const closeButton = getByLabelText("Close");
    await user.click(closeButton);

    await waitFor(() => expect(closeButton).not.toBeInTheDocument());

    await user.click(button);

    expect(queryByText("Science")).not.toBeInTheDocument();
    expect(getByText("Primary")).toBeInTheDocument();
  });

  it("should track subject click with keyStage activeFilter when browsing by keystage", async () => {
    const { getByTestId, getByText, getByRole } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    await openKeystageSubjects(user, getByRole, getByText, {
      phaseKeyStagesLabel: "Primary key stages",
      keystageLabel: "Key stage 1",
    });

    const englishButton = getByRole("link", { name: /English/i });
    await user.click(englishButton);

    expect(mockBrowseRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        filterType: "Subject filter",
        filterValue: "english",
        activeFilters: { keystage: ["ks1"] },
      }),
    );
  });

  it("should track subject click without keyStage activeFilter when browsing by phase", async () => {
    const { getByTestId, getByRole } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    const secondarySubjectsButton = getByRole("button", {
      name: "Secondary subjects",
    });
    await user.click(secondarySubjectsButton);

    const computerScienceButton = getByRole("link", {
      name: /Computer science/i,
    });
    await user.click(computerScienceButton);

    expect(mockBrowseRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        filterType: "Subject filter",
        filterValue: "computer-science",
        activeFilters: {},
      }),
    );
  });

  it("should track browse refined when a keystage is selected", async () => {
    const { getByTestId, getByText, getByRole } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    await openKeystageSubjects(user, getByRole, getByText, {
      phaseKeyStagesLabel: "Primary key stages",
      keystageLabel: "Key stage 1",
    });

    expect(mockBrowseRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        filterType: "Key stage filter",
        filterValue: "ks1",
      }),
    );
  });

  it("should track browse refined when phase subjects submenu is opened", async () => {
    const { getByTestId, getByRole } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    const secondarySubjectsButton = getByRole("button", {
      name: "Secondary subjects",
    });
    await user.click(secondarySubjectsButton);

    expect(mockBrowseRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        filterType: "Phase filter",
        filterValue: "secondary",
      }),
    );
  });

  it("should show EYFS with full accessible label in primary key stages list and back button", async () => {
    const { getByTestId, getByRole, getByText, queryByText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    const primaryKeyStagesButton = getByRole("button", {
      name: "Primary key stages",
    });
    await user.click(primaryKeyStagesButton);

    expect(getByText("EYFS")).toBeInTheDocument();
    expect(queryByText("Early years foundation stage")).not.toBeInTheDocument();
    expect(
      getByRole("button", { name: "Early years foundation stage" }),
    ).toBeInTheDocument();

    const eyfsButton = getByRole("button", {
      name: "Early years foundation stage",
    });
    await user.click(eyfsButton);

    expect(getByRole("heading", { name: "EYFS" })).toBeInTheDocument();
    expect(
      getByRole("button", { name: "Early years foundation stage" }),
    ).toBeInTheDocument();
  });

  it("should display phase subjects when a phase subjects submenu is opened", async () => {
    const { getByTestId, getByText, getByRole } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    const secondarySubjectsButton = getByRole("button", {
      name: "Secondary subjects",
    });
    await user.click(secondarySubjectsButton);

    expect(getByText("Computer science")).toBeInTheDocument();
  });

  it("should render an aria label for external links in the main nav", async () => {
    const { getByTestId, getByRole } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    const aiExperimentsLink = getByRole("link", {
      name: "AI Experiments (this will open in a new tab)",
    });
    expect(aiExperimentsLink).toHaveTextContent("AI Experiments");
  });

  it("renders the submenu correctly", async () => {
    const { getByTestId, getByRole, queryByTestId } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    expect(queryByTestId("submenu-container")).not.toBeInTheDocument();

    const menuButton = getByRole("button", { name: "Primary key stages" });
    await user.click(menuButton);

    expect(getByTestId("submenu-container")).toBeInTheDocument();

    const backButton = getByRole("button", { name: "Primary key stages" });
    await user.click(backButton);

    expect(queryByTestId("submenu-container")).not.toBeInTheDocument();
  });

  it("should render an aria label for external links in the sub menu", async () => {
    const { getByTestId, getByRole, getByText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    const externalLink = topNavFixture.teachers?.guidance?.children.find(
      (c) => c.external === true,
    );
    if (!externalLink) {
      throw new Error("Could not find external link in submenu for testing");
    }

    const guidanceMenu = getByText("Guidance");
    await user.click(guidanceMenu);

    const link = getByRole("link", {
      name: `${externalLink.title} (this will open in a new tab)`,
    });
    expect(link).toHaveTextContent(externalLink.title);
    expect(link).toHaveProperty("target", "_blank");
  });

  it("opens exam board view for KS4 subject and returns to subjects on back", async () => {
    const { getByTestId, getByText, getByRole, queryByRole } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();

    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    await openKeystageSubjects(user, getByRole, getByText, {
      phaseKeyStagesLabel: "Secondary key stages",
      keystageLabel: "Key stage 4",
    });

    const geographySubject = getByRole("button", { name: "Geography" });
    await user.click(geographySubject);

    expect(
      getByRole("heading", { name: "Choose tier for KS4 Geography" }),
    ).toBeInTheDocument();

    const backButton = getByRole("button", { name: "KS4, Geography" });
    await user.click(backButton);

    expect(
      queryByRole("heading", { name: "Choose tier for KS4 Geography" }),
    ).not.toBeInTheDocument();
    expect(getByRole("button", { name: "Geography" })).toBeInTheDocument();
  });
});
