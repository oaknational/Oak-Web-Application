import { act, screen } from "@testing-library/react";

import TopNavDropdown, { TopNavDropdownProps } from "./TopNavDropdown";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

describe("TopNavDropdown", () => {
  describe("Teachers area", () => {
    describe("phases sections", () => {
      it("renders keystage menu, defaulting and focussing on the first keystage", async () => {
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
        expect(keystageButtons[0]).toHaveFocus();
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

      it("focuses on first subject button when keystage is clicked", async () => {
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
        act(() => {
          keystageButtons[0]?.click();
        });

        const subjectButtons = await screen.findAllByRole("link");

        expect(subjectButtons[0]).toHaveFocus();
      });
    });

    describe("links sections", () => {
      it("renders heading and links with first link in focus", async () => {
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
        expect(links[0]).toHaveFocus();
      });

      it("renders external links correctly", async () => {
        renderWithTheme(
          <TopNavDropdown
            {...({
              ...topNavFixture,
              activeArea: "TEACHERS",
              selectedMenu: "guidance",
            } as TopNavDropdownProps)}
          />,
        );

        const links = await screen.findAllByRole("link");
        expect(links[2]).toHaveAttribute(
          "aria-label",
          "Help (opens in a new tab)",
        );
      });
    });
  });

  describe("Pupils area", () => {
    describe("links sections", () => {
      it("renders year buttons with first year button in focus", async () => {
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
        expect(links[0]).toHaveFocus();
      });
    });
  });
});
