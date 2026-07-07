import UpcomingWebinarWall, {
  UpcomingWebinarWallProps,
} from "./UpcomingWebinarWall";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const props: UpcomingWebinarWallProps = {
  headingTag: "h5",
  headingText: "Register to view",

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
  test("button (link) has a11y name with enough context", async () => {
    // visible label is just "Register", which on its own lacks context
    const { getByRole } = renderWithTheme(<UpcomingWebinarWall {...props} />);

    const button = getByRole("link");
    expect(button).toHaveAccessibleName("Register for webinars");
  });
});
