import mockRouter from "next-router-mock";

import { MenuProvider } from "../../context/Menu";
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
});
