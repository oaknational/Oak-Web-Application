import { screen, waitFor } from "@testing-library/dom";
import mockRouter from "next-router-mock";

import HowCanOakSupport, { oakSupportMap } from "./HowCanOakSupport.view";

import renderWithProviders, {
  allProviders,
} from "@/__tests__/__helpers__/renderWithProviders";
import { encodeOnboardingDataQueryParam } from "@/components/TeacherComponents/OnboardingForm/onboardingDataQueryParam";
import { OnboardingFormProps } from "@/components/TeacherComponents/OnboardingForm/OnboardingForm.schema";

jest.mock("next/router", () => require("next-router-mock"));

describe("HowCanOakSupport", () => {
  it("renders the onboarding layout with the correct prompt", () => {
    renderWithProviders()(<HowCanOakSupport />);
    const promptHeading = screen.getByText(/Last step.../i);
    expect(promptHeading).toBeInTheDocument();
    const promptBody = screen.getByText(
      /Tell us a little bit about you so we can tailor Oak to suit your needs./i,
    );
    expect(promptBody).toBeInTheDocument();
  });
  it('renders checkboxes for each key in "oakSupportMap"', () => {
    renderWithProviders()(<HowCanOakSupport />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(Object.keys(oakSupportMap).length);
  });
  it("renders a continue button that is enabled by default", async () => {
    mockRouter.push({
      pathname: "/onboarding/how-can-oak-support",
      query: encodeOnboardingDataQueryParam({}, {
        newsletterSignUp: true,
        schoolName: "Jefferson House, Cheshire West and Chester, CW7 1JT",
        school: "142332-Jefferson House",
      } as OnboardingFormProps),
    });
    renderWithProviders({ ...allProviders, router: mockRouter })(
      <HowCanOakSupport />,
    );
    const continueButton = screen.getByRole("button", { name: /continue/i });
    await waitFor(() => expect(continueButton).toBeEnabled());
  });
  it("disabled buttons and renders an error message if there is missing data", async () => {
    mockRouter.push({
      pathname: "/onboarding/how-can-oak-support",
      query: {},
    });
    renderWithProviders()(<HowCanOakSupport />);
    const continueButton = screen.getByRole("button", { name: /continue/i });
    await waitFor(() => expect(continueButton).toBeDisabled());
    const skipButton = screen.getByRole("button", { name: /skip/i });
    await waitFor(() => expect(skipButton).toBeDisabled());
    const errorMessage = screen.getByText(/An error occurred. Please/i);
    await waitFor(() => expect(errorMessage).toBeInTheDocument());
  });
});
