import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import { createRef } from "react";
import { vi } from "vitest";

import AppHeaderMenu from "./AppHeaderMenu";

import { MenuProvider } from "@/context/Menu";
import { menuContext } from "@/context/Menu/MenuProvider";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import IconButton from "@/components/SharedComponents/Button/IconButton";

vi.mock("next/dist/client/router", () => require("next-router-mock"));

describe("AppHeaderMenu", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/lesson-planning");
  });

  test("it renders with a close button", () => {
    const { getByLabelText } = renderWithTheme(
      <MenuProvider>
        <AppHeaderMenu menuButtonRef={null} />
      </MenuProvider>,
    );

    expect(getByLabelText("Close Menu")).toBeInTheDocument();
  });

  test("it is hidden and not expanded by default", () => {
    const { getByLabelText, getByTestId } = renderWithTheme(
      <MenuProvider>
        <AppHeaderMenu menuButtonRef={null} />
      </MenuProvider>,
    );

    expect(getByLabelText("Close Menu")).not.toBeVisible();
    expect(getByTestId("menu")).not.toBeVisible();
    expect(getByTestId("menu")).toHaveAttribute("aria-expanded", "false");
  });

  test("if menu context open is true it is visible and expanded", () => {
    const menuValue = {
      open: true,
      openMenu: vi.fn(),
      closeMenu: vi.fn(),
    };

    const { getByLabelText, getByTestId } = renderWithTheme(
      <menuContext.Provider value={menuValue}>
        <AppHeaderMenu menuButtonRef={null} />
      </menuContext.Provider>,
    );

    expect(getByLabelText("Close Menu")).toBeVisible();
    expect(getByTestId("menu")).toBeVisible();
    expect(getByTestId("menu")).toHaveAttribute("aria-expanded", "true");
  });

  test("clicking the close button invokes the closeMenu callback", async () => {
    const menuValue = {
      open: true,
      openMenu: vi.fn(),
      closeMenu: vi.fn(),
    };

    const { getByLabelText } = renderWithTheme(
      <menuContext.Provider value={menuValue}>
        <AppHeaderMenu menuButtonRef={null} />
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
      openMenu: vi.fn(),
      closeMenu: vi.fn(),
    };

    const { getByLabelText } = renderWithTheme(
      <menuContext.Provider value={menuValue}>
        <AppHeaderMenu menuButtonRef={null} />
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
      openMenu: vi.fn(),
      closeMenu: vi.fn(),
    };

    const { getByLabelText } = renderWithTheme(
      <menuContext.Provider value={menuValue}>
        <AppHeaderMenu menuButtonRef={null} />
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
      openMenu: vi.fn(),
      closeMenu: vi.fn(),
    };

    renderWithTheme(
      <menuContext.Provider value={menuValue}>
        <AppHeaderMenu menuButtonRef={null} />
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
      openMenu: vi.fn(),
      closeMenu: vi.fn(),
    };

    const { rerender, getByLabelText } = renderWithTheme(
      <menuContext.Provider value={menuValue}>
        <IconButton
          aria-label="Open Menu"
          icon={"hamburger"}
          variant={"minimal"}
          size={"large"}
          ref={menuButtonRef}
          onClick={vi.fn()}
        />
        <AppHeaderMenu menuButtonRef={menuButtonRef} />
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
          onClick={vi.fn()}
        />
        <AppHeaderMenu menuButtonRef={menuButtonRef} />
      </menuContext.Provider>,
    );

    const menuButton = getByLabelText("Open Menu");

    // wait for animation to complete
    waitFor(() => {
      expect(menuButton).toHaveFocus();
    });
  });
});
