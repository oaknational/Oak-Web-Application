import userEvent from "@testing-library/user-event";

import noop from "../../../__tests__/__helpers__/noop";
import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import WebinarRegistration, {
  WebinarRegistrationProps,
} from "./WebinarRegistration";

jest.mock("next/dist/client/router", () => require("next-router-mock"));
jest.mock("../../../context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    identify: jest.fn(),
  }),
}));

const props: WebinarRegistrationProps = {
  headingTag: "h5",
  onSubmit: noop,
};
describe("WebinarRegistration", () => {
  test("renders heading with correct tag and content", () => {
    const { getByRole } = renderWithTheme(<WebinarRegistration {...props} />);

    const heading = getByRole("heading", { level: 5 });
    expect(heading).toHaveTextContent("Almost there");
  });
  test("clicking button does not call onSubmit() if form not filled out", async () => {
    const onSubmit = jest.fn();
    const { getByRole } = renderWithTheme(
      <WebinarRegistration {...props} onSubmit={onSubmit} />,
    );

    const button = getByRole("button", { name: "Sign up" });
    const user = userEvent.setup();
    await user.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });
  test("clicking button calls onSubmit() if form filled out", async () => {
    const onSubmit = jest.fn();
    const { getByRole } = renderWithTheme(
      <WebinarRegistration {...props} onSubmit={onSubmit} />,
    );

    const user = userEvent.setup();
    await user.click(getByRole("textbox", { name: "Email" }));
    await user.keyboard("test@thenational.academy");
    await user.click(getByRole("textbox", { name: "Name" }));
    await user.keyboard("Antonia");
    await user.click(getByRole("button", { name: "Sign up" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
  test("button has a11y name with enough context", async () => {
    // visible label is just "Register", which on its own lacks context
    const onSubmit = jest.fn();
    const { getByRole } = renderWithTheme(
      <WebinarRegistration {...props} onSubmit={onSubmit} />,
    );

    const button = getByRole("button", { name: "Sign up" });
    expect(button).toHaveAccessibleName("Sign up");
  });
});
