import { screen, waitFor } from "@testing-library/dom";
import userEvent, { UserEvent } from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";
import mockRouter from "next-router-mock";

import OnboardingView from "./Onboarding.view";
import * as onboardingActions from "./onboardingActions";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("./onboardingActions");

describe("Onboarding view", () => {
  beforeAll(() => {
    fetchMock.enableMocks();
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

  afterAll(() => {
    fetchMock.disableMocks();
  });

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
  it("it enables the continue button when a school is selected", async () => {
    renderWithProviders()(<OnboardingView />);
    const continueButton = await screen.findByRole("button", {
      name: "Continue",
    });
    expect(continueButton).toBeDisabled();

    const user = userEvent.setup();
    await completeForm(user);

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

  describe("on submit", () => {
    beforeEach(() => {
      mockRouter.setCurrentUrl({
        pathname: "/onboarding",
        query: { returnTo: "/home" },
      });
    });

    describe("when successful", () => {
      beforeEach(() => {
        jest
          .spyOn(onboardingActions, "onboardUser")
          .mockResolvedValue({ "owa:onboarded": true });
      });

      it("logs the user in again silently and returns them to their original page", async () => {
        renderWithProviders()(<OnboardingView />);
        const user = userEvent.setup();
        await completeForm(user);
        await submitForm(user);

        await waitFor(() => {
          expect(mockRouter.pathname).toEqual("/api/auth/silent-login");
          expect(mockRouter.query.returnTo).toEqual("/home");
        });
      });
    });

    describe("when the server returns an error", () => {
      beforeEach(async () => {
        jest
          .spyOn(onboardingActions, "onboardUser")
          .mockRejectedValue(new Error());
      });

      it("displays an error", async () => {
        renderWithProviders()(<OnboardingView />);
        const user = userEvent.setup();
        await completeForm(user);
        await submitForm(user);

        expect(
          screen.getByText("Something went wrong. Please try again."),
        ).toBeInTheDocument();
      });
    });
  });
});

async function completeForm(user: UserEvent) {
  const inputBox = await screen.findByRole("combobox");
  await user.type(inputBox, "Bea");
  const school = await screen.findByText("uvoir Primary School", {
    exact: false,
  });
  await user.click(school);
}

async function submitForm(user: UserEvent) {
  await user.click(
    await screen.findByRole("button", {
      name: "Continue",
    }),
  );
}
