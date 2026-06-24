import { screen, waitFor } from "@testing-library/dom";
import mockRouter from "next-router-mock";
import fetchMock from "jest-fetch-mock";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";
import { useRouter, useSearchParams } from "next/navigation";

import HowCanOakSupport, { oakSupportMap } from "./HowCanOakSupport.view";

import renderWithProviders, {
  allProviders,
} from "@/__tests__/__helpers__/renderWithProviders";
import { encodeOnboardingDataQueryParam } from "@/components/TeacherComponents/OnboardingForm/onboardingDataQueryParam";
import * as onboardingActions from "@/components/TeacherComponents/OnboardingForm/onboardingActions";

jest.mock("next/router", () => require("next-router-mock"));
jest.mock(
  "@/components/TeacherComponents/OnboardingForm/onboardingActions",
  () => {
    const actual = jest.requireActual(
      "@/components/TeacherComponents/OnboardingForm/onboardingActions",
    );
    return {
      ...actual,
      onboardUser: jest.fn(),
      setOnboardingLocalStorage: jest.fn(),
      submitOnboardingHubspotData: jest.fn(),
    };
  },
);

fetchMock.enableMocks();

describe("HowCanOakSupport", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams({
        state: encodeOnboardingDataQueryParam(null, {
          newsletterSignUp: true,
          schoolName: "Jefferson House, Cheshire West and Chester, CW7 1JT",
          school: "142332-Jefferson House",
        }),
      }),
    );
    (onboardingActions.onboardUser as jest.Mock).mockResolvedValue({
      owa: { isTeacher: true, isOnboarded: true },
    });
    (
      onboardingActions.setOnboardingLocalStorage as jest.Mock
    ).mockResolvedValue(undefined);
    (
      onboardingActions.submitOnboardingHubspotData as jest.Mock
    ).mockResolvedValue(undefined);
  });

  it('renders checkboxes for each key in "oakSupportMap"', () => {
    const { unmount } = renderWithProviders()(<HowCanOakSupport />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(Object.keys(oakSupportMap).length);
    unmount();
  });
  it("renders a continue button that is enabled by default", async () => {
    renderWithProviders({ ...allProviders, router: mockRouter })(
      <HowCanOakSupport />,
    );
    const continueButton = screen.getByRole("button", { name: /continue/i });
    await waitFor(() => expect(continueButton).toBeEnabled());
  });
  it("renders an error message if there is missing data", async () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    renderWithProviders()(<HowCanOakSupport />);
    await waitFor(() =>
      expect(
        screen.getByText(/An error occurred. Please/i),
      ).toBeInTheDocument(),
    );
  });

  it("carries the school selected in a previous step through to onboarding", async () => {
    renderWithProviders()(<HowCanOakSupport />);

    await userEvent.click(screen.getByRole("button", { name: "Skip" }), {
      pointerEventsCheck: PointerEventsCheckLevel.Never,
    });

    // The school decoded from the `state` param must reach the onboarding call,
    // otherwise the user is incorrectly onboarded as a non-teacher.
    await waitFor(() =>
      expect(onboardingActions.onboardUser).toHaveBeenCalledWith({
        isTeacher: true,
      }),
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
        {
          pointerEventsCheck: PointerEventsCheckLevel.Never,
        },
      );

      await userEvent.click(button, {
        pointerEventsCheck: PointerEventsCheckLevel.Never,
      });
    },
  );
});
