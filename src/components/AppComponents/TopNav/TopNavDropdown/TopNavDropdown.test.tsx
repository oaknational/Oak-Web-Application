import { screen } from "@testing-library/dom";

import TopNavDropdown, { TopNavDropdownProps } from "./TopNavDropdown";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

describe("TopNavDropdown", () => {
  describe("Teachers area", () => {
    describe("phases sections", () => {
      it("renders keystage menu, defaulting to the first keystage", async () => {
        renderWithTheme(
          <TopNavDropdown
            {...({
              ...topNavFixture,
              activeArea: "TEACHERS",
              selectedMenu: "primary",
            } as TopNavDropdownProps)}
          />,
        );

        const keystageButtons = await screen.findAllByRole("tab");

        expect(keystageButtons).toHaveLength(3);
        expect(keystageButtons[0]).toHaveTextContent("Key stage 1");
        expect(keystageButtons[0]).toHaveAttribute("aria-current", "true");
      });

      it("renders subject buttons and link to all key stage page", async () => {
        renderWithTheme(
          <TopNavDropdown
            {...({
              ...topNavFixture,
              activeArea: "TEACHERS",
              selectedMenu: "primary",
            } as TopNavDropdownProps)}
          />,
        );

        const subjectButtons = await screen.findAllByRole("link");

        expect(subjectButtons).toHaveLength(4);
        expect(subjectButtons[0]).toHaveTextContent("Art and design");
        expect(subjectButtons[3]).toHaveTextContent("All KS1 subjects");
      });

      it("renders subject buttons with non-curriculum subjects last and with correct styling", async () => {
        renderWithTheme(
          <TopNavDropdown
            {...({
              ...topNavFixture,
              activeArea: "TEACHERS",
              selectedMenu: "primary",
            } as TopNavDropdownProps)}
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
      it("renders heading and links with external links correctly displayed", async () => {
        renderWithTheme(
          <TopNavDropdown
            {...({
              ...topNavFixture,
              activeArea: "TEACHERS",
              selectedMenu: "guidance",
            } as TopNavDropdownProps)}
          />,
        );

        const heading = await screen.findByRole("heading", {
          name: "Guidance",
        });
        expect(heading).toBeInTheDocument();

        const links = await screen.findAllByRole("link");
        expect(links).toHaveLength(5);
        expect(links[2]).toHaveAttribute(
          "aria-label",
          "Help (opens in a new tab)",
        );
      });
    });
  });

  describe("Pupils area", () => {
    describe("links sections", () => {
      it("renders year buttons", async () => {
        renderWithTheme(
          <TopNavDropdown
            {...({
              ...topNavFixture,
              activeArea: "PUPILS",
              selectedMenu: "primary",
            } as TopNavDropdownProps)}
          />,
        );

        const links = await screen.findAllByRole("link");
        expect(links).toHaveLength(6);
        expect(links[0]).toHaveTextContent("Year 1");
      });
    });
  });
});
