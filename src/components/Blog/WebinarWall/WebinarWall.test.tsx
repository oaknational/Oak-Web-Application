import userEvent from "@testing-library/user-event";

import noop from "../../../__tests__/__helpers__/noop";
import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import WebinarWall, { WebinarWallProps } from "./WebinarWall";

const props: WebinarWallProps = {
  headingTag: "h5",
  headingText: "Register to view",
  text: "You have to reigster if you want to view this content......!",
  buttonOnClick: noop,
  buttonHref: "https://www.example.com",
  buttonText: "Register",
  buttonSuffixA11y: "for webinars",
};
describe("WebinarWall", () => {
  test("renders heading with correct tag and content", () => {
    const { getByRole } = renderWithTheme(<WebinarWall {...props} />);

    const heading = getByRole("heading", { level: 5 });
    expect(heading).toHaveTextContent("Register to view");
  });
  test("clicking button (link) calls onClick()", async () => {
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(
      <WebinarWall {...props} buttonOnClick={onClick} />
    );

    const button = getByRole("link");
    const user = userEvent.setup();
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  test("button (link) has a11y name with enough context", async () => {
    // visible label is just "Register", which on its own lacks context
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(
      <WebinarWall {...props} buttonOnClick={onClick} />
    );

    const button = getByRole("link");
    expect(button).toHaveAccessibleName("Register for webinars");
  });
});
