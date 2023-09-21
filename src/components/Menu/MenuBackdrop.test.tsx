import mockRouter from "next-router-mock";

import { MenuProvider } from "../../context/Menu";
import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import MenuBackdrop from "./MenuBackdrop";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

describe("menu backdrop", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/");
  });

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
});
