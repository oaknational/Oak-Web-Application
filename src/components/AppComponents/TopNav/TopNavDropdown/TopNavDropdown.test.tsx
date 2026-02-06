import { screen } from "@testing-library/react";

import TopNavDropdown from "./TopNavDropdown";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { DropdownFocusManager } from "@/components/AppComponents/TopNav/DropdownFocusManager/DropdownFocusManager";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

describe("TopNavDropdown", () => {
  let focusManager: DropdownFocusManager;

  beforeEach(() => {
    focusManager = new DropdownFocusManager(
      topNavFixture.teachers!,
      () => undefined,
    );
  });

  describe("Teachers area", () => {
    describe("phases sections", () => {
      it("renders keystage menu", async () => {
        renderWithTheme(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="primary"
            focusManager={focusManager}
          />,
        );

        const keystageButtons = await screen.findAllByRole("tab");

        expect(keystageButtons).toHaveLength(3);
        expect(keystageButtons[0]).toHaveTextContent("Key stage 1");
        expect(keystageButtons[0]).toHaveAttribute("aria-current", "true");
      });

      it("renders keystage menu", async () => {
        renderWithTheme(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="secondary"
            focusManager={focusManager}
          />,
        );

        const keystageButtons = await screen.findAllByRole("tab");

        expect(keystageButtons).toHaveLength(2);
        expect(keystageButtons[0]).toHaveTextContent("Key stage 3");
        expect(keystageButtons[0]).toHaveAttribute("aria-current", "true");
      });

      it("renders subject buttons and link to all key stage page", async () => {
        renderWithTheme(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="primary"
            focusManager={focusManager}
          />,
        );

        const subjectButtons = await screen.findAllByRole("link");

        expect(subjectButtons).toHaveLength(4);
        expect(subjectButtons[0]).toHaveTextContent("English");
        expect(subjectButtons[3]).toHaveTextContent("All KS1 subjects");
      });

      it("renders subject buttons with non-curriculum subjects last and with correct styling", async () => {
        renderWithTheme(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="primary"
            focusManager={focusManager}
          />,
        );

        const subjectButtons = await screen.findAllByRole("link");

        expect(subjectButtons[2]).toHaveTextContent("Financial education");
        expect(subjectButtons[2]).toHaveStyle({
          background: "rgb(235, 251, 235)",
        });
      });
    });
    describe("links sections", () => {
      it("renders heading and links", async () => {
        renderWithTheme(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="guidance"
            focusManager={focusManager}
          />,
        );

        const heading = await screen.findByRole("heading", {
          name: "Guidance",
        });
        expect(heading).toBeInTheDocument();

        const links = await screen.findAllByRole("link");
        expect(links).toHaveLength(2);
      });

      it("renders internal links correctly", async () => {
        renderWithTheme(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="TEACHERS"
            selectedMenu="guidance"
            focusManager={focusManager}
          />,
        );

        const links = await screen.findAllByRole("link");
        expect(links[0]).toHaveTextContent("Plan a lesson");
        expect(links[1]).toHaveTextContent("Blogs");
      });
    });
  });

  describe("Pupils area", () => {
    describe("links sections", () => {
      it("renders primary year buttons", async () => {
        renderWithTheme(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="PUPILS"
            selectedMenu="primary"
            focusManager={focusManager}
          />,
        );

        const links = await screen.findAllByRole("link");
        expect(links).toHaveLength(6);
        expect(links[0]).toHaveTextContent("Year 1");
      });

      it("renders secondary year buttons", async () => {
        renderWithTheme(
          <TopNavDropdown
            teachers={topNavFixture.teachers!}
            pupils={topNavFixture.pupils!}
            activeArea="PUPILS"
            selectedMenu="secondary"
            focusManager={focusManager}
          />,
        );

        const links = await screen.findAllByRole("link");
        expect(links).toHaveLength(5);
        expect(links[0]).toHaveTextContent("Year 7");
      });
    });
  });
});
