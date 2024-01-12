import userEvent from "@testing-library/user-event";

import UpcomingWebinarWall, {
  UpcomingWebinarWallProps,
} from "./UpcomingWebinarWall";

import noop from "@/__tests__/__helpers__/noop";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const props: UpcomingWebinarWallProps = {
  headingTag: "h5",
  headingText: "Register to view",
  buttonOnClick: noop,
  buttonHref: "https://www.example.com",
  buttonText: "Register",
  buttonSuffixA11y: "for webinars",
};
describe("UpcomingWebinarWall", () => {
  test("renders heading with correct tag and content", () => {
    const { getByRole } = renderWithTheme(<UpcomingWebinarWall {...props} />);

    const heading = getByRole("heading", { level: 5 });
    expect(heading).toHaveTextContent("Register to view");
  });
  test("clicking button (link) calls onClick()", async () => {
    const onClick = vi.fn();
    const { getByRole } = renderWithTheme(
      <UpcomingWebinarWall {...props} buttonOnClick={onClick} />,
    );

    const button = getByRole("link");
    const user = userEvent.setup();
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  test("button (link) has a11y name with enough context", async () => {
    // visible label is just "Register", which on its own lacks context
    const onClick = vi.fn();
    const { getByRole } = renderWithTheme(
      <UpcomingWebinarWall {...props} buttonOnClick={onClick} />,
    );

    const button = getByRole("link");
    expect(button).toHaveAccessibleName("Register for webinars");
  });
});
