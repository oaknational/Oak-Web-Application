import userEvent from "@testing-library/user-event";

import noop from "../../../__tests__/__helpers__/noop";
import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import WebinarWall from "./WebinarWall";

describe("WebinarWall", () => {
  test("renders heading with correct tag and content", () => {
    const { getByRole } = renderWithTheme(
      <WebinarWall headingTag="h5" onClick={noop} />
    );

    const heading = getByRole("heading", { level: 5 });
    expect(heading).toHaveTextContent("Register to view");
  });
  test("clicking 'Register' button calls onClick()", async () => {
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(
      <WebinarWall headingTag="h5" onClick={onClick} />
    );

    const button = getByRole("button", { name: "Register" });
    const user = userEvent.setup();
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
