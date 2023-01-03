import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { computeAccessibleDescription } from "dom-accessibility-api";

import {
  FormDefinition,
  FormField,
} from "../../../common-lib/forms/FormDefinition";
import OakError from "../../../errors/OakError";
import renderWithTheme from "../../../__tests__/__helpers__/renderWithTheme";

import DynamicForm, { DynamicFormField } from "./DynamicForm";

jest.setTimeout(10000);

const onSubmit = jest.fn();

describe("DynamicForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("DynamicFormField", () => {
    it("should render string fields", () => {
      const field = {
        name: "name",
        label: "Name",
        type: "string",
        placeholder: "Anna Smith",
        required: true,
      } as FormField;

      const { getByPlaceholderText } = renderWithTheme(
        <DynamicFormField field={field} register={jest.fn()} />
      );

      const input = getByPlaceholderText("Anna Smith");
      expect(input).toHaveAccessibleName("Name");
      expect(input).toBeInTheDocument();

      // See comment in DynamicFormField about setting `required`
      // expect(input).toBeRequired();
    });
  });

  it("should use the form's submit button label", () => {
    const form = {
      formId: "abc-def",
      portalId: 12345,
      submitButtonLabel: "Click me!",
      successMessage: "Thanks!",
      fields: [],
    } as FormDefinition;

    const { getByRole } = renderWithTheme(
      <DynamicForm form={form} onSubmit={onSubmit} />
    );

    const submitButton = getByRole("button");

    expect(submitButton).toHaveAccessibleName("Click me!");
  });

  it.todo("should show the forms success message on successful submission");

  it("should not render hidden fields", () => {
    const form = {
      formId: "abc-def",
      portalId: 12345,
      fields: [
        {
          name: "name",
          label: "Name",
          type: "string",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          hidden: true,
        },
      ],
    } as FormDefinition;

    const { getAllByRole, getByLabelText } = renderWithTheme(
      <DynamicForm form={form} onSubmit={onSubmit} />
    );
    const inputs = getAllByRole("textbox");
    const nameField = getByLabelText("Name");

    expect(inputs).toHaveLength(1);
    expect(nameField).toBeInTheDocument();
  });

  describe("conditional rendering", () => {
    const form: FormDefinition = {
      formId: "abc-def",
      portalId: 12345,
      fields: [
        {
          name: "name",
          label: "Name",
          type: "string",
          required: true,
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          renderWhen: [
            {
              operator: "eq",
              field: "name",
              value: "Ross",
            },
          ],
        },
      ],
    } as FormDefinition;

    it("should not render a conditional field when the condition is not met", () => {
      const { queryByLabelText } = renderWithTheme(
        <DynamicForm form={form} onSubmit={onSubmit} />
      );

      const nameField = queryByLabelText("Name");
      const emailField = queryByLabelText("Email");

      expect(nameField).toBeInTheDocument();
      expect(emailField).not.toBeInTheDocument();
    });

    it("should render a conditional field when the condition is met", async () => {
      const { queryByLabelText } = renderWithTheme(
        <DynamicForm form={form} onSubmit={onSubmit} />
      );

      const nameField = queryByLabelText("Name");
      const user = userEvent.setup();

      nameField?.focus();
      await user.keyboard("Ross");

      const emailField = queryByLabelText("Email");

      expect(nameField).toBeInTheDocument();
      expect(emailField).toBeInTheDocument();
    });
  });

  const newsletterFormDef = {
    formId: "abc-def",
    portalId: 12345,
    submitButtonLabel: "Sign up",
    successMessage: "Thanks!",
    fields: [
      {
        name: "name",
        label: "Name",
        type: "string",
        required: true,
        placeholder: "Anna Smith",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "anna@amail.com",
      },
      {
        name: "userRole",
        label: "Role",
        type: "select",
        required: true,
        placeholder: "What describes you best?",
        options: [
          { label: "Teacher", value: "Teacher" },
          { label: "Pupil", value: "Pupil" },
          { label: "Student", value: "Student" },
        ],
      },
    ],
  } as FormDefinition;

  test("user can fill out and submit form with keyboard", async () => {
    renderWithTheme(
      <DynamicForm form={newsletterFormDef} onSubmit={onSubmit} />
    );

    const user = userEvent.setup();

    // @TODO: How to handle privacy policy?
    // tab -> privacy policy link
    // await user.tab();
    // tab -> name
    await user.tab();
    await user.keyboard("a name");

    // tab -> email
    await user.tab();
    await user.keyboard("email@example.com");

    // tab -> dropdown select
    await user.tab();
    // open dropdown select, select 2nd option
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
    const { getByPlaceholderText } = renderWithTheme(
      <DynamicForm form={newsletterFormDef} onSubmit={onSubmit} />
    );

    const nameInput = getByPlaceholderText("Anna Smith");
    const user = userEvent.setup();
    await user.click(nameInput);
    await user.tab();

    await waitFor(() => {
      const description = computeAccessibleDescription(nameInput);
      expect(description).toBe("Name can't be empty");
    });
  });

  test("should display all error hints on submit", async () => {
    const { getByRole, getByPlaceholderText } = renderWithTheme(
      <DynamicForm form={newsletterFormDef} onSubmit={onSubmit} />
    );

    const nameInput = getByPlaceholderText("Anna Smith");
    // initially error is not shown
    expect(computeAccessibleDescription(nameInput)).toBe("");
    const submit = getByRole("button", { name: "Sign up" });
    const user = userEvent.setup();
    await user.click(submit);

    // error is shown after form is submitted

    await waitFor(() => {
      const description = computeAccessibleDescription(nameInput);
      expect(description).toBe("Name can't be empty");
    });
  });

  test("onSubmit() should not be called if form invalid", async () => {
    const { getByRole } = renderWithTheme(
      <DynamicForm form={newsletterFormDef} onSubmit={onSubmit} />
    );

    const submit = getByRole("button", { name: "Sign up" });
    const user = userEvent.setup();
    await user.click(submit);

    expect(onSubmit).not.toHaveBeenCalled();
  });

  /**
   * These skipped tests should probably belong to HubspotForm wrapper
   * around DynamicForm. Currently copied from NewsletterForm.test.tsx
   */
  test.skip("should display correct message if OakError thrown from onSubmit()", async () => {
    const onSubmit = () =>
      Promise.reject(new OakError({ code: "hubspot/invalid-email" }));
    const { getByRole, getByPlaceholderText } = renderWithTheme(
      <DynamicForm form={newsletterFormDef} onSubmit={onSubmit} />
    );

    const user = userEvent.setup();
    const name = getByPlaceholderText("Anna Smith");
    await user.type(name, "joe bloggs");
    const email = getByPlaceholderText("anna@amail.com");
    await user.type(email, "joebloggs@example.com");
    const submit = getByRole("button", { name: "Sign up" });
    await user.click(submit);

    const error = getByRole("alert");
    expect(error).toHaveTextContent(
      "Thank you, that's been received, but please check as your email doesn't look quite right."
    );
  });

  test.skip("should display default message if no OakError", async () => {
    const onSubmit = () => Promise.reject();
    const { getByRole, getByPlaceholderText } = renderWithTheme(
      <DynamicForm form={newsletterFormDef} onSubmit={onSubmit} />
    );

    const user = userEvent.setup();
    const name = getByPlaceholderText("Anna Smith");
    await user.type(name, "joe bloggs");
    const email = getByPlaceholderText("anna@amail.com");
    await user.type(email, "joebloggs@example.com");
    const submit = getByRole("button", { name: "Sign up" });
    await user.click(submit);

    const error = getByRole("alert");
    expect(error).toHaveTextContent("An unknown error occurred");
  });
});
