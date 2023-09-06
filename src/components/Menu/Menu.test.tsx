import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import { createRef } from "react";

import { MenuProvider } from "../../context/Menu";
import { menuContext } from "../../context/Menu/MenuProvider";
import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";
import IconButton from "../Button/IconButton";

import Menu from "./Menu";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("Menu", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/lesson-planning");
  });

  test("it renders with a close button", () => {
    const { getByLabelText } = renderWithTheme(
      <MenuProvider>
        <Menu menuButtonRef={null} />
      </MenuProvider>,
    );

    expect(getByLabelText("Close Menu")).toBeInTheDocument();
  });

  test("it is hidden by default", () => {
    const { getByLabelText } = renderWithTheme(
      <MenuProvider>
        <Menu menuButtonRef={null} />
      </MenuProvider>,
    );

    expect(getByLabelText("Close Menu")).not.toBeVisible();
  });

  test("if menu context open is true it is visible", () => {
    const menuValue = {
      open: true,
      openMenu: jest.fn(),
      closeMenu: jest.fn(),
    };

    const { getByLabelText } = renderWithTheme(
      <menuContext.Provider value={menuValue}>
        <Menu menuButtonRef={null} />
      </menuContext.Provider>,
    );

    expect(getByLabelText("Close Menu")).toBeVisible();
  });

  test("clicking the close button invokes the closeMenu callback", async () => {
    const menuValue = {
      open: true,
      openMenu: jest.fn(),
      closeMenu: jest.fn(),
    };

    const { getByLabelText } = renderWithTheme(
      <menuContext.Provider value={menuValue}>
        <Menu menuButtonRef={null} />
      </menuContext.Provider>,
    );
    const user = userEvent.setup();
    const closeButton = getByLabelText("Close Menu");

    await user.click(closeButton);

    expect(menuValue.closeMenu).toHaveBeenCalledTimes(2);
  });
  test("it has aria-expanded true when open", async () => {
    const menuValue = {
      open: true,
      openMenu: jest.fn(),
      closeMenu: jest.fn(),
    };

    const { getByLabelText } = renderWithTheme(
      <menuContext.Provider value={menuValue}>
        <Menu menuButtonRef={null} />
      </menuContext.Provider>,
    );
    const user = userEvent.setup();
    const closeButton = getByLabelText("Close Menu");

    await user.click(closeButton);

    expect(closeButton).toHaveAttribute("aria-expanded", "true");
  });
  test("it has aria-expanded false when closed", async () => {
    const menuValue = {
      open: false,
      openMenu: jest.fn(),
      closeMenu: jest.fn(),
    };

    const { getByLabelText } = renderWithTheme(
      <menuContext.Provider value={menuValue}>
        <Menu menuButtonRef={null} />
      </menuContext.Provider>,
    );
    const user = userEvent.setup();
    const closeButton = getByLabelText("Close Menu");

    await user.click(closeButton);

    expect(closeButton).toHaveAttribute("aria-expanded", "false");
  });

  // This isn't working because the Escape event isn't triggering the
  // react-aria useKeyboard Escape key code path.
  // See https://github.com/testing-library/user-event/issues/969
  // Not necessarily to same underlying cause, but potentially related.
  test.skip("pressing the escape key invokes the closeMenu callback", async () => {
    const menuValue = {
      open: true,
      openMenu: jest.fn(),
      closeMenu: jest.fn(),
    };

    renderWithTheme(
      <menuContext.Provider value={menuValue}>
        <Menu menuButtonRef={null} />
      </menuContext.Provider>,
    );
    const user = userEvent.setup();
    await user.keyboard("{Escape}");

    /**
     * closeMenu() gets called once initially in a useEffect, so this test asserts
     * that it gets called a second time
     */
    expect(menuValue.closeMenu).toHaveBeenCalledTimes(2);
  });

  test("it returns focus to the button it was passed as a ref when closed", async () => {
    const menuButtonRef = createRef<HTMLButtonElement>();

    const menuValue = {
      open: true,
      openMenu: jest.fn(),
      closeMenu: jest.fn(),
    };

    const { rerender, getByLabelText } = renderWithTheme(
      <menuContext.Provider value={menuValue}>
        <IconButton
          aria-label="Open Menu"
          icon={"hamburger"}
          variant={"minimal"}
          size={"large"}
          ref={menuButtonRef}
          onClick={jest.fn}
        />
        <Menu menuButtonRef={menuButtonRef} />
      </menuContext.Provider>,
    );

    menuValue.open = false;

    rerender(
      <menuContext.Provider value={menuValue}>
        <IconButton
          aria-label="Open Menu"
          icon={"hamburger"}
          variant={"minimal"}
          size={"large"}
          ref={menuButtonRef}
          onClick={jest.fn}
        />
        <Menu menuButtonRef={menuButtonRef} />
      </menuContext.Provider>,
    );

    const menuButton = getByLabelText("Open Menu");

    // wait for animation to complete
    waitFor(() => {
      expect(menuButton).toHaveFocus();
    });
  });
});
