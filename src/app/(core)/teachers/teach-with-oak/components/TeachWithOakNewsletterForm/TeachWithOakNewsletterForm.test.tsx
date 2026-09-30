import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import TeachWithOakNewsletterForm from "./TeachWithOakNewsletterForm";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import waitForNextTick from "@/__tests__/__helpers__/waitForNextTick";

const renderWithTheme = renderWithProviders();

const onSubmit = jest.fn();
jest.mock(
  "@/components/GenericPagesComponents/NewsletterForm/useNewsletterForm",
  () => ({
    __esModule: true,
    default: () => ({
      onSubmit: (...args: []) => onSubmit(args),
    }),
  }),
);

describe("TeachWithOakNewsletterForm", () => {
  it("should render the form correctly", () => {
    const { container } = renderWithTheme(<TeachWithOakNewsletterForm />);

    expect(container.querySelector("form")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign up to the newsletter" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Name (required)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Email (required)" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("forwards completed form values to onSubmit", async () => {
    renderWithTheme(<TeachWithOakNewsletterForm />);

    const user = userEvent.setup();
    await user.type(
      screen.getByRole("textbox", { name: "Name (required)" }),
      "Ada Lovelace",
    );
    await user.type(
      screen.getByRole("textbox", { name: "Email (required)" }),
      "ada@example.com",
    );
    await user.selectOptions(screen.getByRole("combobox"), "Student");
    await user.click(
      screen.getByRole("button", { name: "Sign up to the newsletter" }),
    );
    await waitForNextTick();

    expect(onSubmit).toHaveBeenCalledWith([
      {
        name: "Ada Lovelace",
        email: "ada@example.com",
        userRole: "Student",
      },
    ]);
  });
});
