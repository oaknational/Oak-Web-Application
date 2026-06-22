import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useRouter } from "next/navigation";

import TopNavDropdown from "./TopNavDropdown";

import { DropdownFocusManager } from "@/components/AppComponents/TopNav/DropdownFocusManager/DropdownFocusManager";
import { buildFocusTree } from "@/components/AppComponents/TopNav/DropdownFocusManager/focusTree";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import { TeachersSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { getOakUiColor } from "@/__tests__/__helpers__/getOakUiColor";

const render = renderWithProviders();

const mockBrowseRefined = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      browseRefined: (...args: []) => mockBrowseRefined(...args),
    },
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

let focusManager: DropdownFocusManager<TeachersSubNavData>;
const onCloseMock = jest.fn();

describe("TopNavDropdown", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    onCloseMock.mockReset();
    mockBrowseRefined.mockReset();
    focusManager = new DropdownFocusManager(
      buildFocusTree(topNavFixture.teachers!, "teachers"),
      "teachers",
      () => undefined,
    );
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  describe("Teachers area", () => {
    describe("keystages sections", () => {
      it("renders keystage menu", async () => {
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="primary"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const primaryButton = await screen.findByRole("button", {
          name: "Primary",
        });

        expect(primaryButton).toBeInTheDocument();
      });

      it("does not set aria-controls when no matching subject panel exists", async () => {
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="primary"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const primaryButton = await screen.findByRole("button", {
          name: "Primary",
        });

        expect(primaryButton).not.toHaveAttribute("aria-controls");
      });

      it("renders keystage menu", async () => {
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="secondary"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const secondaryButton = await screen.findByRole("button", {
          name: "Secondary",
        });

        expect(secondaryButton).toBeInTheDocument();
      });

      it("calls track browse refined when a keystage button is clicked", async () => {
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="secondary"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const user = userEvent.setup();
        const keystagesButton = await screen.findByRole("button", {
          name: "Key stages",
        });
        await user.click(keystagesButton);
        const ks4Button = await screen.findByRole("button", {
          name: "Key stage 4",
        });
        await user.click(ks4Button);
        const keystageButton = screen.getByRole("button", {
          name: "Key stage 4",
        });
        await user.click(keystageButton);
        expect(mockBrowseRefined).toHaveBeenCalledWith(
          expect.objectContaining({
            filterType: "Key stage filter",
            filterValue: "ks4",
          }),
        );
      });

      it("renders subject buttons with non-curriculum subjects last and with correct styling", async () => {
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="primary"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const user = userEvent.setup();
        const keystagesButton = await screen.findByRole("button", {
          name: "Key stages",
        });
        await user.click(keystagesButton);
        const subjectButtons = await screen.findAllByRole("link");

        expect(subjectButtons[2]).toHaveTextContent("Financial education");
        expect(subjectButtons[2]).toHaveStyle({
          background: getOakUiColor("bg-decorative1-very-subdued"),
        });
      });

      it("calls onClose when clicking a subject button", async () => {
        const user = userEvent.setup();
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="primary"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const keystagesButton = await screen.findByRole("button", {
          name: "Key stages",
        });
        await user.click(keystagesButton);
        const englishButton = await screen.findByRole("link", {
          name: "English",
        });

        // Prevent navigation in test
        englishButton.addEventListener("click", (e) => e.preventDefault());
        await user.click(englishButton);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });

      it("calls onClose when clicking a non-curriculum subject button", async () => {
        const user = userEvent.setup();
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="primary"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const keystagesButton = await screen.findByRole("button", {
          name: "Key stages",
        });
        await user.click(keystagesButton);
        const financialEdButton = await screen.findByRole("link", {
          name: "Financial education",
        });

        // Prevent navigation in test
        financialEdButton.addEventListener("click", (e) => e.preventDefault());
        await user.click(financialEdButton);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });

      it("calls track browse refined when clicking a subject button", async () => {
        const user = userEvent.setup();
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="primary"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const keystagesButton = await screen.findByRole("button", {
          name: "Key stages",
        });
        await user.click(keystagesButton);
        const englishButton = await screen.findByRole("link", {
          name: "English",
        });
        // Prevent navigation in test
        englishButton.addEventListener("click", (e) => e.preventDefault());
        await user.click(englishButton);

        expect(mockBrowseRefined).toHaveBeenCalledWith(
          expect.objectContaining({
            activeFilters: { keystage: ["ks1"] },
            filterType: "Subject filter",
            filterValue: "english",
          }),
        );
      });

      it("shows exam board panel for KS4 subjects with exam boards", async () => {
        const user = userEvent.setup();
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="secondary"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const keystagesButton = await screen.findByRole("button", {
          name: "Key stages",
        });
        await user.click(keystagesButton);

        const ks4Button = await screen.findByRole("button", {
          name: "Key stage 4",
        });
        await user.click(ks4Button);

        const geographyButton = await screen.findByRole("button", {
          name: "Geography",
        });
        geographyButton.addEventListener("click", (e) => e.preventDefault());
        await user.click(geographyButton);

        expect(
          await screen.findByRole("heading", {
            name: "Choose tier for KS4 Geography",
          }),
        ).toBeInTheDocument();
      });

      it("keeps exam board panel open after blur when opened by click", async () => {
        const user = userEvent.setup();
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="secondary"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const keystagesButton = await screen.findByRole("button", {
          name: "Key stages",
        });
        await user.click(keystagesButton);

        const ks4Button = await screen.findByRole("button", {
          name: "Key stage 4",
        });
        await user.click(ks4Button);

        const geographyButton = await screen.findByRole("button", {
          name: "Geography",
        });
        geographyButton.addEventListener("click", (e) => e.preventDefault());

        await user.click(geographyButton);
        geographyButton.blur();

        expect(
          await screen.findByRole("heading", {
            name: "Choose tier for KS4 Geography",
          }),
        ).toBeInTheDocument();
      });

      it("closes exam board panel when keystage changes", async () => {
        const user = userEvent.setup();
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="secondary"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const keystagesButton = await screen.findByRole("button", {
          name: "Key stages",
        });
        await user.click(keystagesButton);

        const ks4Button = await screen.findByRole("button", {
          name: "Key stage 4",
        });
        await user.click(ks4Button);

        const geographyButton = await screen.findByRole("button", {
          name: "Geography",
        });
        geographyButton.addEventListener("click", (e) => e.preventDefault());
        await user.click(geographyButton);

        const ks3Button = screen.getByRole("button", { name: "Key stage 3" });
        await user.click(ks3Button);

        expect(
          screen.queryByRole("heading", {
            name: "Choose exam board for KS4 Geography",
          }),
        ).not.toBeInTheDocument();
      });
    });
    describe("phases section", () => {
      it("renders phase tabs with subjects", async () => {
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="secondary"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const secondaryButton = screen.getByText("Secondary").closest("button");
        await userEvent.click(secondaryButton!);

        expect(
          screen.getByRole("link", { name: "History" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("link", { name: "Geography" }),
        ).toBeInTheDocument();
      });
    });
    describe("links sections", () => {
      it("renders heading and links", async () => {
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="guidance"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const heading = await screen.findByRole("heading", {
          name: "Guidance",
        });
        expect(heading).toBeInTheDocument();

        const links = await screen.findAllByRole("button");
        expect(links).toHaveLength(3);
      });

      it("renders internal links correctly", async () => {
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="guidance"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const links = await screen.findAllByRole("link");
        expect(links[0]).toHaveTextContent("Plan a lesson");
        expect(links[1]).toHaveTextContent("Blogs");
      });

      it("calls onClose when clicking a guidance link", async () => {
        const user = userEvent.setup();
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="guidance"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const planLessonLink = await screen.findByRole("link", {
          name: "Plan a lesson",
        });

        // Prevent navigation in test
        planLessonLink.addEventListener("click", (e) => e.preventDefault());
        await user.click(planLessonLink);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });

      it("calls onClose when clicking an about us link", async () => {
        const user = userEvent.setup();
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="aboutUs"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const links = await screen.findAllByRole("link");

        // Prevent navigation in test
        links[0]?.addEventListener("click", (e) => e.preventDefault());
        await user.click(links[0]!);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });

      it("renders external links with correct target attribute", async () => {
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="guidance"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const externalLink = (await screen.findByText("Help")).closest("a");

        expect(externalLink).toHaveAttribute("target", "_blank");
      });
    });
  });

  describe("Pupils area", () => {
    describe("links sections", () => {
      it("renders primary year buttons", async () => {
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="PUPILS"
            selectedMenu="primary"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const links = await screen.findAllByRole("link");
        expect(links).toHaveLength(6);
        expect(links[0]).toHaveTextContent("Year 1");
      });

      it("renders secondary year buttons", async () => {
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="PUPILS"
            selectedMenu="secondary"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const links = await screen.findAllByRole("link");
        expect(links).toHaveLength(5);
        expect(links[0]).toHaveTextContent("Year 7");
      });

      it("calls onClose when clicking a primary year button", async () => {
        const user = userEvent.setup();
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="PUPILS"
            selectedMenu="primary"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const year1Button = await screen.findByRole("link", {
          name: "Year 1",
        });

        // Prevent navigation in test
        year1Button.addEventListener("click", (e) => e.preventDefault());
        await user.click(year1Button);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });

      it("calls onClose when clicking a secondary year button", async () => {
        const user = userEvent.setup();
        render(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="PUPILS"
            selectedMenu="secondary"
            focusManager={focusManager}
            onClose={onCloseMock}
          />,
        );

        const year7Button = await screen.findByRole("link", {
          name: "Year 7",
        });

        // Prevent navigation in test
        year7Button.addEventListener("click", (e) => e.preventDefault());
        await user.click(year7Button);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
