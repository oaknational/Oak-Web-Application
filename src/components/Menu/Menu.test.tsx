/**
 * @jest-environment jsdom
 */
import React, { FC, useContext } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { renderHook } from "@testing-library/react-hooks";

import { MenuProvider } from "../../context/Menu";
import theme from "../../styles/theme";
import IconButton from "../Button/IconButton";
import { menuContext } from "../../context/Menu/MenuProvider";

import Menu from "./Menu";

const Providers: FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <MenuProvider>{children}</MenuProvider>
    </ThemeProvider>
  );
};

describe("The Menu", () => {
  //   it("renders", () => {
  //     render(<Menu />, { wrapper: Providers });
  //     const button = screen.getByRole("button");
  //     expect(button).toBeInTheDocument();
  //   });

  //   it("updates the text of the search context", async () => {
  //     render(<Menu />, { wrapper: Providers });
  //     const user = userEvent.setup();

  //     const searchField = screen.getByRole("searchbox");
  //     await user.click(searchField);
  //     await user.keyboard(text);

  //     const searchButton = screen.getByRole("button");
  //     await user.click(searchButton);

  //     expect(setTextSpy).toHaveBeenCalledWith(text);
  //   });

  const menuContents = "Some menu contents";

  beforeAll(() => {
    const { result } = renderHook(() => useContext(menuContext));
    const { toggleMenu } = result.current;

    render(
      <div data-test-id="menu-container">
        <IconButton
          aria-label="Menu"
          icon={"Hamburger"}
          variant={"minimal"}
          onClick={() => {
            console.debug("I AM HERE!!!!");
            console.debug("I AM HERE!!!!");
            console.debug("I AM HERE!!!!");
            console.debug("I AM HERE!!!!");
            console.debug("I AM HERE!!!!");
            console.debug("I AM HERE!!!!");
            console.debug("I AM HERE!!!!");

            toggleMenu();
          }}
        />
        <Menu>{menuContents}</Menu>
      </div>,
      { wrapper: Providers }
    );
  });

  test("clicking on the hamburger button opens the menu", () => {
    const user = userEvent.setup();
    const hamburgerButton = screen.getByLabelText("Menu");
    user.click(hamburgerButton);
    console.debug(screen.getByTestId("menu-container"));
    const { getByText } = within(screen.getByTestId("menu-container"));
    expect(getByText(menuContents)).toBeInTheDocument();
  });

  //   test("the menu can be opened by using the keyboard", () => {});

  //   test("clicking on the close button closes the menu", () => {});

  //   test("clicking on the overlay closes the menu", () => {});

  //   test("the menu can be closed by using the keyboard", () => {});

  //   test("When the menu is open you cannot tab outside of it", () => {});
});
