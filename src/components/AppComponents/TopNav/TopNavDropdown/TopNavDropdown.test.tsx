import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import TopNavDropdown from "./TopNavDropdown";

import { DropdownFocusManager } from "@/components/AppComponents/TopNav/DropdownFocusManager/DropdownFocusManager";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import { TeachersSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

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

let focusManager: DropdownFocusManager<TeachersSubNavData>;
const onCloseMock = jest.fn();

describe("TopNavDropdown", () => {
  beforeEach(() => {
    onCloseMock.mockReset();
    mockBrowseRefined.mockReset();
    focusManager = new DropdownFocusManager(
      topNavFixture.teachers!,
      "teachers",
      () => undefined,
    );
  });

  describe("Teachers area", () => {
    describe("phases sections", () => {
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

        const keystageButtons = await screen.findAllByRole("tab");

        expect(keystageButtons).toHaveLength(3);
        expect(keystageButtons[0]).toHaveTextContent("Key stage 1");
        expect(keystageButtons[0]).toHaveAttribute("aria-current", "true");
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

        const keystageButtons = await screen.findAllByRole("tab");

        expect(keystageButtons).toHaveLength(2);
        expect(keystageButtons[0]).toHaveTextContent("Key stage 3");
        expect(keystageButtons[0]).toHaveAttribute("aria-current", "true");
      });

      it("renders subject buttons and link to all key stage page", async () => {
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

        const subjectButtons = await screen.findAllByRole("link");

        expect(subjectButtons).toHaveLength(4);
        expect(subjectButtons[0]).toHaveTextContent("English");
        expect(subjectButtons[3]).toHaveTextContent("All KS1 subjects");
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

        const subjectButtons = await screen.findAllByRole("link");

        expect(subjectButtons[2]).toHaveTextContent("Financial education");
        expect(subjectButtons[2]).toHaveStyle({
          background: "rgb(235, 251, 235)",
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

        const englishButton = await screen.findByRole("link", {
          name: "English",
        });

        // Prevent navigation in test
        englishButton.addEventListener("click", (e) => e.preventDefault());
        await user.click(englishButton);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });

      it("calls onClose when clicking 'All [keystage] subjects' button", async () => {
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

        const allSubjectsButton = await screen.findByRole("link", {
          name: /All KS1 subjects/i,
        });

        // Prevent navigation in test
        allSubjectsButton.addEventListener("click", (e) => e.preventDefault());
        await user.click(allSubjectsButton);

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

        const englishButton = await screen.findByRole("link", {
          name: "English",
        });
        // Prevent navigation in test
        englishButton.addEventListener("click", (e) => e.preventDefault());
        await user.click(englishButton);

        expect(mockBrowseRefined).toHaveBeenCalledWith({
          activeFilters: { keystage: ["ks1"] },
          analyticsUseCase: "Teacher",
          componentType: "topnav-browse-button",
          engagementIntent: "refine",
          eventVersion: "2.0.0",
          filterType: "Subject filter",
          filterValue: "english",
          platform: "owa",
          product: "teacher lesson resources",
        });
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

        const links = await screen.findAllByRole("link");
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
