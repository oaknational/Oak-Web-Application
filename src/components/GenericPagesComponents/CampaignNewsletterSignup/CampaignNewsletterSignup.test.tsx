import React from "react";
import "@testing-library/jest-dom";
import { act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CampaignNewsletterSignup from "./CampaignNewsletterSignup";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import mockCampaign from "@/fixtures/campaign/mockCampaign";
import { NewsletterSignUp } from "@/common-lib/cms-types/campaignPage";
import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";

const mockData = mockCampaign.content.find(
  ({ type }) => type === "NewsletterSignUp",
) as NewsletterSignUp;

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    identify: jest.fn(),
  }),
}));

jest.mock("@/components/GenericPagesComponents/NewsletterForm", () => ({
  useNewsletterForm: () => ({
    onSubmit: () => {
      return Promise.resolve(true);
    },
  }),
}));

describe("CampaignNewsletterSignup", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });
  it("renders the heading", () => {
    const { getByText } = renderWithTheme(
      <CampaignNewsletterSignup data-testid="test" {...mockData} />,
    );
    const signUpHeading = getByText("newsletter-sign-up-heading-text");

    expect(signUpHeading).toBeInTheDocument();
  });

  it("renders the cta", () => {
    const { getByText } = renderWithTheme(
      <CampaignNewsletterSignup data-testid="test" {...mockData} />,
    );

    const signUpCta = getByText("newsletter-signup-cta-button");

    expect(signUpCta).toBeInTheDocument();
  });
  it("renders the form", async () => {
    const { findAllByRole, getByText } = renderWithTheme(
      <CampaignNewsletterSignup data-testid="test" {...mockData} />,
    );
    const formInputs = await findAllByRole("textbox");

    expect(formInputs).toHaveLength(2);

    const school = getByText("School (required)");
    const name = getByText("Name (required)");
    const email = getByText("Email (required)");
    expect(email).toBeInTheDocument();
    expect(school).toBeInTheDocument();
    expect(name).toBeInTheDocument();
  });

  it.only("renders an error if required fields are missing", async () => {
    const { getByTestId, getByRole, getByText, getByPlaceholderText } =
      renderWithTheme(
        <CampaignNewsletterSignup data-testid="test" {...mockData} />,
      );

    act(() => {
      getByTestId("download-school-isnt-listed").click();
    });
    const emailInput = getByPlaceholderText("Type your email address");
    await userEvent.type(emailInput, "test@example.com");

    act(() => {
      getByRole("button", { name: "newsletter-signup-cta-button" }).click();
    });

    await waitFor(() => {
      expect(getByText("Please enter your name")).toBeVisible();
    });
  });

  it("renders an error if required fields are missing", async () => {
    const { getByTestId, getByRole, getByText, getByPlaceholderText } =
      renderWithTheme(
        <CampaignNewsletterSignup data-testid="test" {...mockData} />,
      );

    act(() => {
      getByTestId("download-school-isnt-listed").click();
    });
    const emailInput = getByPlaceholderText("Type your email address");
    await userEvent.type(emailInput, "test@example.com");

    act(() => {
      getByRole("button", { name: "newsletter-signup-cta-button" }).click();
    });

    await waitFor(() => {
      expect(getByText("Please enter your name")).toBeVisible();
    });
  });

  it.only("renders a success message if all hubspot submit is successful", async () => {
    const { getByTestId, getByRole, getByText, getByPlaceholderText } =
      renderWithTheme(
        <CampaignNewsletterSignup data-testid="test" {...mockData} />,
      );

    act(() => {
      getByTestId("download-school-isnt-listed").click();
    });
    const nameInput = getByPlaceholderText("Type your name");
    await userEvent.type(nameInput, "Test");

    const emailInput = getByPlaceholderText("Type your email address");
    await userEvent.type(emailInput, "test@example.com");

    act(() => {
      getByRole("button", {
        name: "newsletter-signup-cta-button",
      }).click();
    });

    await waitFor(() => {
      expect(getByText("Thanks, that's been received")).toBeVisible();
    });
  });

  it("renders an error message if all hubspot submit is unsuccessful", async () => {
    (useNewsletterForm as jest.Mock).mockReturnValueOnce(() => ({
      onSubmit: () => {
        return Promise.resolve(false);
      },
    }));

    const { getByTestId, getByRole, getByText, getByPlaceholderText } =
      renderWithTheme(
        <CampaignNewsletterSignup data-testid="test" {...mockData} />,
      );

    act(() => {
      getByTestId("download-school-isnt-listed").click();
    });
    const nameInput = getByPlaceholderText("Type your name");
    await userEvent.type(nameInput, "Test");

    const emailInput = getByPlaceholderText("Type your email address");
    await userEvent.type(emailInput, "test@example.com");

    act(() => {
      getByRole("button", {
        name: "newsletter-signup-cta-button",
      }).click();
    });

    await waitFor(() => {
      expect(
        getByText("Sorry, we couldn't sign you up just now, try again later."),
      ).toBeVisible();
    });
  });
});
