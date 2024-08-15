import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import SchoolSelectionView from "./SchoolSelection.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("Onboarding view", () => {
  it("renders a heading", async () => {
    renderWithProviders()(<SchoolSelectionView />);
    const heading = await screen.findByRole("heading", {
      name: "Select your school",
    });
    expect(heading).toBeInTheDocument();
  });
  it("renders a school picker", async () => {
    renderWithProviders()(<SchoolSelectionView />);
    const schoolPicker = await screen.findByTestId("search-combobox-input");
    expect(schoolPicker).toBeInTheDocument();
  });
  it("renders a Continue button", async () => {
    renderWithProviders()(<SchoolSelectionView />);
    const continueButton = await screen.findByRole("button", {
      name: "Continue",
    });
    expect(continueButton).toBeInTheDocument();
    expect(continueButton).toBeDisabled();
  });
  it("renders terms and conditions text", async () => {
    renderWithProviders()(<SchoolSelectionView />);
    const tsAndCs = await screen.findByText("Oak's terms & conditions", {
      exact: false,
    });
    expect(tsAndCs).toBeInTheDocument();
    expect(tsAndCs.closest("a")).toHaveAttribute(
      "href",
      "/legal/terms-and-conditions",
    );
  });
  it("renders contact us text", async () => {
    renderWithProviders()(<SchoolSelectionView />);
    const contactUs = await screen.findByText("Contact us", { exact: false });
    screen.debug(contactUs);
    expect(contactUs).toBeInTheDocument();
    expect(contactUs.closest("a")).toHaveAttribute("href", "/contact-us");
  });

  it("it enables the continue button when a school is selected", async () => {
    renderWithProviders()(<SchoolSelectionView />);
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
    renderWithProviders()(<SchoolSelectionView />);

    const inputBox = await screen.findByRole("combobox");

    const user = userEvent.setup();
    await user.type(inputBox, "Bea");
    await user.tab();
    expect(await screen.findByRole("combobox")).toHaveValue("");
  });
});
