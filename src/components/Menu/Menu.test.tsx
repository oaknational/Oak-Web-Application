import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";

import { MenuProvider } from "../../context/Menu";
import { menuContext } from "../../context/Menu/MenuProvider";
import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import Menu from "./Menu";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("Menu", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/lesson-planning");
  });

  test("it has a close button", () => {
    const { getByLabelText } = renderWithTheme(
      <MenuProvider>
        <Menu />
      </MenuProvider>
    );

    expect(getByLabelText("Close Menu")).toBeInTheDocument();
  });

  test("clicking the close button runs the closeMenu callback", async () => {
    const menuValue = {
      open: true,
      toggleMenu: jest.fn(),
      closeMenu: jest.fn(),
    };

    const { getByLabelText } = renderWithTheme(
      <menuContext.Provider value={menuValue}>
        <Menu />
      </menuContext.Provider>
    );
    const user = userEvent.setup();
    const closeButton = getByLabelText("Close Menu");

    await user.click(closeButton);

    expect(menuValue.closeMenu).toHaveBeenCalled();
  });
});
