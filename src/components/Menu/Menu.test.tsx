/**
 * @jest-environment jsdom
 */
import React from "react";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderHook, act } from "@testing-library/react-hooks";

import { MenuProvider } from "../../context/Menu";
import IconButton from "../Button/IconButton";
import { useMenuContext } from "../../context/Menu/MenuProvider";
import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Menu from "./Menu";

describe.skip("The Menu", () => {
  const menuContents = "Some menu contents";

  test("clicking on the hamburger button opens the menu", async () => {
    const { result } = renderHook(() => useMenuContext(), {
      wrapper: MenuProvider,
    });
    const { toggleMenu, open } = result.current;
    const { debug, rerender } = renderWithProviders(
      <nav role="navigation">
        <IconButton
          aria-label="Menu"
          icon={"Hamburger"}
          variant={"minimal"}
          onClick={() => {
            act(() => toggleMenu());
          }}
        />

        <Menu>{menuContents}</Menu>
      </nav>
    );
    const user = userEvent.setup();
    const hamburgerButton = screen.getByLabelText("Menu");
    await user.click(hamburgerButton);
    const { getByText } = within(screen.getByRole("navigation"));
    debug();

    rerender(
      <nav role="navigation">
        <IconButton
          aria-label="Menu"
          icon={"Hamburger"}
          variant={"minimal"}
          onClick={() => {
            act(() => toggleMenu());
          }}
        />
        <Menu>{menuContents}</Menu>
      </nav>
    );

    console.debug(open);
    expect(getByText(menuContents)).toBeInTheDocument();
  });

  //   test("the menu can be opened by using the keyboard", () => {});

  //   test("clicking on the close button closes the menu", () => {});

  //   test("clicking on the overlay closes the menu", () => {});

  //   test("the menu can be closed by using the keyboard", () => {});

  //   test("When the menu is open you cannot tab outside of it", () => {});
});
