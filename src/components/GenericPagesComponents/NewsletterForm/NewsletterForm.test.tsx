import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { computeAccessibleDescription } from "dom-accessibility-api";

import NewsletterForm from "./NewsletterForm";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import OakError from "@/errors/OakError";
import waitForNextTick from "@/__tests__/__helpers__/waitForNextTick";

vi.setConfig({
  testTimeout: 10000,
});

const onSubmit = vi.fn();

const render = renderWithProviders();

describe("NewsletterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("user can fill out and submit form with keyboard", async () => {
    render(<NewsletterForm descriptionId="id1" id={"1"} onSubmit={onSubmit} />);

    const user = userEvent.setup();

    // tab -> name
    await user.tab();
    await user.keyboard("a name");
    // tab -> email
    await user.tab();
    await user.keyboard("email@example.com");
    // tab => dropdown select
    await user.tab();
    // open dropdown select
    await user.keyboard("{Enter}");
    await user.keyboard("{arrowdown}");
    await user.keyboard("{arrowdown}");
    // confirm select value
    await user.keyboard("{Enter}");

    // hack to wait for dropdown to close
    await waitForNextTick();

    await user.tab();
    await user.keyboard("{Enter}");

    // Hack
    await waitForNextTick(100);

    expect(onSubmit).toHaveBeenCalledWith({
      name: "a name",
      email: "email@example.com",
      userRole: "Student",
    });
  });
  test("should display error hint on blur if no name is entered", async () => {
    const { getByPlaceholderText } = render(
      <NewsletterForm descriptionId="id1" id={"1"} onSubmit={onSubmit} />,
    );

    const input = getByPlaceholderText("Anna Smith");
    const user = userEvent.setup();
    await user.click(input);
    await user.tab();

    // HACK: wait for next tick
    await waitForNextTick();

    const description = computeAccessibleDescription(input);
    expect(description).toBe("Enter a name");
  });
  test("should display error hint on blur if name more than 60 chars", async () => {
    const { getByPlaceholderText } = render(
      <NewsletterForm descriptionId="id1" id={"1"} onSubmit={onSubmit} />,
    );

    const input = getByPlaceholderText("Anna Smith");
    const user = userEvent.setup();
    await user.click(input);
    await user.keyboard(
      "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii",
    );
    await user.tab();

    // HACK: wait for next tick
    await waitForNextTick();

    const description = computeAccessibleDescription(input);
    expect(description).toBe("Name must contain fewer than 60 charaters");
  });
  test("should display error hint on blur if no email is entered", async () => {
    const { getByPlaceholderText } = render(
      <NewsletterForm descriptionId="id1" id={"1"} onSubmit={onSubmit} />,
    );

    const input = getByPlaceholderText("anna@amail.com");
    const user = userEvent.setup();
    await user.click(input);
    await user.tab();

    // HACK: wait for next tick
    await waitForNextTick();

    const description = computeAccessibleDescription(input);
    expect(description).toBe("Enter an email");
  });
  test("should display error hint on blur email not formatted correctly", async () => {
    const { getByPlaceholderText } = render(
      <NewsletterForm descriptionId="id1" id={"1"} onSubmit={onSubmit} />,
    );

    const input = getByPlaceholderText("anna@amail.com");
    const user = userEvent.setup();
    await user.click(input);
    await user.keyboard("not an email");
    await user.tab();

    // HACK: wait for next tick
    await waitForNextTick();

    const description = computeAccessibleDescription(input);
    expect(description).toBe("Enter a valid email");
  });
  test("form cannot be submitted if not complete", async () => {
    const onSubmit = vi.fn();
    const { getByRole, getByPlaceholderText } = render(
      <NewsletterForm descriptionId="id1" id={"1"} onSubmit={onSubmit} />,
    );

    const user = userEvent.setup();
    const email = getByPlaceholderText("anna@amail.com");

    const submit = getByRole("button", { name: "Sign up to the newsletter" });
    await user.type(email, "joebloggs@example.com");

    await user.click(submit);

    expect(onSubmit).toHaveBeenCalledTimes(0);
  });
  test("onSubmit() should not be called if form invalid", async () => {
    const { getByRole } = render(
      <NewsletterForm descriptionId="id1" id={"1"} onSubmit={onSubmit} />,
    );

    const submit = getByRole("button", { name: "Sign up to the newsletter" });
    const user = userEvent.setup();
    await user.click(submit);

    expect(onSubmit).not.toHaveBeenCalled();
  });
  test("should display correct message if OakError thrown from onSubmit()", async () => {
    const onSubmit = () =>
      Promise.reject(new OakError({ code: "hubspot/invalid-email" }));
    const { getByRole, getByPlaceholderText } = render(
      <NewsletterForm descriptionId="id1" id={"1"} onSubmit={onSubmit} />,
    );

    const user = userEvent.setup();
    const name = getByPlaceholderText("Anna Smith");
    await user.type(name, "joe bloggs");
    const email = getByPlaceholderText("anna@amail.com");
    await user.type(email, "joebloggs@example.com");
    const submit = getByRole("button", { name: "Sign up to the newsletter" });
    await user.click(submit);

    // HACK: wait for next tick
    await waitForNextTick();

    const error = getByRole("alert");
    expect(error).toHaveTextContent(
      "Thank you, that's been received, but please check as your email doesn't look quite right.",
    );
  });
  test("should display default message if no OakError", async () => {
    const onSubmit = () => Promise.reject();
    const { getByRole, getByPlaceholderText } = render(
      <NewsletterForm descriptionId="id1" id={"1"} onSubmit={onSubmit} />,
    );

    const user = userEvent.setup();
    const name = getByPlaceholderText("Anna Smith");
    await user.type(name, "joe bloggs");
    const email = getByPlaceholderText("anna@amail.com");
    await user.type(email, "joebloggs@example.com");
    const submit = getByRole("button", { name: "Sign up to the newsletter" });
    await user.click(submit);

    // HACK: wait for next tick
    await waitForNextTick();

    const error = getByRole("alert");
    expect(error).toHaveTextContent("An unknown error occurred");
  });
});
