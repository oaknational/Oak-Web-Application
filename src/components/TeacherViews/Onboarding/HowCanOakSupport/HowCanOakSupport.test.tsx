import { screen, waitFor } from "@testing-library/dom";
import mockRouter from "next-router-mock";

import HowCanOakSupport, { oakSupportMap } from "./HowCanOakSupport.view";

import renderWithProviders, {
  allProviders,
} from "@/__tests__/__helpers__/renderWithProviders";

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
      query: {
        newsletterSignUp: "true",
        schoolName:
          "Jefferson%20House%2C%20Cheshire%20West%20and%20Chester%2C%20CW7%201JT",
        school: "142332-Jefferson%20House",
      },
    });
    renderWithProviders({ ...allProviders, router: mockRouter })(
      <HowCanOakSupport />,
    );
    const continueButton = screen.getByRole("button", { name: /continue/i });
    await waitFor(() => expect(continueButton).toBeEnabled());
  });
});
