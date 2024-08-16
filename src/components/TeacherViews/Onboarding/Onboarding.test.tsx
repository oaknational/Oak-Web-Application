import { fireEvent, screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import OnboardingView from "./Onboarding.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("Onboarding view", () => {
  it("renders a heading", async () => {
    renderWithProviders()(<OnboardingView />);
    const heading = await screen.findByRole("heading", {
      name: "Select your school",
    });
    expect(heading).toBeInTheDocument();
  });
  it("renders a school picker", async () => {
    renderWithProviders()(<OnboardingView />);
    const schoolPicker = await screen.findByTestId("search-combobox-input");
    expect(schoolPicker).toBeInTheDocument();
  });
  it("renders a Continue button", async () => {
    renderWithProviders()(<OnboardingView />);
    const continueButton = await screen.findByRole("button", {
      name: "Continue",
    });
    expect(continueButton).toBeInTheDocument();
    expect(continueButton).toBeDisabled();
  });
  it("renders terms and conditions text", async () => {
    renderWithProviders()(<OnboardingView />);
    const tsAndCs = await screen.findByText("Oak's terms & conditions", {
      exact: false,
    });
    expect(tsAndCs).toBeInTheDocument();
    expect(tsAndCs).toHaveAttribute("href", "/legal/terms-and-conditions");
  });
  it("renders contact us text", async () => {
    renderWithProviders()(<OnboardingView />);
    const contactUs = await screen.findByText("Contact us", { exact: false });
    expect(contactUs).toBeInTheDocument();
    expect(contactUs).toHaveAttribute("href", "/contact-us");
  });
  it("renders newsletter signup checkbox", () => {
    renderWithProviders()(<OnboardingView />);
    expect(
      screen.getByLabelText(
        "Sign up to receive helpful content via email. Unsubscribe at any time.",
      ),
    ).toBeInTheDocument();
  });
  it("should render the Controller component and handle checkbox change", async () => {
    renderWithProviders()(<OnboardingView />);

    const checkbox = await screen.findByRole("checkbox", {
      name: /Sign up to receive helpful content via email. Unsubscribe at any time./i,
    });
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
  });
  it("it enables the continue button when a school is selected", async () => {
    renderWithProviders()(<OnboardingView />);
    const continueButton = await screen.findByRole("button", {
      name: "Continue",
    });
    expect(continueButton).toBeDisabled();
    const inputBox = await screen.findByRole("combobox");

    const user = userEvent.setup();
    await user.type(inputBox, "Bea");
    const school = await screen.findByText("uvoir Primary School", {
      exact: false,
    });
    await user.click(school);
    expect(
      await screen.findByRole("button", {
        name: "Continue",
      }),
    ).toBeEnabled();
  });
  it("clears the input when a school is not completed", async () => {
    renderWithProviders()(<OnboardingView />);

    const inputBox = await screen.findByRole("combobox");

    const user = userEvent.setup();
    await user.type(inputBox, "Bea");
    await user.tab();
    expect(await screen.findByRole("combobox")).toHaveValue("");
  });

  describe("ManualEntrySchoolDetails component", () => {
    it("renders ManualEntrySchoolDetails component when Enter manually button clicked", async () => {
      renderWithProviders()(<OnboardingView />);

      expect(await screen.queryByText("School name")).toBeNull();
      expect(await screen.queryByText("School address")).toBeNull();

      const manualButton = await screen.findByRole("button", {
        name: "Enter manually",
      });

      userEvent.click(manualButton);

      expect(await screen.findByText("School name")).toBeInTheDocument();
      expect(await screen.findByText("School address")).toBeInTheDocument();
    });

    it("shows error message when school name is not entered correctly", async () => {
      renderWithProviders()(<OnboardingView />);
      const user = userEvent.setup();

      const manualButton = await screen.findByRole("button", {
        name: "Enter manually",
      });
      userEvent.click(manualButton);
      const inputBox = await screen.findByPlaceholderText("Type school name");
      await user.type(inputBox, "B");
      await user.tab();

      const schoolNameError = await screen.findByText("Enter school name");
      expect(schoolNameError).toBeInTheDocument();
    });
    it("shows error message when school address is not entered correctly", async () => {
      renderWithProviders()(<OnboardingView />);
      const user = userEvent.setup();

      const manualButton = await screen.findByRole("button", {
        name: "Enter manually",
      });
      userEvent.click(manualButton);
      const inputBox = await screen.findByPlaceholderText(
        "Type school address",
      );
      await user.type(inputBox, "B");
      await user.tab();

      const schoolAddressError = await screen.findByText(
        "Enter school address",
      );
      expect(schoolAddressError).toBeInTheDocument();
    });
    it("enables continue button when school name and address are entered", async () => {
      renderWithProviders()(<OnboardingView />);
      const user = userEvent.setup();

      const manualButton = await screen.findByRole("button", {
        name: "Enter manually",
      });
      userEvent.click(manualButton);

      expect(
        await screen.findByRole("button", {
          name: "Continue",
        }),
      ).toBeDisabled();

      const schoolNameInput =
        await screen.findByPlaceholderText("Type school name");
      const schoolAddressInput = await screen.findByPlaceholderText(
        "Type school address",
      );

      await user.type(schoolNameInput, "Old Swinford");
      await user.type(schoolAddressInput, "123 Oak Street");
      await user.tab();

      expect(
        await screen.findByRole("button", {
          name: "Continue",
        }),
      ).toBeEnabled();
    });
  });
});
