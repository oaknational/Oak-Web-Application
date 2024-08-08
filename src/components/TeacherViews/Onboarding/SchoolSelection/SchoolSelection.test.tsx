import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";

import SchoolSelectionView from "./SchoolSelection.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("Onboarding view", () => {
  beforeAll(() => {
    fetchMock.doMock(
      JSON.stringify([
        {
          urn: "100224",
          la: "Hackney",
          name: "De Beauvoir Primary School",
          postcode: "E8 3DY",
          fullInfo: "100224, Hackney, De Beauvoir Primary School, E8 3DY",
          status: "Open, but proposed to close",
        },
      ]),
    );
  });

  it("renders a fieldset and legend", async () => {
    renderWithProviders()(<SchoolSelectionView />);

    const fieldset = await screen.findByRole("fieldset");
    expect(fieldset).toBeInTheDocument();
    const legend = await screen.findByText(/Select your school/i);
    expect(legend).toBeInTheDocument();

    expect(fieldset).toContainElement(legend);
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
