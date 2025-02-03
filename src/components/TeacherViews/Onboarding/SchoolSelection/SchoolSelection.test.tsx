import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import createFetchMock from "vitest-fetch-mock";
import { vi } from "vitest";

import SchoolSelectionView from "./SchoolSelection.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

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
  });
  it("renders contact us text", async () => {
    renderWithProviders()(<SchoolSelectionView />);
    const contactUs = await screen.findByText("Contact us", { exact: false });

    expect(contactUs).toBeInTheDocument();
    expect(contactUs.closest("a")).toHaveAttribute("href", "/contact-us");
  });

  it("clears the input when a school is not completed", async () => {
    renderWithProviders()(<SchoolSelectionView />);

    const inputBox = await screen.findByRole("combobox");

    const user = userEvent.setup();
    await user.type(inputBox, "Bea");
    await user.tab();
    expect(await screen.findByRole("combobox")).toHaveValue("");
  });

  describe("ManualEntrySchoolDetails component", () => {
    it("renders ManualEntrySchoolDetails component when Enter manually button clicked", async () => {
      renderWithProviders()(<SchoolSelectionView />);

      expect(await screen.queryByText("School name")).toBeNull();
      expect(await screen.queryByText("School address")).toBeNull();

      const manualButton = await screen.findByRole("button", {
        name: "Enter manually",
      });

      await userEvent.click(manualButton);

      expect(await screen.findByText("School name")).toBeInTheDocument();
      expect(await screen.findByText("School address")).toBeInTheDocument();
    });

    it("shows error message when school name is empty", async () => {
      renderWithProviders()(<SchoolSelectionView />);
      const user = userEvent.setup();

      const manualButton = await screen.findByRole("button", {
        name: "Enter manually",
      });
      await userEvent.click(manualButton);
      const inputBox = await screen.findByPlaceholderText("Type school name");
      await user.type(inputBox, "  ");
      await user.tab();

      const schoolNameError = await screen.findByText("Enter school name");
      expect(schoolNameError).toBeInTheDocument();
    });
    it("shows error message when school address is empty", async () => {
      renderWithProviders()(<SchoolSelectionView />);
      const user = userEvent.setup();

      const manualButton = await screen.findByRole("button", {
        name: "Enter manually",
      });
      await userEvent.click(manualButton);
      const inputBox = await screen.findByPlaceholderText(
        "Type school address",
      );
      await user.type(inputBox, "  ");
      await user.tab();

      const schoolAddressError = await screen.findByText(
        "Enter school address",
      );
      expect(schoolAddressError).toBeInTheDocument();
    });
  });
});
