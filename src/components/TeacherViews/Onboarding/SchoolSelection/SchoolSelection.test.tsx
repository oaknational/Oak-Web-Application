import { fireEvent, screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import SchoolSelectionView from "./SchoolSelection.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const fetch = jest.spyOn(globalThis, "fetch") as jest.Mock;
fetch.mockResolvedValue(
  new Response(
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
    { status: 200 },
  ),
);

describe("Onboarding view", () => {
  it("renders a fieldset and legend", async () => {
    renderWithProviders()(<SchoolSelectionView />);

    const legend = await screen.findByText(/Select your school/i);
    expect(legend).toBeInTheDocument();
    const fieldset = legend.closest("fieldset");

    expect(fieldset).toBeInTheDocument();
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

      expect(screen.queryByText("School name")).toBeNull();
      expect(screen.queryByText("School address")).toBeNull();

      const manualButton = await screen.findByRole("button", {
        name: "Enter manually",
      });

      await userEvent.click(manualButton);

      expect(
        await screen.findByText("School name (required)"),
      ).toBeInTheDocument();
      expect(
        await screen.findByText("School address (required)"),
      ).toBeInTheDocument();
    });

    it("does not show school name error before clicking Continue", async () => {
      renderWithProviders()(<SchoolSelectionView />);
      const user = userEvent.setup();

      const manualButton = await screen.findByRole("button", {
        name: "Enter manually",
      });
      await userEvent.click(manualButton);
      const inputBox = await screen.findByPlaceholderText("Type school name");
      await user.type(inputBox, "  ");
      await user.tab();

      expect(screen.queryByText("Enter school name")).not.toBeInTheDocument();
    });
    it("does not show school address error before clicking Continue", async () => {
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

      expect(
        screen.queryByText("Enter school address"),
      ).not.toBeInTheDocument();
    });

    it("shows manual entry errors after clicking Continue", async () => {
      renderWithProviders()(<SchoolSelectionView />);

      const manualButton = await screen.findByRole("button", {
        name: "Enter manually",
      });
      await userEvent.click(manualButton);

      const continueButton = await screen.findByRole("button", {
        name: "Continue",
      });
      const form = continueButton.closest("form");
      expect(form).not.toBeNull();
      fireEvent.submit(form!);

      const schoolAddressError = await screen.findByText(
        "Enter school address",
      );
      expect(schoolAddressError).toBeInTheDocument();

      const schoolNameError = await screen.findByText("Enter school name");
      expect(schoolNameError).toBeInTheDocument();
    });
  });
});
