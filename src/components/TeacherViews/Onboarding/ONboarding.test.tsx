import { screen } from "@testing-library/dom";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";

import OnboardingView from "./Onboarding.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: () => "with-login",
}));
describe("Onboarding view", () => {
  it("renders a Continue button", async () => {
    renderWithProviders()(<OnboardingView />);
    const continueButton = await screen.findByRole("button", {
      name: "Continue",
    });

    expect(continueButton).toBeInTheDocument();
    expect(continueButton).not.toBeDisabled();
  });
  it("renders radio buttons with the correct labels", () => {
    renderWithProviders()(<OnboardingView />);

    const yesRadio = screen.getByRole("radio", { name: "Yes" });
    const noRadio = screen.getByRole("radio", { name: "No" });

    expect(yesRadio).toBeInTheDocument();
    expect(noRadio).toBeInTheDocument();
  });
  it("renders a legend in a fieldset", () => {
    renderWithProviders()(<OnboardingView />);

    const legend = screen.getByText(/Do you work in a school?/i);
    expect(legend).toBeInTheDocument();
    const fieldset = legend.closest("fieldset");

    expect(fieldset).toBeInTheDocument();
    expect(fieldset).toContainElement(legend);
  });

  it("shows no error message if button is clicked with a radio selected", async () => {
    renderWithProviders()(<OnboardingView />);

    await userEvent.click(screen.getByRole("radio", { name: "Yes" }), {
      pointerEventsCheck: PointerEventsCheckLevel.Never,
    });
    await userEvent.click(screen.getByText("Continue"), {
      pointerEventsCheck: PointerEventsCheckLevel.Never,
    });

    const error = screen.queryByText(/Please select if you work in a school/i);

    expect(error).not.toBeInTheDocument();
  });
  it("shows error message if button is clicked with no radio selected", async () => {
    renderWithProviders()(<OnboardingView />);

    await userEvent.click(screen.getByText("Continue"), {
      pointerEventsCheck: PointerEventsCheckLevel.Never,
    });

    const error = screen.queryByText(/Please select if you work in a school/i);

    expect(error).toBeInTheDocument();
  });
  it("does not show the error message initially", () => {
    renderWithProviders()(<OnboardingView />);

    const error = screen.queryByText(/Please select if you work in a school/i);
    expect(error).not.toBeInTheDocument();
  });
});
