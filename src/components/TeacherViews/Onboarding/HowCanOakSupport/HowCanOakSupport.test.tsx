import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import createFetchMock from "vitest-fetch-mock";
import { vi } from "vitest";

import HowCanOakSupport, { oakSupportMap } from "./HowCanOakSupport.view";

import renderWithProviders, {
  allProviders,
} from "@/__tests__/__helpers__/renderWithProviders";
import { encodeOnboardingDataQueryParam } from "@/components/TeacherComponents/OnboardingForm/onboardingDataQueryParam";
import { OnboardingFormProps } from "@/components/TeacherComponents/OnboardingForm/OnboardingForm.schema";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

describe("HowCanOakSupport", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl({
      pathname: "/onboarding/how-can-oak-support",
      query: encodeOnboardingDataQueryParam({}, {
        newsletterSignUp: true,
        schoolName: "Jefferson House, Cheshire West and Chester, CW7 1JT",
        school: "142332-Jefferson House",
      } as OnboardingFormProps),
    });
  });

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
    renderWithProviders({ ...allProviders, router: mockRouter })(
      <HowCanOakSupport />,
    );
    const continueButton = screen.getByRole("button", { name: /continue/i });
    await waitFor(() => expect(continueButton).toBeEnabled());
  });
  it("renders an error message if there is missing data", async () => {
    mockRouter.setCurrentUrl({
      pathname: "/onboarding/how-can-oak-support",
      query: {},
    });
    renderWithProviders()(<HowCanOakSupport />);
    await waitFor(() =>
      expect(
        screen.getByText(/An error occurred. Please/i),
      ).toBeInTheDocument(),
    );
  });

  it.each(["Continue", "Skip"])(
    `can be submitted with the %p button`,
    async (buttonName) => {
      renderWithProviders()(<HowCanOakSupport />);
      const button = screen.getByRole("button", { name: buttonName });

      await userEvent.click(
        screen.getByLabelText(
          "To support my department with specialist resources",
        ),
      );

      await userEvent.click(button);
    },
  );
});
