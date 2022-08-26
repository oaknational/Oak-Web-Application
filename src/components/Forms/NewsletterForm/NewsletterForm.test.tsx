import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { computeAccessibleDescription } from "dom-accessibility-api";

import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";
import OakError from "../../../errors/OakError";

import NewsletterForm from ".";

const onSubmit = jest.fn();

describe("NewsletterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("user can fill out and submit form with keyboard", async () => {
    renderWithProviders(<NewsletterForm onSubmit={onSubmit} />);

    const user = userEvent.setup();
    // tab -> privacy policy link
    await user.tab();
    // tab -> name
    await user.tab();
    await user.keyboard("a name");
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
    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 100)));
    await user.tab();
    await user.keyboard("{Enter}");

    expect(onSubmit).toHaveBeenCalledWith({
      name: "a name",
      email: "email@example.com",
      userRole: "Student",
    });
  });
  test("should display error hint on blur if no name is entered", async () => {
    const { getByPlaceholderText } = renderWithProviders(
      <NewsletterForm onSubmit={onSubmit} />
    );

    const input = getByPlaceholderText("Name");
    const user = userEvent.setup();
    await user.click(input);
    await user.tab();
    const description = computeAccessibleDescription(input);

    expect(description).toBe("Name can't be empty");
  });
  test("should display error hint on blur if name more than 60 chars", async () => {
    const { getByPlaceholderText } = renderWithProviders(
      <NewsletterForm onSubmit={onSubmit} />
    );

    const input = getByPlaceholderText("Name");
    const user = userEvent.setup();
    await user.click(input);
    await user.keyboard(
      "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"
    );
    await user.tab();
    const description = computeAccessibleDescription(input);

    expect(description).toBe("Name must contain fewer than 60 charaters");
  });
  test("should display error hint on blur if no email is entered", async () => {
    const { getByPlaceholderText } = renderWithProviders(
      <NewsletterForm onSubmit={onSubmit} />
    );

    const input = getByPlaceholderText("Email Address");
    const user = userEvent.setup();
    await user.click(input);
    await user.tab();
    const description = computeAccessibleDescription(input);

    expect(description).toBe("Email can't be empty");
  });
  test("should display error hint on blur email not formatted correctly", async () => {
    const { getByPlaceholderText } = renderWithProviders(
      <NewsletterForm onSubmit={onSubmit} />
    );

    const input = getByPlaceholderText("Email Address");
    const user = userEvent.setup();
    await user.click(input);
    await user.keyboard("not an email");
    await user.tab();
    const description = computeAccessibleDescription(input);

    expect(description).toBe("Email not valid");
  });
  test("should display all error hints on submit", async () => {
    const { getByLabelText, getByPlaceholderText } = renderWithProviders(
      <NewsletterForm onSubmit={onSubmit} />
    );

    const input = getByPlaceholderText("Name");
    // initially error is not shown
    expect(computeAccessibleDescription(input)).toBe("");
    const submit = getByLabelText("Sign up");
    const user = userEvent.setup();
    await user.click(submit);
    // error is shown after form is submitted
    expect(computeAccessibleDescription(input)).toBe("Name can't be empty");
  });
  test("onSubmit() should not be called if form invalid", async () => {
    const { getByLabelText } = renderWithProviders(
      <NewsletterForm onSubmit={onSubmit} />
    );

    const submit = getByLabelText("Sign up");
    const user = userEvent.setup();
    await user.click(submit);

    expect(onSubmit).not.toHaveBeenCalled();
  });
  test("should display correct message if OakError thrown from onSubmit()", async () => {
    const onSubmit = () =>
      Promise.reject(new OakError({ code: "hubspot/invalid-email" }));
    const { getByLabelText, getByPlaceholderText, getByRole } =
      renderWithProviders(<NewsletterForm onSubmit={onSubmit} />);

    const user = userEvent.setup();
    const name = getByPlaceholderText("Name");
    await user.type(name, "joe bloggs");
    const email = getByPlaceholderText("Email Address");
    await user.type(email, "joebloggs@example.com");
    const submit = getByLabelText("Sign up");
    await user.click(submit);

    const error = getByRole("alert");
    expect(error).toHaveTextContent(
      "Thank you, that's been received, but please check as your email doesn't look quite right."
    );
  });
  test("should display default message if no OakError", async () => {
    const onSubmit = () => Promise.reject();
    const { getByLabelText, getByPlaceholderText, getByRole } =
      renderWithProviders(<NewsletterForm onSubmit={onSubmit} />);

    const user = userEvent.setup();
    const name = getByPlaceholderText("Name");
    await user.type(name, "joe bloggs");
    const email = getByPlaceholderText("Email Address");
    await user.type(email, "joebloggs@example.com");
    const submit = getByLabelText("Sign up");
    await user.click(submit);

    const error = getByRole("alert");
    expect(error).toHaveTextContent("An unknown error occurred");
  });
});
