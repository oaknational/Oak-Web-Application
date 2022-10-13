import userEvent from "@testing-library/user-event";

import { MenuProvider } from "../../context/Menu";
import { menuContext } from "../../context/Menu/MenuProvider";
import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import MenuBackdrop from "./MenuBackdrop";

describe("menu backdrop", () => {
  test("if menu is closed it is hidden", () => {
    const { getByTestId } = renderWithTheme(
      <MenuProvider>
        <MenuBackdrop state="exited" />
      </MenuProvider>
    );

    expect(getByTestId("menu-backdrop")).not.toBeVisible();
  });

  test("if menu open is open it is visible", () => {
    const { getByTestId } = renderWithTheme(
      <MenuProvider>
        <MenuBackdrop state="entering" />
      </MenuProvider>
    );

    expect(getByTestId("menu-backdrop")).toBeVisible();
  });

  test("clicking the backdrop anywhere runs the closeMenu callback", async () => {
    const menuValue = {
      open: true,
      toggleMenu: jest.fn(),
      closeMenu: jest.fn(),
    };

    const { getByTestId } = renderWithTheme(
      <menuContext.Provider value={menuValue}>
        <MenuBackdrop state="entered" />
      </menuContext.Provider>
    );
    const user = userEvent.setup();
    const backdrop = getByTestId("menu-backdrop");

    await user.click(backdrop);

    expect(menuValue.closeMenu).toHaveBeenCalled();
  });
});
