import userEvent from "@testing-library/user-event";

import WebinarRegistration, {
  WebinarRegistrationProps,
} from "./WebinarRegistration";

import noop from "@/__tests__/__helpers__/noop";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

vi.mock("next/dist/client/router", () => require("next-router-mock"));
vi.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    identify: vi.fn(),
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
    const onSubmit = vi.fn();
    const { getByRole } = renderWithTheme(
      <WebinarRegistration {...props} onSubmit={onSubmit} />,
    );

    const button = getByRole("button", { name: "Sign up to the newsletter" });
    const user = userEvent.setup();
    await user.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });
  test("clicking button calls onSubmit() if form filled out", async () => {
    const onSubmit = vi.fn();
    const { getByRole, getByPlaceholderText } = renderWithTheme(
      <WebinarRegistration {...props} onSubmit={onSubmit} />,
    );

    const user = userEvent.setup();

    const name = getByPlaceholderText("Anna Smith");
    await user.type(name, "joe bloggs");
    const email = getByPlaceholderText("anna@amail.com");
    await user.type(email, "joebloggs@example.com");

    await user.click(
      getByRole("button", { name: "Sign up to the newsletter" }),
    );
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
  test("button has a11y name with enough context", async () => {
    // visible label is just "Register", which on its own lacks context
    const onSubmit = vi.fn();
    const { getByRole } = renderWithTheme(
      <WebinarRegistration {...props} onSubmit={onSubmit} />,
    );

    const button = getByRole("button", { name: "Sign up to the newsletter" });
    expect(button).toHaveAccessibleName("Sign up to the newsletter");
  });
});
